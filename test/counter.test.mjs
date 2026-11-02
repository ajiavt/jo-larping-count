import { test } from 'node:test';
import assert from 'node:assert/strict';
import counter from '../api/counter.mjs';

test('counter API guards mutations and uses atomic storage', async (t) => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  process.env.ADMIN_PASSWORD = 'test-password';
  t.after(() => {
    globalThis.fetch = originalFetch;
    for (const name of ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_URL', 'KV_REST_API_TOKEN', 'ADMIN_PASSWORD']) {
      if (originalEnv[name] === undefined) delete process.env[name];
      else process.env[name] = originalEnv[name];
    }
  });

  const commands = [];
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    const command = JSON.parse(options.body);
    commands.push(command);
    return Response.json({ result: command[3].startsWith('larping-count:auth:') ? 1 : ['3', '3', '1'] });
  };
  const post = (body, origin = 'https://larp.example') => counter.fetch(new Request('https://larp.example/api/counter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  }));

  assert.equal((await post({ action: 'reset', password: 'wrong' })).status, 401);
  assert.equal(commands.length, 1, 'wrong password only reaches the rate limiter');
  assert.equal((await post({ action: 'settings', password: 'test-password', step: 0 })).status, 400);
  assert.equal((await post({ action: 'settings', password: 'test-password', step: 1.5 })).status, 400);
  assert.equal((await post({ action: 'settings', password: 'test-password', step: 1001 })).status, 400);
  assert.equal((await post({ action: 'hit' }, 'https://other.example')).status, 403);
  assert.equal((await post({ action: 'invalid' })).status, 400);

  const hit = await post({ action: 'hit' });
  assert.deepEqual(await hit.json(), { count: 3, step: 3, revision: 1 });
  assert.equal(hit.headers.get('cache-control'), 'no-store');
  assert.equal(commands.at(-1)[0], 'EVAL');
  assert.match(commands.at(-1)[1], /HINCRBY/);
  assert.equal(commands.at(-1)[4], 'hit');

  const beforeForgive = commands.length;
  assert.equal((await post({ action: 'forgive' })).status, 200);
  assert.equal(commands.length, beforeForgive + 1, 'forgiveness does not require admin authentication');
  assert.equal(commands.at(-1)[4], 'forgive');
  assert.equal((await post({ action: 'forgive' }, 'https://other.example')).status, 403);

  assert.equal((await post({ action: 'reset', password: 'test-password' })).status, 200);
  assert.equal(commands.at(-1)[4], 'reset');
  assert.equal((await post({ action: 'settings', password: 'test-password', step: 5 })).status, 200);
  assert.deepEqual(commands.at(-1).slice(3), ['larping-count:state', 'settings', '5']);
  assert.equal((await counter.fetch(new Request('https://larp.example/api/counter'))).status, 200);
  assert.equal(commands.at(-1)[4], 'read');

  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.KV_REST_API_URL = 'https://redis.example';
  process.env.KV_REST_API_TOKEN = 'test-token';
  assert.equal((await post({ action: 'hit' })).status, 200, 'Vercel integration variables work without manual aliases');

  globalThis.fetch = async () => Response.json({ result: 11 });
  assert.equal((await post({ action: 'reset', password: 'test-password' })).status, 429);
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.equal((await post({ action: 'hit' })).status, 503);
  delete process.env.KV_REST_API_TOKEN;
  assert.equal((await post({ action: 'hit' })).status, 503);
});
