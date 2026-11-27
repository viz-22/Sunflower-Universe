import {
  SUNFLOWER_CONTENT,
  LoveLetterCategory,
  LoveLetterItem,
  PolaroidMemory,
} from '../config/sunflowerContent';

export type UniverseChapter =
  | 'opening'
  | 'garden'
  | 'secret-garden'
  | 'letters'
  | 'music'
  | 'memories'
  | 'grow'
  | 'final';

export type GrowthStage =
  | 'unplanted'
  | 'planted'
  | 'watered'
  | 'sprouted'
  | 'sunlit'
  | 'bloomed';

export interface GrowSunflowerState {
  stage: GrowthStage;
  waterCount: number;
  sunlightCount: number;
  name: string;
  namedAt?: string;
}

export interface EphemeralWish {
  id: string;
  text: string;
  createdAt: string;
}

export type SunlightModeLabel = 'Moonlight' | 'Golden Hour' | 'Sunrise';

export interface SunlightTheme {
  mode: SunlightModeLabel;
  intensity: number;
  skyHex: string;
  bgTopCss: string;
  bgBottomCss: string;
  surfaceCss: string;
  textCss: string;
  shadowSoftnessPx: number;
  threeSunIntensity: number;
  threeHemiIntensity: number;
  threeShadowRadius: number;
  ambienceStyle: 'dusk' | 'breeze' | 'sunrise';
}

export interface UniversePersistedState {
  hasEnteredUniverse: boolean;
  visitedFlowers: number[];
  discoveredSurprises: string[];
  unusualSunflowerComforted: boolean;
  letters: LoveLetterItem[];
  memories: PolaroidMemory[];
  growGame: GrowSunflowerState;
  wishes: EphemeralWish[];
  sunlightIntensity: number;
  eveningMode: boolean;
}

export const STORAGE_KEY = 'sunflower_little_universe_v1';

export function createDefaultUniverseState(): UniversePersistedState {
  return {
    hasEnteredUniverse: false,
    visitedFlowers: [],
    discoveredSurprises: [],
    unusualSunflowerComforted: false,
    letters: SUNFLOWER_CONTENT.initialLetters.map((l) => ({ ...l })),
    memories: SUNFLOWER_CONTENT.initialMemories.map((m) => ({ ...m })),
    growGame: {
      stage: 'unplanted',
      waterCount: 0,
      sunlightCount: 0,
      name: '',
    },
    wishes: [],
    sunlightIntensity: 55,
    eveningMode: false,
  };
}

export function getInitialChapterFromSearch(
  search: string,
  persistedHasEntered: boolean,
): UniverseChapter {
  const params = new URLSearchParams(search);
  const autostart = params.get('autostart');
  const chapter = params.get('chapter') as UniverseChapter | null;

  const validChapters: UniverseChapter[] = [
    'opening',
    'garden',
    'secret-garden',
    'letters',
    'music',
    'memories',
    'grow',
    'final',
  ];

  if (chapter && validChapters.includes(chapter)) {
    return chapter;
  }

  if (autostart === '1' || persistedHasEntered) {
    return 'garden';
  }

  return 'opening';
}

export function advanceGrowthState(
  current: GrowSunflowerState,
  action: 'plant' | 'water' | 'sunlight',
): GrowSunflowerState {
  switch (action) {
    case 'plant':
      if (current.stage === 'unplanted') {
        return { ...current, stage: 'planted' };
      }
      return current;

    case 'water':
      if (current.stage === 'planted') {
        return {
          ...current,
          stage: 'watered',
          waterCount: current.waterCount + 1,
        };
      }
      if (current.stage === 'watered') {
        return {
          ...current,
          stage: 'sprouted',
          waterCount: current.waterCount + 1,
        };
      }
      return current;

    case 'sunlight':
      if (current.stage === 'sprouted') {
        return {
          ...current,
          stage: 'sunlit',
          sunlightCount: current.sunlightCount + 1,
        };
      }
      if (current.stage === 'sunlit') {
        return {
          ...current,
          stage: 'bloomed',
          sunlightCount: current.sunlightCount + 1,
        };
      }
      return current;

    default:
      return current;
  }
}

