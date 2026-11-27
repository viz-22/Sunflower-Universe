import React, { useEffect, useState } from 'react';
import { SUNFLOWER_CONTENT } from '../config/sunflowerContent';
import { IllustratedBoy, IllustratedGirl, InteractiveButterfly } from './StoryCharacters';
import { SunflowerLogo } from './SunflowerLogo';

interface OpeningSceneProps {
  onEnterUniverse: () => void;
  onDiscoverButterfly: () => void;
}

const MEADOW_STEMS = Array.from({ length: 34 }, (_, idx) => {
  const left = (idx / 33) * 100;
  const height = 64 + ((idx * 37) % 88);
  const scale = 0.65 + ((idx * 19) % 45) / 100;
  const delay = ((idx * 0.4) % 3).toFixed(1);
  return { left, height, scale, delay, idx };
});

export const OpeningScene: React.FC<OpeningSceneProps> = ({
  onEnterUniverse,
  onDiscoverButterfly,
}) => {
  const [approached, setApproached] = useState(false);
  const [flowerAccepted, setFlowerAccepted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setApproached(true);
    }, 650);
    return () => window.clearTimeout(timer);
  }, []);

  const handleFlowerClick = () => {
    setApproached(true);
    setFlowerAccepted(true);
  };

  return (
    <section
      aria-label="Opening Scene: The Boy and the Sunflower"
      className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#FBE0A8] via-[#F6D3B5] to-[#E8A92E]/45 px-4 py-8 text-[#59391F]"
    >
      {/* Golden Hour Sun, Rolling Meadow Hills & Clouds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full sm:h-[420px] sm:w-[420px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,250,232,0.95) 0%, rgba(249,200,70,0.58) 38%, rgba(217,138,71,0) 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-14 left-[8%] h-14 w-48 rounded-full bg-[#FFFCF5]/60 blur-md animate-drift-cloud"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-[10%] h-16 w-56 rounded-full bg-[#FFFCF5]/55 blur-md animate-drift-cloud"
        style={{ animationDelay: '4s' }}
      />

      {/* Rolling Golden-Hour Meadow Horizon */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full sm:h-72"
      >
        <path
          d="M0,190 Q360,115 740,175 T1440,150 L1440,320 L0,320 Z"
          fill="#7D8C54"
          opacity="0.45"
        />
        <path
          d="M0,225 Q420,165 860,215 T1440,195 L1440,320 L0,320 Z"
          fill="#526B42"
          opacity="0.65"
        />
      </svg>

      {/* Subtle Brand Crest at Top */}
      <div className="relative z-10 flex flex-col items-center gap-1 pt-2 text-center">
        <div className="flex items-center gap-2">
          <SunflowerLogo size={32} />
          <span className="font-display text-2xl font-semibold tracking-wider text-[#59391F]">
            {SUNFLOWER_CONTENT.brand.name}
          </span>
        </div>
        <p className="font-hand text-lg text-[#7A4F2B]">
          {SUNFLOWER_CONTENT.brand.tagline}
        </p>
      </div>

      {/* Fluttering Butterfly Surprise */}
      <div className="absolute top-28 right-[14%] z-20 hidden sm:block">
        <InteractiveButterfly onClick={onDiscoverButterfly} />
      </div>

      {/* Center Stage: Boy & Approaching Girl */}
      <div className="relative z-10 my-auto flex w-full max-w-4xl flex-col items-center justify-center py-4">
        <div className="relative flex w-full items-end justify-center gap-3 sm:gap-10 min-h-[290px] sm:min-h-[350px]">
          {/* Girl gently approaches from the left */}
          <div
            className="transition-all duration-1000 ease-out"
            style={{
              transform: approached ? 'translateX(0px) scale(1)' : 'translateX(-64px) scale(0.92)',
              opacity: approached ? 1 : 0.72,
            }}
          >
            <IllustratedGirl
              holdingBouquet={false}
              className="h-56 w-40 sm:h-76 sm:w-52"
            />
          </div>

          {/* Boy holding & offering the single sunflower */}
          <div className="relative">
            <IllustratedBoy
              extendingFlower={approached}
              flowerGiven={flowerAccepted}
              onFlowerClick={handleFlowerClick}
              className="h-60 w-44 sm:h-80 sm:w-56"
            />

            {!flowerAccepted && (
              <button
                type="button"
                onClick={handleFlowerClick}
                className="mt-1 mx-auto block cursor-pointer rounded-full border border-[#D98A47]/40 bg-[#FFFCF5]/95 px-4 py-1.5 text-xs sm:text-sm font-medium text-[#59391F] shadow-sm transition-transform hover:scale-105"
              >
                {SUNFLOWER_CONTENT.opening.promptHint} 🌻
              </button>
            )}
          </div>
        </div>

        {/* Offered Sunflower Moving Forward & Romantic Invitation Card */}
        {flowerAccepted && (
          <div
            className="paper-texture mt-4 w-full max-w-xl rounded-3xl border border-[#D98A47]/30 px-6 py-7 text-center shadow-xl transition-all duration-700 sm:px-10"
            role="dialog"
            aria-label="Romantic Welcome Invitation"
          >
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F9C846]/25 animate-soft-beat">
              <SunflowerLogo size={42} />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#59391F] mb-3">
              {SUNFLOWER_CONTENT.opening.title}
            </h1>

            <div className="space-y-2.5 text-sm sm:text-base leading-relaxed text-[#59391F]/90">
              {SUNFLOWER_CONTENT.opening.paragraphs.map((line, i) => (
                <p key={i} className={i === 2 ? 'font-hand text-xl text-[#7A4F2B] pt-1' : ''}>
                  {line}
                </p>
              ))}
            </div>

            <button
              type="button"
              onClick={onEnterUniverse}
              className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#59391F] px-7 py-3 text-sm font-semibold tracking-wide text-[#FFF7E7] shadow-md transition-all hover:bg-[#734A29] hover:scale-[1.02]"
            >
              {SUNFLOWER_CONTENT.opening.enterButton}
            </button>
          </div>
        )}
      </div>

      {/* Layered Golden-Hour Sunflower Meadow Along the Bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 overflow-hidden"
      >
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#526B42] via-[#526B42]/75 to-transparent" />
        {MEADOW_STEMS.map((stem) => (
          <div
            key={stem.idx}
            className="absolute bottom-0 animate-sway"
            style={{
              left: `${stem.left}%`,
              height: `${stem.height}px`,
              animationDelay: `${stem.delay}s`,
              transform: `scale(${stem.scale})`,
            }}
          >
            <svg width="42" height="120" viewBox="0 0 42 120" fill="none">
              <path d="M21 120 Q19 72 21 26" stroke="#526B42" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="13" cy="82" rx="8" ry="4" transform="rotate(-25 13 82)" fill="#63804E" />
              <g transform="translate(21 24)">
                {Array.from({ length: 10 }, (_, p) => (
                  <ellipse
                    key={p}
                    cx="0"
                    cy="-11"
                    rx="3.4"
                    ry="8"
                    fill={p % 2 === 0 ? '#F9C846' : '#E8A92E'}
                    transform={`rotate(${p * 36})`}
                  />
                ))}
                <circle cx="0" cy="0" r="6.8" fill="#59391F" />
              </g>
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
};
