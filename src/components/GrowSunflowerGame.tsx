import React, { useState } from 'react';
import { Droplets, RotateCcw, Sprout, Sun } from 'lucide-react';
import { SUNFLOWER_CONTENT } from '../config/sunflowerContent';
import { GrowSunflowerState } from '../utils/universeState';

interface GrowSunflowerGameProps {
  growState: GrowSunflowerState;
  onAction: (action: 'plant' | 'water' | 'sunlight') => void;
  onNameSunflower: (name: string) => { ok: boolean; error?: string };
  onResetPlant: () => void;
  onPlaySfx: (kind: 'petal' | 'water' | 'sun' | 'bloom' | 'letter' | 'sparkle') => void;
}

const STAGE_LABEL: Record<GrowSunflowerState['stage'], string> = {
  unplanted: 'Step 1 · Hold this little sunflower seed and plant it in warm soil.',
  planted: 'Step 2 · The seed is tucked in. Give the soil a gentle drink of water.',
  watered: 'Step 3 · Keep watering softly so the seed wakes up.',
  sprouted: 'Step 4 · A tiny green sprout appeared! Now give it golden sunlight.',
  sunlit: 'Step 5 · Leaves are stretching wide! Add one more ray of sunshine to bloom.',
  bloomed: 'Full Bloom · Your sunflower opened toward the sky.',
};