export function setSunflowerName(
  current: GrowSunflowerState,
  rawName: string,
): { ok: boolean; state: GrowSunflowerState; error?: string } {
  const trimmed = rawName.trim();
  if (!trimmed) {
    return {
      ok: false,
      state: current,
      error: 'Please write a sweet name for your sunflower first.',
    };
  }
  if (trimmed.length > 36) {
    return {
      ok: false,
      state: current,
      error: 'Keep the sunflower name under 36 characters.',
    };
  }
  return {
    ok: true,
    state: {
      ...current,
      name: trimmed,
      namedAt: current.namedAt ?? new Date().toISOString(),
    },
  };
}

export function countGoldenSeedsFound(discoveredIds: string[]): number {
  const seedIds = SUNFLOWER_CONTENT.surprises
    .filter((s) => s.isGoldenSeed)
    .map((s) => s.id);
  return seedIds.filter((id) => discoveredIds.includes(id)).length;
}

export function isThreeSeedLetterUnlocked(discoveredIds: string[]): boolean {
  return countGoldenSeedsFound(discoveredIds) >= 3;
}

export function addOrUpdateLetter(
  letters: LoveLetterItem[],
  draft: {
    id?: string;
    category: LoveLetterCategory;
    title: string;
    salutation: string;
    body: string;
    closing: string;
  },
): { ok: boolean; letters: LoveLetterItem[]; error?: string } {
  const title = draft.title.trim();
  const body = draft.body.trim();
  const salutation = draft.salutation.trim() || 'Dearest you,';
  const closing = draft.closing.trim() || 'With all my love,';

  if (!title) {
    return { ok: false, letters, error: 'Please add a title for the letter.' };
  }
  if (!body) {
    return { ok: false, letters, error: 'Please write a message for the letter.' };
  }

  if (draft.id) {
    const exists = letters.some((l) => l.id === draft.id);
    if (exists) {
      return {
        ok: true,
        letters: letters.map((l) =>
          l.id === draft.id
            ? {
                ...l,
                category: draft.category,
                title,
                salutation,
                body,
                closing,
              }
            : l,
        ),
      };
    }
  }

  const newLetter: LoveLetterItem = {
    id: `letter-custom-${Date.now()}`,
    category: draft.category,
    title,
    salutation,
    body,
    closing,
    isCustom: true,
  };

  return {
    ok: true,
    letters: [newLetter, ...letters],
  };
}

export function updateMemoryItem(
  memories: PolaroidMemory[],
  id: string,
  patch: Partial<Pick<PolaroidMemory, 'imageSrc' | 'caption' | 'quote' | 'hiddenMessage'>>,
): PolaroidMemory[] {
  return memories.map((m) => (m.id === id ? { ...m, ...patch } : m));
}

export function addEphemeralWish(
  wishes: EphemeralWish[],
  rawText: string,
): { ok: boolean; wishes: EphemeralWish[]; newWish?: EphemeralWish; error?: string } {
  const text = rawText.trim();
  if (!text) {
    return {
      ok: false,
      wishes,
      error: 'Whisper a gentle wish before releasing the petal.',
    };
  }
  if (text.length > 240) {
    return {
      ok: false,
      wishes,
      error: 'Keep your wish within 240 characters.',
    };
  }
  const newWish: EphemeralWish = {
    id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    createdAt: new Date().toISOString(),
  };
  return {
    ok: true,
    wishes: [newWish, ...wishes],
    newWish,
  };
}

