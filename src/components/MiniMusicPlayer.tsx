import React from 'react';
import {
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipForward,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MusicTrack } from '../config/sunflowerContent';

interface MiniMusicPlayerProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTrack: MusicTrack;
  surprisesFoundCount: number;
  totalSurprises: number;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onToggleMute: () => void;
  onOpenMusicCorner: () => void;
  onOpenSurprises: () => void;
  onOpenSettings: () => void;
  onRestartExperience: () => void;
}

export const MiniMusicPlayer: React.FC<MiniMusicPlayerProps> = ({
  isPlaying,
  isMuted,
  currentTrack,
  surprisesFoundCount,
  totalSurprises,
  onTogglePlay,
  onNextTrack,
  onToggleMute,
  onOpenMusicCorner,
  onOpenSurprises,
  onOpenSettings,
  onRestartExperience,
}) => {
  return (
    <div
      style={{
        boxShadow: '0 8px var(--universe-shadow-blur) rgba(25, 16, 12, 0.22)',
      }}
      className="fixed bottom-3 left-1/2 z-40 w-[min(94vw,700px)] -translate-x-1/2 rounded-2xl border border-[#59391F]/15 bg-[#FFF7E7]/95 px-3 py-2 text-[#59391F] transition-shadow"
      role="region"
      aria-label="Universe Audio and Keepsake Controls"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* Music Play / Track Info */}
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F9C846] text-[#59391F] shadow-sm transition-transform hover:scale-105"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={onOpenMusicCorner}
            className="min-w-0 cursor-pointer text-left"
            aria-label={`Open Music Corner: ${currentTrack.title}`}
          >
            <div className="truncate text-xs sm:text-sm font-semibold leading-tight">
              {currentTrack.title}
            </div>
            <div className="truncate text-[11px] opacity-75 leading-tight">
              {currentTrack.category}
            </div>
          </button>
        </div>

        {/* Audio & Keepsake Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onNextTrack}
            aria-label="Next track"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#59391F]/15 bg-[#FFFCF5] text-[#59391F] transition-colors hover:bg-[#F6D3B5]/40"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#59391F]/15 bg-[#FFFCF5] text-[#59391F] transition-colors hover:bg-[#F6D3B5]/40"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 text-[#D98A47]" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={onOpenSurprises}
            aria-label={`Open secret surprises (${surprisesFoundCount} of ${totalSurprises} found)`}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[#D98A47]/35 bg-[#F9C846]/25 px-3 text-xs font-semibold text-[#59391F] whitespace-nowrap transition-colors hover:bg-[#F9C846]/45"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D98A47]" />
            <span className="tabular-nums">
              {surprisesFoundCount}/{totalSurprises}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open universe settings"
            title="Sunlight & Universe Settings"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#59391F]/15 bg-[#FFFCF5] text-[#59391F] transition-colors hover:bg-[#F6D3B5]/40"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onRestartExperience}
            aria-label="Restart experience from opening scene"
            title="Restart experience"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#59391F]/15 bg-[#FFFCF5] text-[#59391F] transition-colors hover:bg-[#F6D3B5]/40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

