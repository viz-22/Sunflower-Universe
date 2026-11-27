import React, { useState } from 'react';
import { Edit3, Mail, Plus, Sparkles, X } from 'lucide-react';
import {
  LoveLetterCategory,
  LoveLetterItem,
  SUNFLOWER_CONTENT,
} from '../config/sunflowerContent';
import { SunflowerLogo } from './SunflowerLogo';

interface LoveLetterGardenProps {
  letters: LoveLetterItem[];
  discoveredSurprises: string[];
  onSaveLetter: (draft: {
    id?: string;
    category: LoveLetterCategory;
    title: string;
    salutation: string;
    body: string;
    closing: string;
  }) => { ok: boolean; error?: string };
  onDiscoverSurprise: (id: string) => void;
  onPlaySfx: (kind: 'petal' | 'water' | 'sun' | 'bloom' | 'letter' | 'sparkle') => void;
}

export const LoveLetterGarden: React.FC<LoveLetterGardenProps> = ({
  letters,
  discoveredSurprises,
  onSaveLetter,
  onDiscoverSurprise,
  onPlaySfx,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | LoveLetterCategory>('All');
  const [openLetter, setOpenLetter] = useState<LoveLetterItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState<LoveLetterCategory>(
    SUNFLOWER_CONTENT.letterCategories[0],
  );
  const [draftSalutation, setDraftSalutation] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftClosing, setDraftClosing] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredLetters =
    selectedCategory === 'All'
      ? letters
      : letters.filter((l) => l.category === selectedCategory);

  const handleOpenLetter = (letter: LoveLetterItem) => {
    setOpenLetter(letter);
    setIsEditing(false);
    setFormError(null);
    onPlaySfx('letter');
  };

  const startEditingOpenLetter = () => {
    if (!openLetter) return;
    setDraftTitle(openLetter.title);
    setDraftCategory(openLetter.category);
    setDraftSalutation(openLetter.salutation);
    setDraftBody(openLetter.body);
    setDraftClosing(openLetter.closing);
    setFormError(null);
    setIsEditing(true);
  };

  const startComposing = () => {
    setDraftTitle('');
    setDraftCategory(
      selectedCategory === 'All' ? SUNFLOWER_CONTENT.letterCategories[0] : selectedCategory,
    );
    setDraftSalutation('Dearest you,');
    setDraftBody('');
    setDraftClosing('With all my love,');
    setFormError(null);
    setIsComposing(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onSaveLetter({
      id: isEditing && openLetter ? openLetter.id : undefined,
      category: draftCategory,
      title: draftTitle,
      salutation: draftSalutation,
      body: draftBody,
      closing: draftClosing,
    });
    if (!res.ok) {
      setFormError(res.error ?? 'Please fill in all required fields.');
      return;
    }
    if (isEditing && openLetter) {
      setOpenLetter({
        ...openLetter,
        category: draftCategory,
        title: draftTitle.trim(),
        salutation: draftSalutation.trim() || 'Dearest you,',
        body: draftBody.trim(),
        closing: draftClosing.trim() || 'With all my love,',
      });
      setIsEditing(false);
    } else {
      setIsComposing(false);
    }
    onPlaySfx('sparkle');
  };

  return (
    <section
      aria-label="The Love Letter Garden"
      className="universe-page-bg min-h-screen px-4 pt-28 pb-28 sm:px-8 sm:pt-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-current/15 pb-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#D98A47]">
              Chapter Three · Handwritten Keepsakes
            </p>
            <h1 className="mt-1 font-display text-4xl sm:text-5xl font-semibold">
              The Love Letter Garden
            </h1>
            <p className="mt-2 text-sm sm:text-base opacity-80">
              Tiny wax-sealed envelopes tied to sunflower stems—each waiting for the exact moment you need it. Every letter can also be personalized or newly written.
            </p>
          </div>

          <button
            type="button"
            onClick={startComposing}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-[#59391F] px-5 py-2.5 text-sm font-medium text-[#FFF7E7] shadow-sm transition-colors hover:bg-[#734A29]"
          >
            <Plus className="h-4 w-4" />
            <span>Write a New Letter</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="mt-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Love Letter Categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'All'}
            onClick={() => setSelectedCategory('All')}
            className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-[#D98A47] text-[#FFFCF5]'
                : 'bg-[#FFFCF5]/90 text-[#59391F] hover:bg-[#F6D3B5]'
            }`}
          >
            All Letters ({letters.length})
          </button>
          {SUNFLOWER_CONTENT.letterCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#D98A47] text-[#FFFCF5]'
                  : 'bg-[#FFFCF5]/90 text-[#59391F] hover:bg-[#F6D3B5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sunflower Stems & Envelopes Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLetters.map((letter, idx) => (
            <button
              key={letter.id}
              type="button"
              onClick={() => handleOpenLetter(letter)}
              className="group relative flex cursor-pointer flex-col items-start justify-between rounded-3xl border border-[#59391F]/12 bg-[#FFFCF5] p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D98A47]/50 hover:shadow-md"
            >
              <div className="flex w-full items-start justify-between gap-3">
                <span className="text-xs font-medium text-[#D98A47]">
                  {letter.category}
                </span>

                {/* Mini sunflower & wax envelope stem emblem */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <SunflowerLogo
                    size={26}
                    className="transition-transform duration-300 group-hover:rotate-12"
                  />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F6D3B5]/60 text-[#59391F]">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              <h2 className="mt-4 font-display text-2xl font-semibold text-[#59391F]">
                {letter.title}
              </h2>

              <p className="mt-2 line-clamp-2 font-hand text-xl text-[#7A4F2B]">
                {letter.salutation} {letter.body}
              </p>

              <div className="mt-5 flex w-full items-center justify-between border-t border-[#59391F]/10 pt-3 text-xs font-medium text-[#526B42]">
                <span>Open envelope</span>
                <span className="tabular-nums opacity-65">No. {idx + 1}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Hidden Golden Seed #2 in the Garden Soil */}
        <div className="mt-10 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onDiscoverSurprise('surprise-seed-2')}
            aria-label="Inspect shimmering golden seed in the letter garden soil"
            className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all hover:scale-105 ${
              discoveredSurprises.includes('surprise-seed-2')
                ? 'border-[#526B42]/30 bg-[#526B42]/10 text-[#526B42]'
                : 'border-[#E8A92E] bg-[#F9C846]/30 text-[#59391F]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D98A47]" />
            <span>
              {discoveredSurprises.includes('surprise-seed-2')
                ? 'Golden Seed II collected'
                : 'Something golden is tucked into the soil'}
            </span>
          </button>
        </div>
      </div>

      {/* Opened Handwritten Letter Modal */}
      {openLetter && (
        <div
          role="dialog"
          aria-label={openLetter.title}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2B1D14]/55 p-4"
        >
          <div className="paper-texture relative my-auto w-full max-w-xl rounded-3xl border border-[#D98A47]/35 px-7 py-8 text-[#59391F] shadow-2xl sm:px-10">
            <button
              type="button"
              onClick={() => {
                setOpenLetter(null);
                setIsEditing(false);
              }}
              aria-label="Close letter"
              className="absolute top-4 right-4 cursor-pointer rounded-full p-2 hover:bg-[#F6D3B5]/50"
            >
              <X className="h-4 w-4" />
            </button>

            {!isEditing ? (
              <>
                <div className="flex items-center gap-2.5 text-xs font-medium text-[#D98A47]">
                  <SunflowerLogo size={24} />
                  <span>{openLetter.category}</span>
                </div>

                <h2 className="mt-3 font-display text-3xl font-semibold text-[#59391F]">
                  {openLetter.title}
                </h2>

                <div className="mt-6 space-y-4 font-hand text-2xl sm:text-[26px] leading-relaxed text-[#4A2E17]">
                  <p>{openLetter.salutation}</p>
                  <p className="whitespace-pre-line">{openLetter.body}</p>
                  <p className="pt-2 text-right text-[#7A4F2B]">{openLetter.closing}</p>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#59391F]/10 pt-4">
                  <button
                    type="button"
                    onClick={startEditingOpenLetter}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#59391F]/20 bg-[#FFF7E7] px-4 py-1.5 text-xs font-medium text-[#59391F] hover:bg-[#F6D3B5]/45"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Personalize Letter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenLetter(null)}
                    className="cursor-pointer rounded-full bg-[#59391F] px-5 py-2 text-xs font-semibold text-[#FFF7E7] hover:bg-[#734A29]"
                  >
                    Fold Envelope
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <h2 className="font-display text-2xl font-semibold">Personalize This Letter</h2>
                {formError && (
                  <p role="alert" className="rounded-lg bg-[#D98A47]/15 px-3 py-2 text-xs font-medium text-[#8C3B1A]">
                    {formError}
                  </p>
                )}
                <div>
                  <label htmlFor="edit-letter-title" className="block text-xs font-medium mb-1">
                    Title
                  </label>
                  <input
                    id="edit-letter-title"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-letter-salutation" className="block text-xs font-medium mb-1">
                    Opening Greeting
                  </label>
                  <input
                    id="edit-letter-salutation"
                    value={draftSalutation}
                    onChange={(e) => setDraftSalutation(e.target.value)}
                    className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-letter-body" className="block text-xs font-medium mb-1">
                    Letter Message
                  </label>
                  <textarea
                    id="edit-letter-body"
                    rows={5}
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-letter-closing" className="block text-xs font-medium mb-1">
                    Closing Line
                  </label>
                  <input
                    id="edit-letter-closing"
                    value={draftClosing}
                    onChange={(e) => setDraftClosing(e.target.value)}
                    className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="cursor-pointer rounded-full border border-[#59391F]/20 px-4 py-2 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full bg-[#59391F] px-5 py-2 text-xs font-semibold text-[#FFF7E7]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Compose New Letter Modal */}
      {isComposing && (
        <div
          role="dialog"
          aria-label="Write a New Love Letter"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2B1D14]/55 p-4"
        >
          <div className="paper-texture relative my-auto w-full max-w-xl rounded-3xl border border-[#D98A47]/35 px-7 py-8 text-[#59391F] shadow-2xl">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              aria-label="Close new letter form"
              className="absolute top-4 right-4 cursor-pointer rounded-full p-2 hover:bg-[#F6D3B5]/50"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="font-display text-3xl font-semibold">Write a New Letter</h2>
            <p className="mt-1 text-xs text-[#7A4F2B]">
              Plant another envelope in the sunflower garden. Saved privately on this device.
            </p>

            <form onSubmit={handleSubmitForm} className="mt-5 space-y-4">
              {formError && (
                <p role="alert" className="rounded-lg bg-[#D98A47]/15 px-3 py-2 text-xs font-medium text-[#8C3B1A]">
                  {formError}
                </p>
              )}

              <div>
                <label htmlFor="new-letter-category" className="block text-xs font-medium mb-1">
                  Category
                </label>
                <select
                  id="new-letter-category"
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value as LoveLetterCategory)}
                  className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                >
                  {SUNFLOWER_CONTENT.letterCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="new-letter-title" className="block text-xs font-medium mb-1">
                  Letter Title
                </label>
                <input
                  id="new-letter-title"
                  placeholder="e.g., Sunday Morning Coffee"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label htmlFor="new-letter-salutation" className="block text-xs font-medium mb-1">
                  Opening Greeting
                </label>
                <input
                  id="new-letter-salutation"
                  value={draftSalutation}
                  onChange={(e) => setDraftSalutation(e.target.value)}
                  className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label htmlFor="new-letter-body" className="block text-xs font-medium mb-1">
                  Your Message
                </label>
                <textarea
                  id="new-letter-body"
                  rows={4}
                  placeholder="Write something straight from the heart..."
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label htmlFor="new-letter-closing" className="block text-xs font-medium mb-1">
                  Closing Signature
                </label>
                <input
                  id="new-letter-closing"
                  value={draftClosing}
                  onChange={(e) => setDraftClosing(e.target.value)}
                  className="w-full rounded-xl border border-[#59391F]/20 bg-[#FFFCF5] px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="cursor-pointer rounded-full border border-[#59391F]/20 px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#59391F] px-5 py-2 text-xs font-semibold text-[#FFF7E7]"
                >
                  Plant Letter in Garden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
