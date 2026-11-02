import { test } from 'node:test';
import assert from 'node:assert/strict';
import { people, officeSeatIds, levelOf, conditionFor, personSprite } from '../public/characters.js';

test('five independent character themes cover levels zero through fifteen', () => {
  assert.deepEqual(people.map((person)=>person.id),['jonathan','naufal','zikri','aji','agung']);
  for(const person of people) {
    const frames=new Set();
    for(let level=0;level<=15;level++) {
      const mood=conditionFor(person,level);
      assert.equal(mood.length,4);
      assert.ok(mood.every((text)=>typeof text==='string' && text.length>0));
      const sprite=personSprite(person.id,level);
      assert.ok(sprite.startsWith('<svg'));
      assert.ok(!sprite.includes('id="'),'office instances must not duplicate document IDs');
      assert.ok(!sprite.includes('NaN'));
      frames.add(sprite);
    }
    assert.equal(frames.size,16,`${person.name} needs a distinct appearance at every level`);
  }
  assert.deepEqual(officeSeatIds,['yasir','jonathan','agung','naufal','zikri','aji']);
  for(const person of people) assert.ok(personSprite(person.id,0).includes(`data-initial="${person.name[0]}"`));
  assert.match(personSprite('yasir'),/data-initial="Y"/);
  assert.ok(personSprite('naufal',15).includes('dragon-form'));
  assert.ok(personSprite('naufal',15).includes('dragon-breath'));
  assert.ok(personSprite('naufal',15).includes('class="glasses"'));
  assert.ok(!personSprite('naufal',0).includes('dragon-form'));
  assert.ok(personSprite('zikri',15).includes('spiral-eyes'));
  assert.ok(personSprite('zikri',15).includes('double-vision'));
  assert.ok(personSprite('aji',15).includes('empty-eyes'));
  assert.ok(personSprite('aji',15).includes('sad-cloud'));
  assert.ok(personSprite('aji',0).includes('data-height="normal"'));
  assert.ok(personSprite('jonathan',0).includes('data-height="normal"'));
  assert.equal(levelOf({count:0,step:3}),0);
  assert.equal(levelOf({count:44,step:3}),14);
  assert.equal(levelOf({count:45,step:3}),15);
  assert.equal(levelOf({count:999,step:3}),15);
  assert.equal(levelOf({count:30,step:2}),15);
  assert.match(personSprite('yasir'),/hantu departemen sebelah/);
  assert.ok(!people.some((person)=>person.id==='yasir'),'Yasir is an office ghost, not a sixth counter');
});
