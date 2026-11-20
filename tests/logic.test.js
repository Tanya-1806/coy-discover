const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../lib/logic');
const seed = require('../data/profiles.json');

const profiles = [
  { id: 'a', name: 'A', likedYou: true },
  { id: 'b', name: 'B', likedYou: false },
  { id: 'c', name: 'C', likedYou: true },
];

test('seed data: 30+ complete profiles, some already like the user', () => {
  assert.ok(seed.length >= 30);
  for (const p of seed) {
    for (const k of ['id', 'name', 'age', 'photo', 'bio', 'place', 'interests']) assert.ok(p[k], `${p.id} missing ${k}`);
  }
  assert.equal(new Set(seed.map((p) => p.id)).size, seed.length);
  assert.ok(seed.some((p) => p.likedYou));
});

test('feed never leaks likedYou', () => {
  const feed = L.getFeed(profiles, L.emptyState());
  assert.equal(feed.length, 3);
  assert.ok(feed.every((p) => !('likedYou' in p)));
});

test('liking someone who liked you creates a match', () => {
  const r = L.applySwipe(profiles, L.emptyState(), 'a', 'like');
  assert.equal(r.status, 200);
  assert.equal(r.match, true);
  assert.ok(!('likedYou' in r.profile));
  assert.deepEqual(r.state.matches, ['a']);
});

test('liking someone who has not liked you is not a match', () => {
  const r = L.applySwipe(profiles, L.emptyState(), 'b', 'like');
  assert.equal(r.match, false);
  assert.deepEqual(r.state.matches, []);
});

test('passing never matches, even if they liked you', () => {
  const r = L.applySwipe(profiles, L.emptyState(), 'a', 'pass');
  assert.equal(r.match, false);
  assert.equal(r.state.swipes.a, 'pass');
});

test('swiped profiles never reappear in the feed', () => {
  let s = L.applySwipe(profiles, L.emptyState(), 'a', 'pass').state;
  s = L.applySwipe(profiles, s, 'b', 'like').state;
  assert.deepEqual(L.getFeed(profiles, s).map((p) => p.id), ['c']);
});

test('duplicate swipe is rejected (409) and cannot flip a pass into a match', () => {
  const s = L.applySwipe(profiles, L.emptyState(), 'a', 'pass').state;
  const r = L.applySwipe(profiles, s, 'a', 'like');
  assert.equal(r.status, 409);
  assert.deepEqual(s.matches, []);
});

test('validation: bad direction 400, unknown profile 404, bad id 400', () => {
  assert.equal(L.applySwipe(profiles, L.emptyState(), 'a', 'super').status, 400);
  assert.equal(L.applySwipe(profiles, L.emptyState(), 'zzz', 'like').status, 404);
  assert.equal(L.applySwipe(profiles, L.emptyState(), 42, 'like').status, 400);
});

test('state is not mutated and matches list is newest-first without leaks', () => {
  const s0 = L.emptyState();
  const s1 = L.applySwipe(profiles, s0, 'a', 'like').state;
  const s2 = L.applySwipe(profiles, s1, 'c', 'like').state;
  assert.deepEqual(s0, L.emptyState());
  const m = L.getMatches(profiles, s2);
  assert.deepEqual(m.map((p) => p.id), ['c', 'a']);
  assert.ok(m.every((p) => !('likedYou' in p)));
});
