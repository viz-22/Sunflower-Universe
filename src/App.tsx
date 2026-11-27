import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import {
  LoveLetterCategory,
  PolaroidMemory,
  SUNFLOWER_CONTENT,
} from './config/sunflowerContent';
import { EphemeralWishOverlay } from './components/EphemeralWishOverlay';
import { FinalScene } from './components/FinalScene';
import { GrowSunflowerGame } from './components/GrowSunflowerGame';
import { LoveLetterGarden } from './components/LoveLetterGarden';
import { MemoryWall } from './components/MemoryWall';
import { MiniMusicPlayer } from './components/MiniMusicPlayer';
import { MusicCorner } from './components/MusicCorner';
import { OpeningScene } from './components/OpeningScene';
import { SettingsModal } from './components/SettingsModal';
import { FallingPetalsOverlay } from './components/StoryCharacters';
import { SunflowerGarden3D } from './components/SunflowerGarden3D';
import { SurprisesDrawer } from './components/SurprisesDrawer';
import { TopNavigation } from './components/TopNavigation';
import { AmbienceLayer, sunflowerAudio } from './utils/sunflowerAudio';
import {
  addEphemeralWish,
  addOrUpdateLetter,
  advanceGrowthState,
  clearUniverseState,
  computeSunlightTheme,
  getInitialChapterFromSearch,
  loadUniverseState,
  saveUniverseState,
  setSunflowerName,
  UniverseChapter,
  UniversePersistedState,
  updateMemoryItem,
} from './utils/universeState';

