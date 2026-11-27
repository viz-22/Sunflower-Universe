import React from 'react';
import { Moon, SlidersHorizontal, Sun, Sunrise, X } from 'lucide-react';
import { SunlightTheme } from '../utils/universeState';

interface SettingsModalProps {
  isOpen: boolean;
  sunlightTheme: SunlightTheme;
  onChangeSunlightIntensity: (value: number) => void;
  onClose: () => void;
}

const PRESETS: { label: 'Moonlight' | 'Golden Hour' | 'Sunrise'; value: number }[] = [
  { label: 'Moonlight', value: 18 },
  { label: 'Golden Hour', value: 55 },
  { label: 'Sunrise', value: 88 },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  sunlightTheme,
  onChangeSunlightIntensity,
  onClose,
}) => {
  if (!isOpen) return null;

  const ambienceLabel =
    sunlightTheme.ambienceStyle === 'dusk'
      ? 'Moonlight Dusk · soft low-pass meadow'
      : sunlightTheme.ambienceStyle === 'sunrise'
        ? 'Morning Sunrise Breeze · luminous warmth'
        : 'Golden Meadow Breeze · amber acoustic calm';

  return (
    <div
      role="dialog"
      aria-label="Universe Settings"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2B1D14]/60 p-4"
    >
      <div
        style={{
          boxShadow: '0 14px var(--universe-shadow-blur) rgba(25, 16, 12, 0.34)',
        }}
        className="paper-texture relative my-auto w-full max-w-md rounded-3xl border border-[#D98A47]/40 px-6 py-7 text-[#59391F] sm:px-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close universe settings"
          className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-[#59391F] hover:bg-[#F6D3B5]/50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D98A47]">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Universe Atmosphere</span>
        </div>

        <h2 className="mt-1 font-display text-3xl font-semibold text-[#59391F]">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[#7A4F2B]">
          Shape the light, sky colors, shadow softness, and ambient soundscape across the entire universe.
        </p>

        {/* Sunlight Intensity Slider */}
        <div className="mt-6 rounded-2xl border border-[#59391F]/12 bg-[#FFF7E7]/85 p-4">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="sunlight-intensity-slider"
              className="text-sm font-semibold text-[#59391F]"
            >
              Sunlight Intensity
            </label>
            <span className="text-xs font-semibold text-[#D98A47] tabular-nums">
              {sunlightTheme.mode} · {sunlightTheme.intensity}%
            </span>
          </div>

          <input
            id="sunlight-intensity-slider"
            type="range"
            min={0}
            max={100}
            value={sunlightTheme.intensity}
            onChange={(e) => onChangeSunlightIntensity(Number(e.target.value))}
            className="mt-3 w-full cursor-pointer accent-[#D98A47]"
          />

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#7A4F2B]">
            <span>0 · Moonlight</span>
            <span>55 · Golden Hour</span>
            <span>100 · Sunrise</span>
          </div>

          {/* Quick Mode Presets */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const active = sunlightTheme.mode === preset.label;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChangeSunlightIntensity(preset.value)}
                  className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#59391F] text-[#FFF7E7]'
                      : 'border border-[#59391F]/18 bg-[#FFFCF5] text-[#59391F] hover:bg-[#F6D3B5]/45'
                  }`}
                >
                  {preset.label === 'Moonlight' && <Moon className="h-3.5 w-3.5" />}
                  {preset.label === 'Golden Hour' && <Sun className="h-3.5 w-3.5" />}
                  {preset.label === 'Sunrise' && <Sunrise className="h-3.5 w-3.5" />}
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Environment Details */}
        <div className="mt-4 space-y-2 rounded-2xl border border-[#59391F]/10 bg-[#FFFCF5]/90 p-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#7A4F2B]">3D Meadow Key Light</span>
            <span className="font-semibold text-[#59391F] tabular-nums">
              {sunlightTheme.threeSunIntensity.toFixed(2)} intensity
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#7A4F2B]">Shadow Softness</span>
            <span className="font-semibold text-[#59391F] tabular-nums">
              {sunlightTheme.shadowSoftnessPx}px blur · {sunlightTheme.threeShadowRadius} radius
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#7A4F2B]">Ambient Sound Style</span>
            <span className="text-right font-semibold text-[#59391F]">
              {ambienceLabel}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full bg-[#59391F] px-5 py-2 text-xs font-semibold text-[#FFF7E7] hover:bg-[#734A29]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
