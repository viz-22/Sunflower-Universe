import React from 'react';
import { CloudRain, Moon, Pause, Play, SkipBack, SkipForward, Sunrise, Volume2, VolumeX, Wind } from 'lucide-react';
import { MusicTrack, SUNFLOWER_CONTENT } from '../config/sunflowerContent';
import { AmbienceLayer } from '../utils/sunflowerAudio';
import { SunflowerLogo } from './SunflowerLogo';

interface MusicCornerProps {
  currentTrack: MusicTrack;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  ambience: AmbienceLayer;
  onSelectTrack: (track: MusicTrack) => void;
  onTogglePlay: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onChangeVolume: (vol: number) => void;
  onToggleMute: () => void;
  onChangeAmbience: (layer: AmbienceLayer) => void;
}

const WAVE_HEIGHTS = [24, 42, 68, 52, 84, 62, 46, 74, 58, 36, 64, 48];

export const MusicCorner: React.FC<MusicCornerProps> = ({
  currentTrack,
  isPlaying,
  isMuted,
  volume,
  ambience,
  onSelectTrack,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onChangeVolume,
  onToggleMute,
  onChangeAmbience,
}) => {
  return (
    <section
      aria-label="The Sunflower Music Corner"
      className="universe-page-bg min-h-screen px-4 pt-28 pb-28 sm:px-8 sm:pt-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-current/15 pb-6">
          <p className="text-xs font-semibold tracking-wider text-[#D98A47]">
            Chapter Four · Soundtracks for Every Mood
          </p>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl font-semibold">
            The Sunflower Music Corner
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base opacity-80">
            Gentle original instrumental melodies synthesized in real time, paired with soft meadow ambience whenever you want company.
          </p>
        </div>

        {/* Main Turntable & Player Card */}
        <div className="universe-shadow mt-8 grid grid-cols-1 gap-8 rounded-3xl border border-[#59391F]/12 bg-[#FFFCF5] p-6 text-[#59391F] lg:grid-cols-[300px_1fr] lg:p-8">
          {/* Spinning Sunflower Vinyl Record */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex h-60 w-60 items-center justify-center rounded-full bg-gradient-to-br from-[#3D2410] via-[#59391F] to-[#2B180A] shadow-xl">
              {/* Vinyl Grooves */}
              <div className="absolute inset-3 rounded-full border border-[#F9C846]/15" />
              <div className="absolute inset-7 rounded-full border border-[#F9C846]/15" />
              <div className="absolute inset-11 rounded-full border border-[#F9C846]/15" />
              <div className="absolute inset-15 rounded-full border border-[#F9C846]/15" />

              {/* Center Sunflower Label */}
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF7E7] shadow-inner ${
                  isPlaying ? 'animate-vinyl' : ''
                }`}
              >
                <SunflowerLogo size={64} />
              </div>
            </div>

            {/* Sound Wave Bars */}
            <div className="mt-5 flex h-10 items-end justify-center gap-1.5" aria-hidden="true">
              {WAVE_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-[#E8A92E] transition-all duration-300"
                  style={{
                    height: isPlaying && !isMuted ? `${h}%` : '22%',
                    opacity: isPlaying && !isMuted ? 0.88 : 0.35,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Track Details & Controls */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wider text-[#D98A47]">
                {currentTrack.category} · {currentTrack.durationLabel}
              </div>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-semibold">
                {currentTrack.title}
              </h2>
              <p className="mt-1 text-sm text-[#7A4F2B]">{currentTrack.subtitle}</p>
            </div>

            {/* Playback & Volume */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrevTrack}
                  aria-label="Previous track"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#59391F]/20 bg-[#FFF7E7] hover:bg-[#F6D3B5]/50"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onTogglePlay}
                  aria-label={isPlaying ? 'Pause music' : 'Play music'}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#59391F] text-[#FFF7E7] shadow-md transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={onNextTrack}
                  aria-label="Next track"
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#59391F]/20 bg-[#FFF7E7] hover:bg-[#F6D3B5]/50"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 min-w-[180px] items-center gap-2.5">
                <button
                  type="button"
                  onClick={onToggleMute}
                  aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
                  className="cursor-pointer rounded-full p-2 hover:bg-[#F6D3B5]/40"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-[#D98A47]" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <label htmlFor="music-volume-slider" className="sr-only">
                  Music Volume
                </label>
                <input
                  id="music-volume-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#D98A47] cursor-pointer"
                />
              </div>
            </div>

            {/* Ambience Layers */}
            <div className="mt-6 border-t border-[#59391F]/10 pt-5">
              <div className="text-xs font-semibold text-[#7A4F2B] mb-2.5">
                Background Ambience
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'none', label: 'Quiet', icon: null },
                    { id: 'breeze', label: 'Meadow Breeze', icon: Wind },
                    { id: 'sunrise', label: 'Sunrise Breeze', icon: Sunrise },
                    { id: 'rain', label: 'Soft Rain', icon: CloudRain },
                    { id: 'dusk', label: 'Evening Dusk', icon: Moon },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const active = ambience === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChangeAmbience(item.id)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? 'bg-[#526B42] text-[#FFF7E7]'
                          : 'border border-[#59391F]/15 bg-[#FFF7E7] text-[#59391F] hover:bg-[#F6D3B5]/45'
                      }`}
                    >
                      {Icon && <Icon className="h-3.5 w-3.5" />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 5 Mood Categories Playlist */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SUNFLOWER_CONTENT.musicTracks.map((track) => {
            const selected = track.id === currentTrack.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => onSelectTrack(track)}
                className={`universe-shadow cursor-pointer rounded-2xl border p-4 text-left text-[#59391F] transition-all ${
                  selected
                    ? 'border-[#D98A47] bg-[#F9C846]/25'
                    : 'border-[#59391F]/10 bg-[#FFFCF5] hover:border-[#D98A47]/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#D98A47] font-medium">
                  <span>{track.category}</span>
                  <span className="tabular-nums opacity-75">{track.durationLabel}</span>
                </div>
                <div className="mt-1 font-display text-xl font-semibold">{track.title}</div>
                <div className="mt-0.5 text-xs text-[#7A4F2B]">{track.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
