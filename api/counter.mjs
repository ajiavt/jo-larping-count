import { createHash, timingSafeEqual } from 'node:crypto';

const stateKey = 'larping-count:state';
const stateScript = `
  local action = ARGV[1]
  if action == 'hit' then
    local count = tonumber(redis.call('HGET', KEYS[1], 'count') or '0')
    if count >= 9007199254740991 then return redis.error_reply('Counter limit reached') end
    redis.call('HINCRBY', KEYS[1], 'count', 1)
  elseif action == 'reset' then
    redis.call('HSET', KEYS[1], 'count', 0)
  elseif action == 'settings' then
    redis.call('HSET', KEYS[1], 'step', ARGV[2])
  end
  if action ~= 'read' then redis.call('HINCRBY', KEYS[1], 'revision', 1) end
  return {
    redis.call('HGET', KEYS[1], 'count') or '0',
    redis.call('HGET', KEYS[1], 'step') or '3',
    redis.call('HGET', KEYS[1], 'revision') or '0'
  }
`;

const limitScript = `
  local attempts = redis.call('INCR', KEYS[1])
  if attempts == 1 then redis.call('EXPIRE', KEYS[1], 60) end
  return attempts
`;

async function redis(command) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
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

    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return json({ error: 'Counter belum terhubung. Konfigurasikan Redis di Vercel dulu.' }, 503);
    }

    try {
      let action = 'read';
      let step = '';

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
        if (!body || typeof body !== 'object' || !['hit', 'reset', 'settings'].includes(body.action)) {
          return json({ error: 'Aksi tidak valid.' }, 400);
        }
        action = body.action;

        if (action !== 'hit') {
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
            return json({ error: 'Password salah. Jonathan belum mengizinkan.' }, 401);
          }
        }

        if (action === 'settings') {
          if (!Number.isInteger(body.step) || body.step < 1 || body.step > 1000) {
            return json({ error: 'Kelipatan harus angka bulat antara 1 dan 1.000.' }, 400);
          }
          step = String(body.step);
        }
      }

      const values = await redis(['EVAL', stateScript, 1, stateKey, action, step]);
      const [count, damageStep, revision] = values.map(Number);
      return json({ count, step: damageStep, revision });
    } catch {
      return json({ error: 'Koneksi counter bermasalah. Muat ulang untuk melihat angka terakhir.' }, 503);
    }
  },
};
