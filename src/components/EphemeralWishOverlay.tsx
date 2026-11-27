import React, { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { EphemeralWish } from '../utils/universeState';

interface EphemeralWishOverlayProps {
  mode: 'main' | 'secret';
  wishes: EphemeralWish[];
  onAddWish: (text: string) => { ok: boolean; newWish?: EphemeralWish; error?: string };
  onPlaySfx: (kind: 'petal' | 'water' | 'sun' | 'bloom' | 'letter' | 'sparkle') => void;
}

export const EphemeralWishOverlay: React.FC<EphemeralWishOverlayProps> = ({
  mode,
  wishes,
  onAddWish,
  onPlaySfx,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [animatingWish, setAnimatingWish] = useState<EphemeralWish | null>(null);

  useEffect(() => {
    if (!animatingWish) return;
    const timer = window.setTimeout(() => {
      setAnimatingWish(null);
    }, 3600);
    return () => window.clearTimeout(timer);
  }, [animatingWish]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onAddWish(draft);
    if (!res.ok) {
      setError(res.error ?? 'Please write a wish first.');
      return;
    }
    setError(null);
    setDraft('');
    setModalOpen(false);
    if (res.newWish) {
      setAnimatingWish(res.newWish);
    }
    onPlaySfx('petal');
  };

  return (
    <>
      {/* Floating Wish Icon in the Garden */}
      <button
        type="button"
        onClick={() => {
          setError(null);
          setModalOpen(true);
        }}
        aria-label="Make an Ephemeral Wish"
        title="Make an Ephemeral Wish"
        style={{
          boxShadow: '0 8px var(--universe-shadow-blur) rgba(43, 29, 20, 0.24)',
        }}
        className={`fixed z-30 flex cursor-pointer items-center gap-2 rounded-full border border-[#E8A92E]/70 bg-[#FFFCF5]/95 px-3.5 py-2 text-xs font-semibold text-[#59391F] transition-transform hover:scale-105 ${
          mode === 'main' ? 'right-5 bottom-24' : 'top-36 right-5'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2 C16.5 7, 17 15, 12 22 C7 15, 7.5 7, 12 2 Z"
            fill="#F9C846"
            stroke="#59391F"
            strokeWidth="1.2"
          />
          <path d="M12 7 L12 18" stroke="#D98A47" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <span>Make a Wish</span>
        {wishes.length > 0 && (
          <span className="tabular-nums text-[11px] font-bold text-[#D98A47]">
            ({wishes.length})
          </span>
        )}
      </button>

      {/* Golden Petal Floating Into the Soil Animation */}
      {animatingWish && (
        <div
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
          aria-hidden="false"
        >
          {/* Floating Golden Petal */}
          <div className="animate-wish-petal flex flex-col items-center">
            <svg width="56" height="72" viewBox="0 0 56 72" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="wishPetalGrad" x1="28" y1="2" x2="28" y2="70" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFE58F" />
                  <stop offset="55%" stopColor="#F9C846" />
                  <stop offset="100%" stopColor="#D98A47" />
                </linearGradient>
              </defs>
              <path
                d="M28 4 C44 18, 46 46, 28 68 C10 46, 12 18, 28 4 Z"
                fill="url(#wishPetalGrad)"
                stroke="#7A4F2B"
                strokeWidth="1.4"
              />
              <path d="M28 16 Q29 38 28 58" stroke="#FFF7E7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>

          {/* Soil Mound & Golden Glow Settling Point */}
          <div className="fixed bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <div className="animate-wish-soil flex flex-col items-center">
              <div className="h-5 w-36 rounded-t-full bg-gradient-to-t from-[#3D2410] via-[#59391F] to-[#7A4F2B] shadow-[0_0_24px_rgba(249,200,70,0.8)]" />
              <div
                role="status"
                aria-live="polite"
                className="mt-2 rounded-full border border-[#E8A92E] bg-[#FFFCF5]/95 px-4 py-1.5 text-center text-xs font-medium text-[#59391F] shadow-lg"
              >
                Your golden wish settled gently into the soil.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wish Input & Saved Wishes Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-label="Ephemeral Wish"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2B1D14]/60 p-4"
        >
          <div
            style={{
              boxShadow: '0 14px var(--universe-shadow-blur) rgba(25, 16, 12, 0.34)',
            }}
            className="paper-texture relative my-auto max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#D98A47]/40 px-6 py-7 text-[#59391F] sm:px-8"
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close wish dialog"
              className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-[#59391F] hover:bg-[#F6D3B5]/50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D98A47]">
              <Sparkles className="h-4 w-4" />
              <span>Ephemeral Wish</span>
            </div>

            <h2 className="mt-1 font-display text-3xl font-semibold text-[#59391F]">
              Send a Wish to the Soil
            </h2>
            <p className="mt-1 text-sm text-[#7A4F2B]">
              Write a quiet wish or hope. When you release it, a golden petal carries it down into the meadow earth to keep for later.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div>
                <label
                  htmlFor="ephemeral-wish-input"
                  className="block text-xs font-semibold text-[#59391F]"
                >
                  Your Wish
                </label>
                <textarea
                  id="ephemeral-wish-input"
                  rows={3}
                  maxLength={240}
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="I wish for slow mornings, warm tea, and sunlit walks..."
                  className="mt-1.5 w-full rounded-2xl border border-[#59391F]/25 bg-[#FFFCF5] px-4 py-3 font-hand text-2xl leading-snug text-[#59391F] placeholder:text-[#7A4F2B]/55"
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#7A4F2B]">
                  <span>{draft.trim().length}/240 characters</span>
                  {error && (
                    <span role="alert" className="font-medium text-[#B84A27]">
                      {error}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cursor-pointer rounded-full border border-[#59391F]/20 px-4 py-2 text-xs font-medium text-[#59391F] hover:bg-[#F6D3B5]/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#59391F] px-5 py-2 text-xs font-semibold text-[#FFF7E7] shadow-sm transition-colors hover:bg-[#734A29]"
                >
                  Release Golden Petal
                </button>
              </div>
            </form>

            {/* Saved Wishes History */}
            <div className="mt-6 border-t border-[#59391F]/12 pt-5">
              <h3 className="font-display text-xl font-semibold text-[#59391F]">
                Wishes Planted in the Soil ({wishes.length})
              </h3>
              {wishes.length === 0 ? (
                <p className="mt-2 text-xs italic text-[#7A4F2B]">
                  No wishes planted yet. Release your first golden petal whenever you are ready.
                </p>
              ) : (
                <ul className="mt-3 max-h-52 space-y-2.5 overflow-y-auto pr-1">
                  {wishes.map((w) => (
                    <li
                      key={w.id}
                      className="rounded-2xl border border-[#E8A92E]/35 bg-[#FFF7E7]/90 px-4 py-3"
                    >
                      <p className="font-hand text-2xl leading-snug text-[#59391F]">
                        “{w.text}”
                      </p>
                      <p className="mt-1 text-[11px] text-[#7A4F2B]">
                        Planted {new Date(w.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
