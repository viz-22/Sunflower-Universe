import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SUNFLOWER_CONTENT } from '../config/sunflowerContent';
import { IllustratedBoy, IllustratedGirl } from './StoryCharacters';

interface FinalSceneProps {
  onReturnToGarden: () => void;
  onPlaySfx: (kind: 'petal' | 'water' | 'sun' | 'bloom' | 'letter' | 'sparkle') => void;
}

export const FinalScene: React.FC<FinalSceneProps> = ({
  onReturnToGarden,
  onPlaySfx,
}) => {
  const [bouquetAccepted, setBouquetAccepted] = useState(false);

  const handleAcceptBouquet = () => {
    setBouquetAccepted(true);
    onPlaySfx('bloom');
  };

  return (
    <section
      aria-label="Final Scene: A Garden That Belongs To You"
      className={`relative min-h-screen w-full overflow-hidden px-4 pt-28 pb-36 transition-colors duration-1000 sm:px-8 sm:pt-24 ${
        bouquetAccepted
          ? 'bg-gradient-to-b from-[#FCE19C] via-[#FFF7E7] to-[#F6D3B5] text-[#59391F]'
          : 'universe-page-bg'
      }`}
    >
      {/* Radiant Golden Sunlight Aura when bouquet is given */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-14 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full transition-opacity duration-1000"
        style={{
          opacity: bouquetAccepted ? 1 : 0.45,
          background:
            'radial-gradient(circle, rgba(249,200,70,0.68) 0%, rgba(255,247,231,0.2) 50%, rgba(249,200,70,0) 75%)',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <p className="text-xs font-semibold tracking-wider text-[#D98A47]">
          Final Chapter · Always Waiting For You
        </p>
        <h1 className="mt-1 text-center font-display text-4xl sm:text-5xl font-semibold">
          {SUNFLOWER_CONTENT.finalScene.heading}
        </h1>

        {/* Boy Giving Bouquet to Girl */}
        <div className="mt-6 flex w-full items-end justify-center gap-2 sm:gap-10 min-h-[250px]">
          <div
            className="transition-all duration-1000"
            style={{
              transform: bouquetAccepted ? 'translateX(12px)' : 'translateX(-28px)',
            }}
          >
            <IllustratedGirl
              holdingBouquet={bouquetAccepted}
              className="h-52 w-36 sm:h-64 sm:w-44"
            />
          </div>

          <div
            className="transition-all duration-1000"
            style={{
              transform: bouquetAccepted ? 'translateX(-12px)' : 'translateX(0px)',
            }}
          >
            <IllustratedBoy
              holdingBouquet={!bouquetAccepted}
              extendingFlower={!bouquetAccepted}
              flowerGiven={bouquetAccepted}
              className="h-56 w-40 sm:h-68 sm:w-48"
            />
          </div>
        </div>

        {!bouquetAccepted ? (
          <button
            type="button"
            onClick={handleAcceptBouquet}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#59391F] px-7 py-3 text-sm font-semibold text-[#FFF7E7] shadow-md transition-transform hover:scale-105 hover:bg-[#734A29]"
          >
            <Sparkles className="h-4 w-4 text-[#F9C846]" />
            <span>Accept the Bouquet of Sunflowers 🌻</span>
          </button>
        ) : (
          <div className="paper-texture mt-6 w-full max-w-2xl rounded-3xl border border-[#D98A47]/35 px-7 py-8 text-center shadow-xl sm:px-10">
            <div className="space-y-3 text-base sm:text-lg leading-relaxed text-[#59391F]">
              {SUNFLOWER_CONTENT.finalScene.paragraphs.map((line, i) => (
                <p
                  key={i}
                  className={
                    i === SUNFLOWER_CONTENT.finalScene.paragraphs.length - 1
                      ? 'font-hand text-3xl text-[#7A4F2B] pt-2'
                      : ''
                  }
                >
                  {line}
                </p>
              ))}
            </div>

            <button
              type="button"
              onClick={onReturnToGarden}
              className="mt-7 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#59391F] px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide text-[#FFF7E7] shadow-md transition-transform hover:scale-[1.02] hover:bg-[#734A29]"
            >
              {SUNFLOWER_CONTENT.finalScene.returnButton}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