export const GrowSunflowerGame: React.FC<GrowSunflowerGameProps> = ({
  growState,
  onAction,
  onNameSunflower,
  onResetPlant,
  onPlaySfx,
}) => {
  const [nameInput, setNameInput] = useState(growState.name || '');
  const [nameError, setNameError] = useState<string | null>(null);

  const handlePlant = () => {
    onAction('plant');
    onPlaySfx('petal');
  };

  const handleWater = () => {
    onAction('water');
    onPlaySfx('water');
  };

  const handleSunlight = () => {
    const willBloom = growState.stage === 'sunlit';
    onAction('sunlight');
    onPlaySfx(willBloom ? 'bloom' : 'sun');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onNameSunflower(nameInput);
    if (!res.ok) {
      setNameError(res.error ?? 'Please enter a name.');
      return;
    }
    setNameError(null);
    onPlaySfx('sparkle');
  };

  const stage = growState.stage;

  return (
    <section
      aria-label="Grow Your Own Sunflower"
      className="universe-page-bg min-h-screen px-4 pt-28 pb-36 sm:px-8 sm:pt-24"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider text-[#D98A47]">
            Chapter Six · Grow Something Gentle
          </p>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl font-semibold">
            Grow Your Own Sunflower
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base opacity-80">
            {STAGE_LABEL[stage]}
          </p>
        </div>

        {/* Botanical Stage Canvas */}
        <div className="universe-shadow mt-6 flex flex-col items-center rounded-3xl border border-[#59391F]/12 bg-[#FFFCF5] p-6 text-[#59391F] sm:p-8">
          <div className="relative flex h-60 w-full max-w-md items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#FBE0A8]/45 via-[#FFF7E7] to-[#E6D5BC]/40 pt-4">
            {/* Warm Sunbeam when sunlit or bloomed */}
            {(stage === 'sunlit' || stage === 'bloomed') && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 right-6 h-40 w-40 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(249,200,70,0.68) 0%, rgba(249,200,70,0.18) 50%, rgba(249,200,70,0) 75%)',
                }}
              />
            )}

            <svg
              viewBox="0 0 260 220"
              className="h-56 w-64"
              aria-label={`Sunflower growth stage: ${stage}`}
            >
              {/* Terracotta Pot & Soil */}
              <path d="M72 162 H188 L174 210 H86 Z" fill="#D98A47" />
              <rect x="64" y="150" width="132" height="14" rx="6" fill="#C47435" />
              <ellipse cx="130" cy="150" rx="58" ry="8" fill="#59391F" />

              {/* Unplanted seed hovering above soil */}
              {stage === 'unplanted' && (
                <ellipse cx="130" cy="112" rx="8" ry="12" fill="#3D2410" stroke="#E8A92E" strokeWidth="1.5" />
              )}

              {/* Planted / Watered mound */}
              {(stage === 'planted' || stage === 'watered') && (
                <>
                  <path d="M112 150 Q130 138 148 150 Z" fill="#4A2E17" />
                  {stage === 'watered' && (
                    <g fill="#7EC8E3" opacity="0.85">
                      <circle cx="118" cy="126" r="3" />
                      <circle cx="132" cy="118" r="3.5" />
                      <circle cx="144" cy="128" r="2.8" />
                    </g>
                  )}
                </>
              )}

              {/* Sprouted */}
              {stage === 'sprouted' && (
                <g>
                  <path d="M130 148 Q128 128 130 112" stroke="#526B42" strokeWidth="4.5" strokeLinecap="round" />
                  <ellipse cx="121" cy="114" rx="10" ry="5" transform="rotate(-24 121 114)" fill="#6E8E58" />
                  <ellipse cx="139" cy="114" rx="10" ry="5" transform="rotate(24 139 114)" fill="#6E8E58" />
                </g>
              )}

              {/* Sunlit with taller leaves */}
              {stage === 'sunlit' && (
                <g>
                  <path d="M130 148 Q127 104 130 72" stroke="#526B42" strokeWidth="5.5" strokeLinecap="round" />
                  <ellipse cx="116" cy="118" rx="14" ry="7" transform="rotate(-26 116 118)" fill="#5E7D4A" />
                  <ellipse cx="144" cy="100" rx="14" ry="7" transform="rotate(26 144 100)" fill="#6E8E58" />
                  <circle cx="130" cy="68" r="11" fill="#526B42" />
                  <circle cx="130" cy="68" r="6" fill="#E8A92E" />
                </g>
              )}

              {/* Full Bloom */}
              {stage === 'bloomed' && (
                <g>
                  <path d="M130 148 Q126 96 130 56" stroke="#526B42" strokeWidth="6" strokeLinecap="round" />
                  <ellipse cx="114" cy="116" rx="16" ry="8" transform="rotate(-28 114 116)" fill="#5E7D4A" />
                  <ellipse cx="146" cy="96" rx="16" ry="8" transform="rotate(28 146 96)" fill="#6E8E58" />
                  <g transform="translate(130 52)">
                    {Array.from({ length: 16 }, (_, idx) => (
                      <ellipse
                        key={idx}
                        cx="0"
                        cy="-24"
                        rx="5.2"
                        ry="15"
                        fill={idx % 2 === 0 ? '#F9C846' : '#E8A92E'}
                        transform={`rotate(${idx * 22.5})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="14" fill="#59391F" stroke="#3D2410" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="8" fill="#7A4F2B" opacity="0.65" />
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Stage Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePlant}
              disabled={stage !== 'unplanted'}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#59391F] px-5 py-2.5 text-sm font-medium text-[#FFF7E7] transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#734A29]"
            >
              <Sprout className="h-4 w-4" />
              <span>Plant Seed</span>
            </button>

            <button
              type="button"
              onClick={handleWater}
              disabled={stage !== 'planted' && stage !== 'watered'}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#526B42] px-5 py-2.5 text-sm font-medium text-[#FFF7E7] transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#63804E]"
            >
              <Droplets className="h-4 w-4" />
              <span>Water Soil ({growState.waterCount}/2)</span>
            </button>

            <button
              type="button"
              onClick={handleSunlight}
              disabled={stage !== 'sprouted' && stage !== 'sunlit'}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#E8A92E] px-5 py-2.5 text-sm font-semibold text-[#3D2410] transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#F9C846]"
            >
              <Sun className="h-4 w-4" />
              <span>Add Sunlight ({growState.sunlightCount}/2)</span>
            </button>
          </div>

          {/* Bloomed Celebration & Naming Form */}
          {stage === 'bloomed' && (
            <div className="paper-texture mt-8 w-full max-w-lg rounded-3xl border border-[#D98A47]/35 p-6 text-center shadow-md">
              <div className="space-y-1.5 font-hand text-2xl text-[#59391F]">
                {SUNFLOWER_CONTENT.growGame.completionLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              {growState.name ? (
                <div className="mt-5 rounded-2xl bg-[#F9C846]/25 px-4 py-3">
                  <div className="text-xs font-medium text-[#7A4F2B]">Named & Saved Locally</div>
                  <div className="mt-0.5 font-display text-2xl font-semibold text-[#59391F]">
                    🌻 {growState.name}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNameSubmit} className="mt-5 space-y-2">
                  <label htmlFor="sunflower-name-input" className="block text-xs font-medium text-[#7A4F2B]">
                    Give your sunflower a name
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="sunflower-name-input"
                      placeholder="e.g., Little Sunshine"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="flex-1 rounded-full border border-[#59391F]/25 bg-[#FFFCF5] px-4 py-2 text-sm text-[#59391F]"
                    />
                    <button
                      type="submit"
                      className="cursor-pointer rounded-full bg-[#59391F] px-5 py-2 text-xs font-semibold text-[#FFF7E7] hover:bg-[#734A29]"
                    >
                      Name Flower
                    </button>
                  </div>
                  {nameError && (
                    <p role="alert" className="text-xs font-medium text-[#8C3B1A]">
                      {nameError}
                    </p>
                  )}
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setNameInput('');
                  setNameError(null);
                  onResetPlant();
                }}
                className="mt-5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#7A4F2B] underline-offset-4 hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Grow another sunflower</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