function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpHexColor(hexA: string, hexB: string, t: number): string {
  const a = parseInt(hexA.slice(1), 16);
  const b = parseInt(hexB.slice(1), 16);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(lerpNum(ar, br, t));
  const g = Math.round(lerpNum(ag, bg, t));
  const bl = Math.round(lerpNum(ab, bb, t));
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

export function computeSunlightTheme(rawIntensity: number): SunlightTheme {
  const intensity = Math.max(0, Math.min(100, Math.round(rawIntensity)));

  if (intensity <= 33) {
    const t = intensity / 33;
    return {
      mode: 'Moonlight',
      intensity,
      skyHex: lerpHexColor('#231B33', '#3D2E47', t),
      bgTopCss: lerpHexColor('#231B33', '#3E2F49', t),
      bgBottomCss: lerpHexColor('#35284A', '#5C414E', t),
      surfaceCss: lerpHexColor('#2F2542', '#473654', t),
      textCss: '#FFF7E7',
      shadowSoftnessPx: Number(lerpNum(28, 22, t).toFixed(1)),
      threeSunIntensity: Number(lerpNum(0.55, 0.95, t).toFixed(2)),
      threeHemiIntensity: Number(lerpNum(0.45, 0.55, t).toFixed(2)),
      threeShadowRadius: Number(lerpNum(6.5, 4.8, t).toFixed(1)),
      ambienceStyle: 'dusk',
    };
  }

  if (intensity <= 67) {
    const t = (intensity - 33) / 34;
    return {
      mode: 'Golden Hour',
      intensity,
      skyHex: lerpHexColor('#ECC28D', '#F9DCA4', t),
      bgTopCss: lerpHexColor('#F7E2BC', '#FFF7E7', t),
      bgBottomCss: lerpHexColor('#E8B584', '#F6D3B5', t),
      surfaceCss: '#FFFCF5',
      textCss: '#59391F',
      shadowSoftnessPx: Number(lerpNum(20, 14, t).toFixed(1)),
      threeSunIntensity: Number(lerpNum(1.15, 1.65, t).toFixed(2)),
      threeHemiIntensity: Number(lerpNum(0.58, 0.72, t).toFixed(2)),
      threeShadowRadius: Number(lerpNum(4.5, 3.0, t).toFixed(1)),
      ambienceStyle: 'breeze',
    };
  }

  const t = (intensity - 67) / 33;
  return {
    mode: 'Sunrise',
    intensity,
    skyHex: lerpHexColor('#F9DCA4', '#FDE9C9', t),
    bgTopCss: lerpHexColor('#FFF7E7', '#FFFDF8', t),
    bgBottomCss: lerpHexColor('#F6D3B5', '#FBE2C4', t),
    surfaceCss: '#FFFCF5',
    textCss: '#59391F',
    shadowSoftnessPx: Number(lerpNum(13, 8, t).toFixed(1)),
    threeSunIntensity: Number(lerpNum(1.7, 2.25, t).toFixed(2)),
    threeHemiIntensity: Number(lerpNum(0.75, 0.92, t).toFixed(2)),
    threeShadowRadius: Number(lerpNum(2.8, 1.4, t).toFixed(1)),
    ambienceStyle: 'sunrise',
  };
}

export function loadUniverseState(): UniversePersistedState {
  const fallback = createDefaultUniverseState();
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<UniversePersistedState>;
    const sunlightIntensity =
      typeof parsed.sunlightIntensity === 'number'
        ? Math.max(0, Math.min(100, parsed.sunlightIntensity))
        : parsed.eveningMode
          ? 18
          : fallback.sunlightIntensity;
    return {
      ...fallback,
      ...parsed,
      letters:
        Array.isArray(parsed.letters) && parsed.letters.length > 0
          ? parsed.letters
          : fallback.letters,
      memories:
        Array.isArray(parsed.memories) && parsed.memories.length > 0
          ? parsed.memories
          : fallback.memories,
      growGame: parsed.growGame ? { ...fallback.growGame, ...parsed.growGame } : fallback.growGame,
      visitedFlowers: Array.isArray(parsed.visitedFlowers) ? parsed.visitedFlowers : [],
      discoveredSurprises: Array.isArray(parsed.discoveredSurprises)
        ? parsed.discoveredSurprises
        : [],
      wishes: Array.isArray(parsed.wishes) ? parsed.wishes : [],
      sunlightIntensity,
      eveningMode: sunlightIntensity <= 33,
    };
  } catch {
    return fallback;
  }
}

export function saveUniverseState(state: UniversePersistedState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function clearUniverseState(): UniversePersistedState {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
  return createDefaultUniverseState();
}
