import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addEphemeralWish,
  addOrUpdateLetter,
  advanceGrowthState,
  computeSunlightTheme,
  countGoldenSeedsFound,
  createDefaultUniverseState,
  getInitialChapterFromSearch,
  isThreeSeedLetterUnlocked,
  setSunflowerName,
  updateMemoryItem,
} from './universeState';

test('getInitialChapterFromSearch respects autostart and chapter query params', () => {
  assert.equal(getInitialChapterFromSearch('', false), 'opening');
  assert.equal(getInitialChapterFromSearch('', true), 'garden');
  assert.equal(getInitialChapterFromSearch('?autostart=1', false), 'garden');
  assert.equal(getInitialChapterFromSearch('?chapter=letters', false), 'letters');
  assert.equal(getInitialChapterFromSearch('?chapter=invalid', false), 'opening');
});

test('grow sunflower state machine progresses sequentially through all stages', () => {
  let state = createDefaultUniverseState().growGame;
  assert.equal(state.stage, 'unplanted');

  // Watering before planting should not skip planting
  state = advanceGrowthState(state, 'water');
  assert.equal(state.stage, 'unplanted');

  state = advanceGrowthState(state, 'plant');
  assert.equal(state.stage, 'planted');

  state = advanceGrowthState(state, 'water');
  assert.equal(state.stage, 'watered');

  state = advanceGrowthState(state, 'water');
  assert.equal(state.stage, 'sprouted');

  state = advanceGrowthState(state, 'sunlight');
  assert.equal(state.stage, 'sunlit');

  state = advanceGrowthState(state, 'sunlight');
  assert.equal(state.stage, 'bloomed');
  assert.equal(state.waterCount, 2);
  assert.equal(state.sunlightCount, 2);
});

test('setSunflowerName validates empty and overly long names', () => {
  const initial = {
    ...createDefaultUniverseState().growGame,
    stage: 'bloomed' as const,
  };

  const emptyResult = setSunflowerName(initial, '   ');
  assert.equal(emptyResult.ok, false);
  assert.ok(emptyResult.error);

  const longResult = setSunflowerName(initial, 'A'.repeat(40));
  assert.equal(longResult.ok, false);

  const validResult = setSunflowerName(initial, '  Sunny Ray  ');
  assert.equal(validResult.ok, true);
  assert.equal(validResult.state.name, 'Sunny Ray');
  assert.ok(validResult.state.namedAt);
});

test('golden seed tracker unlocks secret letter only when all 3 seeds are found', () => {
  assert.equal(countGoldenSeedsFound([]), 0);
  assert.equal(isThreeSeedLetterUnlocked([]), false);

  assert.equal(countGoldenSeedsFound(['surprise-seed-1', 'surprise-butterfly']), 1);
  assert.equal(isThreeSeedLetterUnlocked(['surprise-seed-1', 'surprise-seed-2']), false);

  assert.equal(
    countGoldenSeedsFound(['surprise-seed-1', 'surprise-seed-2', 'surprise-seed-3']),
    3,
  );
  assert.equal(
    isThreeSeedLetterUnlocked(['surprise-seed-1', 'surprise-seed-2', 'surprise-seed-3']),
    true,
  );
});

test('addOrUpdateLetter validates required fields, creates custom letters, and updates existing letters', () => {
  const initial = createDefaultUniverseState().letters;

  const missingBody = addOrUpdateLetter(initial, {
    category: 'Things I love about you',
    title: 'Hello',
    salutation: 'Dear,',
    body: '   ',
    closing: 'Love,',
  });
  assert.equal(missingBody.ok, false);

  const created = addOrUpdateLetter(initial, {
    category: 'Open when you miss me',
    title: 'A Quiet Afternoon',
    salutation: 'Hey sunshine,',
    body: 'Thinking of your warm smile right now.',
    closing: 'Always,',
  });
  assert.equal(created.ok, true);
  assert.equal(created.letters.length, initial.length + 1);
  assert.equal(created.letters[0].title, 'A Quiet Afternoon');
  assert.equal(created.letters[0].isCustom, true);

  const edited = addOrUpdateLetter(created.letters, {
    id: created.letters[0].id,
    category: 'Open when you miss me',
    title: 'A Golden Afternoon',
    salutation: 'Hey sunshine,',
    body: 'Updated heartfelt note.',
    closing: 'Always,',
  });
  assert.equal(edited.ok, true);
  assert.equal(edited.letters.length, created.letters.length);
  assert.equal(edited.letters[0].title, 'A Golden Afternoon');
});

test('updateMemoryItem updates photo and caption cleanly', () => {
  const memories = createDefaultUniverseState().memories;
  const updated = updateMemoryItem(memories, 'mem-slot-1', {
    caption: 'Summer walk at sunset',
    imageSrc: 'data:image/png;base64,AAA',
  });
  const target = updated.find((m) => m.id === 'mem-slot-1');
  assert.equal(target?.caption, 'Summer walk at sunset');
  assert.equal(target?.imageSrc, 'data:image/png;base64,AAA');
});

test('addEphemeralWish validates input and prepends saved wishes', () => {
  const emptyRes = addEphemeralWish([], '   ');
  assert.equal(emptyRes.ok, false);
  assert.ok(emptyRes.error);
  assert.equal(emptyRes.wishes.length, 0);

  const tooLongRes = addEphemeralWish([], 'x'.repeat(245));
  assert.equal(tooLongRes.ok, false);
  assert.ok(tooLongRes.error);

  const validRes = addEphemeralWish([], '  Always keep blooming under gentle skies  ');
  assert.equal(validRes.ok, true);
  assert.equal(validRes.wishes.length, 1);
  assert.equal(validRes.wishes[0].text, 'Always keep blooming under gentle skies');
  assert.ok(validRes.wishes[0].id.startsWith('wish-'));
  assert.ok(validRes.newWish);

  const secondRes = addEphemeralWish(validRes.wishes, 'More warm tea together');
  assert.equal(secondRes.ok, true);
  assert.equal(secondRes.wishes.length, 2);
  assert.equal(secondRes.wishes[0].text, 'More warm tea together');
});

test('computeSunlightTheme transitions across Moonlight, Golden Hour, and Sunrise', () => {
  const moon = computeSunlightTheme(10);
  assert.equal(moon.mode, 'Moonlight');
  assert.equal(moon.ambienceStyle, 'dusk');
  assert.equal(moon.textCss, '#FFF7E7');
  assert.ok(moon.threeSunIntensity < 1.0);
  assert.ok(moon.shadowSoftnessPx > 20);

  const golden = computeSunlightTheme(55);
  assert.equal(golden.mode, 'Golden Hour');
  assert.equal(golden.ambienceStyle, 'breeze');
  assert.equal(golden.textCss, '#59391F');
  assert.ok(golden.threeSunIntensity > 1.2 && golden.threeSunIntensity < 1.8);

  const sunrise = computeSunlightTheme(92);
  assert.equal(sunrise.mode, 'Sunrise');
  assert.equal(sunrise.ambienceStyle, 'sunrise');
  assert.equal(sunrise.textCss, '#59391F');
  assert.ok(sunrise.threeSunIntensity > 1.8);
  assert.ok(sunrise.shadowSoftnessPx < golden.shadowSoftnessPx);
});

