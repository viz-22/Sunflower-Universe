import React from 'react';
import { Check, Lock, Sparkles, X } from 'lucide-react';
import { SUNFLOWER_CONTENT } from '../config/sunflowerContent';
import { countGoldenSeedsFound, isThreeSeedLetterUnlocked } from '../utils/universeState';

interface SurprisesDrawerProps {
  isOpen: boolean;
  discoveredSurprises: string[];
  onClose: () => void;
}

export const SurprisesDrawer: React.FC<SurprisesDrawerProps> = ({
  isOpen,
  discoveredSurprises,
  onClose,
}) => {
  if (!isOpen) return null;

  const goldenCount = countGoldenSeedsFound(discoveredSurprises);
  const threeSeedUnlocked = isThreeSeedLetterUnlocked(discoveredSurprises);

  return (
    <div
      role="dialog"
      aria-label="Secret Surprises Journal"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2B1D14]/60 p-4"
    >
      <div className="paper-texture relative my-auto max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#D98A47]/35 px-6 py-7 text-[#59391F] shadow-2xl sm:px-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close secret surprises journal"
          className="sticky float-right top-0 cursor-pointer rounded-full bg-[#FFF7E7] p-2 hover:bg-[#F6D3B5]/50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider text-[#D98A47]">
          <Sparkles className="h-4 w-4" />
          <span>
            Secret Surprises · {discoveredSurprises.length}/{SUNFLOWER_CONTENT.surprises.length} Found
          </span>
        </div>

        <h2 className="mt-1 font-display text-3xl font-semibold">
          Hidden Corners of Our Universe
        </h2>
        <p className="mt-1 text-sm text-[#7A4F2B]">
          Little moments tucked into butterflies, falling petals, twilight moons, and three golden seeds ({goldenCount}/3 collected).
        </p>

        {/* Secret Three-Seed Letter */}
        <div
          className={`mt-5 rounded-2xl border p-5 ${
            threeSeedUnlocked
              ? 'border-[#E8A92E] bg-[#F9C846]/20'
              : 'border-[#59391F]/15 bg-[#FFF7E7]/70'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A4F2B]">
            {threeSeedUnlocked ? (
              <Sparkles className="h-4 w-4 text-[#D98A47]" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span>
              {threeSeedUnlocked
                ? 'Unlocked: Secret Three-Seed Letter'
                : `Locked: Collect all 3 Golden Seeds (${goldenCount}/3)`}
            </span>
          </div>

          {threeSeedUnlocked ? (
            <div className="mt-3 space-y-2 font-hand text-2xl leading-relaxed text-[#4A2E17]">
              <p>{SUNFLOWER_CONTENT.secretThreeSeedsLetter.salutation}</p>
              <p>{SUNFLOWER_CONTENT.secretThreeSeedsLetter.body}</p>
              <p className="text-right text-[#7A4F2B]">
                {SUNFLOWER_CONTENT.secretThreeSeedsLetter.closing}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-[#7A4F2B]/85">
              Search the Main Meadow, the Love Letter Garden soil, and the Memory Wall corner to gather all three golden seeds.
            </p>
          )}
        </div>

        {/* All 8 Surprises Checklist */}
        <div className="mt-6 space-y-3">
          {SUNFLOWER_CONTENT.surprises.map((s) => {
            const found = discoveredSurprises.includes(s.id);
            return (
              <div
                key={s.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  found
                    ? 'border-[#526B42]/30 bg-[#FFFCF5]'
                    : 'border-[#59391F]/10 bg-[#FFF7E7]/65'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-[#D98A47]">{s.locationLabel}</div>
                    <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  </div>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      found ? 'bg-[#526B42] text-[#FFF7E7]' : 'bg-[#59391F]/10 text-[#59391F]/60'
                    }`}
                    aria-label={found ? 'Discovered' : 'Not yet discovered'}
                  >
                    {found ? <Check className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-[#59391F]/85">
                  {found ? s.message : `Hint: ${s.hint}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
