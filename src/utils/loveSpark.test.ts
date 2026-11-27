import test from 'node:test';
import assert from 'node:assert/strict';
import { createCursorTrailSpark, createHeartBloomParticles } from './loveSpark';

test('createHeartBloomParticles builds symmetric glowing heart curve particles around click point', () => {
  const bloom = createHeartBloomParticles(400, 300, 14);
  assert.equal(bloom.length, 14);
  assert.ok(bloom.every((p) => p.x === 400 && p.y === 300));
  assert.ok(bloom.every((p) => p.size >= 14 && p.duration > 0.9));

  // Verify top/side heart spread exists (both negative & positive horizontal offsets)
  const hasLeft = bloom.some((p) => p.dx < -30);
  const hasRight = bloom.some((p) => p.dx > 30);
  const hasUpper = bloom.some((p) => p.dy < -30);
  const hasLowerTip = bloom.some((p) => p.dy > 30);
  assert.ok(hasLeft && hasRight && hasUpper && hasLowerTip);
});

test('createCursorTrailSpark emits unique cursor-following heart spark particles', () => {
  const a = createCursorTrailSpark(250, 180, 1);
  const b = createCursorTrailSpark(270, 190, 2);
  assert.notEqual(a.id, b.id);
  assert.equal(a.x, 250);
  assert.equal(a.y, 180);
  assert.ok(a.dy < 0);
});
