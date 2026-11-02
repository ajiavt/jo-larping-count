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
    return Response.json({ result: command[3].startsWith('larping-count:auth:') ? 1 : [['3','3','1'],['8','2','5'],['0','3','0'],['6','3','2'],['1','3','1']] });
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
  const hitState=await hit.json();
  assert.equal(hitState.character,'jonathan');
  assert.deepEqual(hitState.characters.jonathan,{count:3,step:3,revision:1});
  assert.deepEqual(Object.keys(hitState.characters),['jonathan','naufal','zikri','aji','agung']);
  assert.equal(hitState.count,3);
  assert.equal(commands.at(-1)[3],'larping-count:state','Jonathan retains the original storage key');
  assert.equal(hit.headers.get('cache-control'), 'no-store');
  assert.equal(commands.at(-1)[0], 'EVAL');
  assert.match(commands.at(-1)[1], /HINCRBY/);
  assert.deepEqual(commands.at(-1).slice(-3),['hit','','1']);

  const beforeForgive = commands.length;
  assert.equal((await post({ action: 'forgive' })).status, 200);
  assert.equal(commands.length, beforeForgive + 1, 'forgiveness does not require admin authentication');
  assert.deepEqual(commands.at(-1).slice(-3),['forgive','','1']);
  assert.equal((await post({ action: 'forgive' }, 'https://other.example')).status, 403);

  assert.equal((await post({ action: 'reset', password: 'test-password' })).status, 200);
  assert.deepEqual(commands.at(-1).slice(-3),['reset','','1']);
  assert.equal((await post({ action: 'settings', password: 'test-password', step: 5 })).status, 200);
  assert.deepEqual(commands.at(-1).slice(-3),['settings','5','1']);
  assert.equal((await counter.fetch(new Request('https://larp.example/api/counter'))).status, 200);
  assert.deepEqual(commands.at(-1).slice(-3),['read','','1']);
  const naufal=await (await post({action:'hit',character:'naufal'})).json();
  assert.equal(naufal.count,8);
  assert.equal(naufal.characters.jonathan.count,3,'other counters are returned separately');
  assert.equal(commands.at(-1).at(-1),'2','mutation targets the selected character key');
  assert.equal((await post({action:'reset',character:'aji',password:'test-password'})).status,200);
  assert.deepEqual(commands.at(-1).slice(-3),['reset','','4']);
  const beforeInvalid=commands.length;
  assert.equal((await post({action:'hit',character:'yasir'})).status,400);
  assert.equal((await post({action:'hit',character:'../../other'})).status,400);
  assert.equal(commands.length,beforeInvalid,'invalid characters never reach storage');
  assert.equal((await counter.fetch(new Request('https://larp.example/api/counter?character=unknown'))).status,400);
  const agung=await (await counter.fetch(new Request('https://larp.example/api/counter?character=agung'))).json();
  assert.equal(agung.character,'agung');
  assert.equal(agung.count,1);

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
