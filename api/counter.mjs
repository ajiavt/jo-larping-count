import { createHash, timingSafeEqual } from 'node:crypto';

const characterIds = ['jonathan', 'naufal', 'zikri', 'aji', 'agung'];
const stateKeys = characterIds.map((id) => id === 'jonathan' ? 'larping-count:state' : `larping-count:state:${id}`);
const stateScript = `
  local action = ARGV[1]
  local key = KEYS[tonumber(ARGV[3])]
  if action == 'hit' then
    local count = tonumber(redis.call('HGET', key, 'count') or '0')
    if count >= 9007199254740991 then return redis.error_reply('Counter limit reached') end
    redis.call('HINCRBY', key, 'count', 1)
  elseif action == 'forgive' then
    local count = tonumber(redis.call('HGET', key, 'count') or '0')
    if count > 0 then redis.call('HINCRBY', key, 'count', -1) end
  elseif action == 'reset' then
    redis.call('HSET', key, 'count', 0)
  elseif action == 'settings' then
    redis.call('HSET', key, 'step', ARGV[2])
  end
  if action ~= 'read' then redis.call('HINCRBY', key, 'revision', 1) end
  local states = {}
  for _, entry in ipairs(KEYS) do
    table.insert(states, {
      redis.call('HGET', entry, 'count') or '0',
      redis.call('HGET', entry, 'step') or '3',
      redis.call('HGET', entry, 'revision') or '0'
    })
  end
  return states
`;

const limitScript = `
  local attempts = redis.call('INCR', KEYS[1])
  if attempts == 1 then redis.call('EXPIRE', KEYS[1], 60) end
  return attempts
`;

async function redis(command) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(8000),
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error('Redis request failed');
  return data.result;
}

function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

export default {
  async fetch(request) {
    if (!['GET', 'POST'].includes(request.method)) {
      return json({ error: 'Metode tidak didukung.' }, 405, { Allow: 'GET, POST' });
    }

    if (!(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL)
      || !(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)) {
      return json({ error: 'Counter belum terhubung. Konfigurasikan Redis di Vercel dulu.' }, 503);
    }

    try {
      let action = 'read';
      let step = '';
      let character = new URL(request.url).searchParams.get('character') || 'jonathan';

      if (request.method === 'POST') {
        const origin = request.headers.get('origin');
        if (origin && origin !== new URL(request.url).origin) {
          return json({ error: 'Request lintas situs ditolak.' }, 403);
        }
        if (!request.headers.get('content-type')?.startsWith('application/json')) {
          return json({ error: 'Gunakan JSON.' }, 415);
        }
        const text = await request.text();
        if (text.length > 1024) return json({ error: 'Request terlalu besar.' }, 413);
        let body;
        try { body = JSON.parse(text); } catch {
          return json({ error: 'JSON tidak valid.' }, 400);
        }
        if (!body || typeof body !== 'object' || !['hit', 'forgive', 'reset', 'settings'].includes(body.action)) {
          return json({ error: 'Aksi tidak valid.' }, 400);
        }
        action = body.action;
        character = body.character ?? character;
        if (!characterIds.includes(character)) return json({ error: 'Karakter tidak dikenal.' }, 400);

        if (action === 'reset' || action === 'settings') {
          if (!process.env.ADMIN_PASSWORD) {
            return json({ error: 'Password admin belum dikonfigurasi.' }, 503);
          }
          const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
          const ipHash = createHash('sha256').update(ip).digest('hex');
          const attempts = await redis(['EVAL', limitScript, 1, `larping-count:auth:${ipHash}`]);
          if (attempts > 10) {
            return json({ error: 'Kebanyakan percobaan. Tunggu satu menit ya.' }, 429, { 'Retry-After': '60' });
          }
          const supplied = createHash('sha256').update(typeof body.password === 'string' ? body.password : '').digest();
          const expected = createHash('sha256').update(process.env.ADMIN_PASSWORD).digest();
          if (!timingSafeEqual(supplied, expected)) {
            return json({ error: 'Password salah. Akses admin ditolak.' }, 401);
          }
        }

        if (action === 'settings') {
          if (!Number.isInteger(body.step) || body.step < 1 || body.step > 1000) {
            return json({ error: 'Kelipatan harus angka bulat antara 1 dan 1.000.' }, 400);
          }
          step = String(body.step);
        }
      }

      const index = characterIds.indexOf(character);
      if (index < 0) return json({ error: 'Karakter tidak dikenal.' }, 400);
      const values = await redis(['EVAL', stateScript, stateKeys.length, ...stateKeys, action, step, String(index + 1)]);
      const characters = Object.fromEntries(characterIds.map((id, position) => {
        const [count, damageStep, revision] = values[position].map(Number);
        return [id, { count, step: damageStep, revision }];
      }));
      return json({ ...characters[character], character, characters });
    } catch {
      return json({ error: 'Koneksi counter bermasalah. Muat ulang untuk melihat angka terakhir.' }, 503);
    }
  },
};