export default function App() {
  const [persisted, setPersisted] = useState<UniversePersistedState>(() =>
    loadUniverseState(),
  );
  const [chapter, setChapter] = useState<UniverseChapter>(() =>
    typeof window !== 'undefined'
      ? getInitialChapterFromSearch(window.location.search, loadUniverseState().hasEnteredUniverse)
      : 'opening',
  );

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [ambience, setAmbience] = useState<AmbienceLayer>('none');

  const [surprisesOpen, setSurprisesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [surpriseToast, setSurpriseToast] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [complimentIdx, setComplimentIdx] = useState(0);

  const currentTrack = useMemo(
    () => SUNFLOWER_CONTENT.musicTracks[trackIndex % SUNFLOWER_CONTENT.musicTracks.length],
    [trackIndex],
  );

  const sunlightTheme = useMemo(
    () => computeSunlightTheme(persisted.sunlightIntensity),
    [persisted.sunlightIntensity],
  );

  // Save state changes to localStorage
  useEffect(() => {
    saveUniverseState(persisted);
  }, [persisted]);

  // Apply global CSS variables & audio tone when Sunlight Intensity changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--universe-bg-top', sunlightTheme.bgTopCss);
    root.style.setProperty('--universe-bg-bottom', sunlightTheme.bgBottomCss);
    root.style.setProperty('--universe-surface', sunlightTheme.surfaceCss);
    root.style.setProperty('--universe-text', sunlightTheme.textCss);
    root.style.setProperty('--universe-shadow-blur', `${sunlightTheme.shadowSoftnessPx}px`);
    root.dataset.sunlightMode = sunlightTheme.mode;
    sunflowerAudio.setSunlightTone(sunlightTheme.mode);
  }, [sunlightTheme]);

  const handlePlaySfx = (
    kind: 'petal' | 'water' | 'sun' | 'bloom' | 'letter' | 'sparkle',
  ) => {
    sunflowerAudio.playSfx(kind);
  };

  const handleChangeSunlightIntensity = (rawValue: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(rawValue)));
    const nextTheme = computeSunlightTheme(clamped);
    setPersisted((prev) => ({
      ...prev,
      sunlightIntensity: clamped,
      eveningMode: nextTheme.mode === 'Moonlight',
    }));
    sunflowerAudio.setSunlightTone(nextTheme.mode);
    if (ambience !== 'rain') {
      setAmbience(nextTheme.ambienceStyle);
      if (isPlaying || ambience !== 'none') {
        sunflowerAudio.setAmbience(nextTheme.ambienceStyle);
      }
    }
  };

  const handleAddWish = (rawText: string) => {
    const res = addEphemeralWish(persisted.wishes, rawText);
    if (res.ok) {
      setPersisted((prev) => ({ ...prev, wishes: res.wishes }));
    }
    return { ok: res.ok, newWish: res.newWish, error: res.error };
  };

  const handleDiscoverSurprise = (id: string) => {
    if (id === '__toggle_evening__') {
      const nextIntensity = sunlightTheme.mode === 'Moonlight' ? 55 : 18;
      handleChangeSunlightIntensity(nextIntensity);
      sunflowerAudio.playSfx('sparkle');
      return;
    }

    const def = SUNFLOWER_CONTENT.surprises.find((s) => s.id === id);
    if (!def) return;

    setPersisted((prev) => {
      if (prev.discoveredSurprises.includes(id)) return prev;
      return {
        ...prev,
        discoveredSurprises: [...prev.discoveredSurprises, id],
      };
    });

    sunflowerAudio.playSfx('sparkle');
    setSurpriseToast({ title: def.title, message: def.message });
  };

  const handleFallingPetalClick = () => {
    const compliment =
      SUNFLOWER_CONTENT.petalCompliments[
        complimentIdx % SUNFLOWER_CONTENT.petalCompliments.length
      ];
    setComplimentIdx((i) => i + 1);

    setPersisted((prev) => ({
      ...prev,
      discoveredSurprises: prev.discoveredSurprises.includes('surprise-petal')
        ? prev.discoveredSurprises
        : [...prev.discoveredSurprises, 'surprise-petal'],
    }));
    sunflowerAudio.playSfx('petal');
    setSurpriseToast({
      title: 'A Falling Petal Note',
      message: compliment,
    });
  };

  const handleEnterUniverse = () => {
    setPersisted((prev) => ({ ...prev, hasEnteredUniverse: true }));
    setChapter('garden');
    if (!isPlaying && !isMuted) {
      sunflowerAudio.playTrack(currentTrack);
      setIsPlaying(true);
    }
    sunflowerAudio.playSfx('bloom');
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      sunflowerAudio.pause();
      setIsPlaying(false);
    } else {
      sunflowerAudio.playTrack(currentTrack);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track: (typeof SUNFLOWER_CONTENT.musicTracks)[number]) => {
    const idx = SUNFLOWER_CONTENT.musicTracks.findIndex((t) => t.id === track.id);
    if (idx >= 0) setTrackIndex(idx);
    sunflowerAudio.playTrack(track);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    const nextIdx = (trackIndex + 1) % SUNFLOWER_CONTENT.musicTracks.length;
    setTrackIndex(nextIdx);
    const nextTrack = SUNFLOWER_CONTENT.musicTracks[nextIdx];
    if (isPlaying) {
      sunflowerAudio.playTrack(nextTrack);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx =
      (trackIndex - 1 + SUNFLOWER_CONTENT.musicTracks.length) %
      SUNFLOWER_CONTENT.musicTracks.length;
    setTrackIndex(prevIdx);
    const prevTrack = SUNFLOWER_CONTENT.musicTracks[prevIdx];
    if (isPlaying) {
      sunflowerAudio.playTrack(prevTrack);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sunflowerAudio.setMuted(nextMuted);
  };

  const handleChangeVolume = (val: number) => {
    setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
      sunflowerAudio.setMuted(false);
    }
    sunflowerAudio.setVolume(val);
  };

  const handleChangeAmbience = (layer: AmbienceLayer) => {
    setAmbience(layer);
    sunflowerAudio.setAmbience(layer);
  };

  const handleFlowerVisited = (flowerId: number) => {
    setPersisted((prev) => ({
      ...prev,
      visitedFlowers: prev.visitedFlowers.includes(flowerId)
        ? prev.visitedFlowers
        : [...prev.visitedFlowers, flowerId],
    }));
  };

  const handleSaveLetter = (draft: {
    id?: string;
    category: LoveLetterCategory;
    title: string;
    salutation: string;
    body: string;
    closing: string;
  }) => {
    const res = addOrUpdateLetter(persisted.letters, draft);
    if (res.ok) {
      setPersisted((prev) => ({ ...prev, letters: res.letters }));
    }
    return { ok: res.ok, error: res.error };
  };

  const handleUpdateMemory = (
    id: string,
    patch: Partial<Pick<PolaroidMemory, 'imageSrc' | 'caption' | 'quote' | 'hiddenMessage'>>,
  ) => {
    setPersisted((prev) => ({
      ...prev,
      memories: updateMemoryItem(prev.memories, id, patch),
    }));
  };

  const handleGrowAction = (action: 'plant' | 'water' | 'sunlight') => {
    setPersisted((prev) => ({
      ...prev,
      growGame: advanceGrowthState(prev.growGame, action),
    }));
  };

  const handleNameSunflower = (name: string) => {
    const res = setSunflowerName(persisted.growGame, name);
    if (res.ok) {
      setPersisted((prev) => ({
        ...prev,
        growGame: res.state,
        discoveredSurprises: prev.discoveredSurprises.includes('surprise-gardener')
          ? prev.discoveredSurprises
          : [...prev.discoveredSurprises, 'surprise-gardener'],
      }));
    }
    return { ok: res.ok, error: res.error };
  };

  const handleResetPlant = () => {
    setPersisted((prev) => ({
      ...prev,
      growGame: {
        stage: 'unplanted',
        waterCount: 0,
        sunlightCount: 0,
        name: '',
      },
    }));
  };

  const handleRestartExperience = () => {
    sunflowerAudio.pause();
    sunflowerAudio.setAmbience('none');
    setIsPlaying(false);
    setAmbience('none');
    const fresh = clearUniverseState();
    setPersisted(fresh);
    setChapter('opening');
    setSurpriseToast(null);
    setSurprisesOpen(false);
    setSettingsOpen(false);
  };

  return (
    <div data-chapter={chapter} className="universe-page-bg min-h-screen">
      {/* Falling clickable petals across the universe */}
      <FallingPetalsOverlay onPetalClick={handleFallingPetalClick} />

      {/* Top Navigation (hidden in Opening Scene for cinematic immersion) */}
      {chapter !== 'opening' && (
        <TopNavigation
          activeChapter={chapter}
          onSelectChapter={(c) => {
            sunflowerAudio.setSoftDuck(false);
            setChapter(c);
          }}
          eveningMode={persisted.eveningMode}
        />
      )}

      {/* Main Content */}
      <main>
        {chapter === 'opening' && (
          <OpeningScene
            onEnterUniverse={handleEnterUniverse}
            onDiscoverButterfly={() => handleDiscoverSurprise('surprise-butterfly')}
          />
        )}

        {(chapter === 'garden' || chapter === 'secret-garden') && (
          <>
            <SunflowerGarden3D
              mode={chapter === 'secret-garden' ? 'secret' : 'main'}
              sunlightTheme={sunlightTheme}
              eveningMode={sunlightTheme.mode === 'Moonlight'}
              visitedFlowers={persisted.visitedFlowers}
              unusualComforted={persisted.unusualSunflowerComforted}
              discoveredSurprises={persisted.discoveredSurprises}
              onFlowerVisited={handleFlowerVisited}
              onEnterSecretGarden={() => setChapter('secret-garden')}
              onExitSecretGarden={() => {
                sunflowerAudio.setSoftDuck(false);
                setChapter('garden');
              }}
              onComfortUnusualSunflower={() =>
                setPersisted((prev) => ({ ...prev, unusualSunflowerComforted: true }))
              }
              onUnusualFocused={(focused) => sunflowerAudio.setSoftDuck(focused)}
              onDiscoverSurprise={handleDiscoverSurprise}
              onPlaySfx={handlePlaySfx}
            />
            <EphemeralWishOverlay
              mode={chapter === 'secret-garden' ? 'secret' : 'main'}
              wishes={persisted.wishes}
              onAddWish={handleAddWish}
              onPlaySfx={handlePlaySfx}
            />
          </>
        )}

        {chapter === 'letters' && (
          <LoveLetterGarden
            letters={persisted.letters}
            discoveredSurprises={persisted.discoveredSurprises}
            onSaveLetter={handleSaveLetter}
            onDiscoverSurprise={handleDiscoverSurprise}
            onPlaySfx={handlePlaySfx}
          />
        )}

        {chapter === 'music' && (
          <MusicCorner
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            ambience={ambience}
            onSelectTrack={handleSelectTrack}
            onTogglePlay={handleTogglePlay}
            onPrevTrack={handlePrevTrack}
            onNextTrack={handleNextTrack}
            onChangeVolume={handleChangeVolume}
            onToggleMute={handleToggleMute}
            onChangeAmbience={handleChangeAmbience}
          />
        )}

        {chapter === 'memories' && (
          <MemoryWall
            memories={persisted.memories}
            discoveredSurprises={persisted.discoveredSurprises}
            onUpdateMemory={handleUpdateMemory}
            onDiscoverSurprise={handleDiscoverSurprise}
            onPlaySfx={handlePlaySfx}
          />
        )}

        {chapter === 'grow' && (
          <GrowSunflowerGame
            growState={persisted.growGame}
            onAction={handleGrowAction}
            onNameSunflower={handleNameSunflower}
            onResetPlant={handleResetPlant}
            onPlaySfx={handlePlaySfx}
          />
        )}

        {chapter === 'final' && (
          <FinalScene
            onReturnToGarden={() => setChapter('garden')}
            onPlaySfx={handlePlaySfx}
          />
        )}
      </main>

      {/* Persistent Accessible Mini Music & Surprises Dock */}
      {chapter !== 'opening' && (
        <MiniMusicPlayer
          isPlaying={isPlaying}
          isMuted={isMuted}
          currentTrack={currentTrack}
          surprisesFoundCount={persisted.discoveredSurprises.length}
          totalSurprises={SUNFLOWER_CONTENT.surprises.length}
          onTogglePlay={handleTogglePlay}
          onNextTrack={handleNextTrack}
          onToggleMute={handleToggleMute}
          onOpenMusicCorner={() => setChapter('music')}
          onOpenSurprises={() => setSurprisesOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onRestartExperience={handleRestartExperience}
        />
      )}

      {/* Secret Surprises Discovery Toast */}
      {surpriseToast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            boxShadow: '0 10px var(--universe-shadow-blur) rgba(25, 16, 12, 0.25)',
          }}
          className="fixed bottom-20 left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-[#E8A92E] bg-[#FFFCF5] px-5 py-4 text-[#59391F]"
        >
          <button
            type="button"
            onClick={() => setSurpriseToast(null)}
            aria-label="Dismiss surprise note"
            className="absolute top-3 right-3 cursor-pointer rounded-full p-1 hover:bg-[#F6D3B5]/50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D98A47]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{surpriseToast.title}</span>
          </div>
          <p className="mt-1.5 font-hand text-2xl leading-snug text-[#59391F]">
            {surpriseToast.message}
          </p>
        </div>
      )}

      {/* Secret Surprises Journal Drawer */}
      <SurprisesDrawer
        isOpen={surprisesOpen}
        discoveredSurprises={persisted.discoveredSurprises}
        onClose={() => setSurprisesOpen(false)}
      />

      {/* Universe Settings Modal (Sunlight Intensity Slider) */}
      <SettingsModal
        isOpen={settingsOpen}
        sunlightTheme={sunlightTheme}
        onChangeSunlightIntensity={handleChangeSunlightIntensity}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
