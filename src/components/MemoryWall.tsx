import React, { useState } from 'react';
import { Eye, ImagePlus, Sparkles, Upload, X } from 'lucide-react';
import { PolaroidMemory } from '../config/sunflowerContent';
import { SunflowerLogo } from './SunflowerLogo';

interface MemoryWallProps {
  memories: PolaroidMemory[];
  discoveredSurprises: string[];
  onUpdateMemory: (
    id: string,
    patch: Partial<Pick<PolaroidMemory, 'imageSrc' | 'caption' | 'quote' | 'hiddenMessage'>>,
  ) => void;
  onDiscoverSurprise: (id: string) => void;
  onPlaySfx: (kind: 'petal' | 'water' | 'sun' | 'bloom' | 'letter' | 'sparkle') => void;
}

export const MemoryWall: React.FC<MemoryWallProps> = ({
  memories,
  discoveredSurprises,
  onUpdateMemory,
  onDiscoverSurprise,
  onPlaySfx,
}) => {
  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(null);
  const [revealHidden, setRevealHidden] = useState(false);
  const [captionDraft, setCaptionDraft] = useState('');

  const activeMemory = memories.find((m) => m.id === activeMemoryId) ?? null;

  const openViewer = (memory: PolaroidMemory) => {
    setActiveMemoryId(memory.id);
    setRevealHidden(false);
    setCaptionDraft(memory.caption);
    onPlaySfx('petal');
  };

  const handlePhotoUpload = (memoryId: string, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateMemory(memoryId, { imageSrc: reader.result });
        onPlaySfx('sparkle');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      aria-label="The Sunflower Memory Wall"
      className="universe-page-bg min-h-screen px-4 pt-28 pb-28 sm:px-8 sm:pt-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-current/15 pb-6">
          <p className="text-xs font-semibold tracking-wider text-[#D98A47]">
            Chapter Five · Polaroid Keepsakes
          </p>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl font-semibold">
            The Sunflower Memory Wall
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base opacity-80">
            Painted sunflower illustrations beside personal Polaroid slots waiting for your own photographs. Tap any frame to read its hidden note or upload a picture.
          </p>
        </div>

        {/* Polaroid Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory) => (
            <div
              key={memory.id}
              style={{ transform: `rotate(${memory.tiltDeg}deg)` }}
              className="group relative rounded-sm border border-[#59391F]/12 bg-[#FFFCF5] p-3.5 pb-6 shadow-md transition-all duration-300 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <button
                type="button"
                onClick={() => openViewer(memory)}
                className="block w-full cursor-pointer text-left"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F6D3B5]/30">
                  {memory.imageSrc ? (
                    <img
                      src={memory.imageSrc}
                      alt={memory.caption}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-[#7A4F2B]">
                      <ImagePlus className="h-8 w-8 opacity-75" />
                      <span className="text-xs font-medium">Empty Personal Frame</span>
                      <span className="text-[11px] opacity-75">
                        Tap to open & upload your photograph
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 px-1">
                  <p className="font-hand text-2xl leading-tight text-[#59391F]">
                    {memory.caption}
                  </p>
                  <p className="mt-1 text-[11px] text-[#7A4F2B]/80">{memory.dateLabel}</p>
                </div>
              </button>

              {!memory.imageSrc && (
                <label className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D98A47]/40 bg-[#FFF7E7] px-3 py-1 text-xs font-medium text-[#59391F] hover:bg-[#F9C846]/30">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handlePhotoUpload(memory.id, e.target.files?.[0])}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Hidden Golden Seed #3 along bottom ribbon corner */}
        <div className="mt-12 flex justify-end">
          <button
            type="button"
            onClick={() => onDiscoverSurprise('surprise-seed-3')}
            aria-label="Collect hidden golden seed on the memory wall"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-transform hover:scale-105 ${
              discoveredSurprises.includes('surprise-seed-3')
                ? 'border-[#526B42]/35 bg-[#526B42]/10 text-[#526B42]'
                : 'border-[#E8A92E] bg-[#F9C846]/35 text-[#59391F]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D98A47]" />
            <span>
              {discoveredSurprises.includes('surprise-seed-3')
                ? 'Golden Seed III collected'
                : 'A tiny golden seed near the frame corner'}
            </span>
          </button>
        </div>
      </div>

      {/* Full-Screen Memory Viewer Modal */}
      {activeMemory && (
        <div
          role="dialog"
          aria-label={activeMemory.caption}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2B1D14]/70 p-4"
        >
          <div className="relative my-auto w-full max-w-2xl rounded-3xl border border-[#D98A47]/30 bg-[#FFFCF5] p-5 text-[#59391F] shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setActiveMemoryId(null)}
              aria-label="Close memory viewer"
              className="absolute top-4 right-4 cursor-pointer rounded-full p-2 hover:bg-[#F6D3B5]/50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#F6D3B5]/30">
              {activeMemory.imageSrc ? (
                <img
                  src={activeMemory.imageSrc}
                  alt={activeMemory.caption}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <SunflowerLogo size={48} />
                  <p className="font-display text-2xl">Add Your Own Photograph</p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#59391F] px-5 py-2.5 text-xs font-semibold text-[#FFF7E7] hover:bg-[#734A29]">
                    <Upload className="h-4 w-4" />
                    <span>Choose Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handlePhotoUpload(activeMemory.id, e.target.files?.[0])}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-sm italic text-[#7A4F2B]">“{activeMemory.quote}”</p>

              {/* Editable Caption */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <label htmlFor="memory-caption-input" className="text-xs font-medium shrink-0">
                  Caption:
                </label>
                <input
                  id="memory-caption-input"
                  value={captionDraft}
                  onChange={(e) => {
                    setCaptionDraft(e.target.value);
                    onUpdateMemory(activeMemory.id, { caption: e.target.value });
                  }}
                  className="flex-1 rounded-xl border border-[#59391F]/20 bg-[#FFF7E7] px-3 py-1.5 font-hand text-xl text-[#59391F]"
                />
              </div>

              {/* Hidden Note Reveal & Replace Photo */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRevealHidden((v) => !v)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D98A47]/40 bg-[#F9C846]/25 px-4 py-1.5 text-xs font-semibold text-[#59391F]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{revealHidden ? 'Hide Secret Note' : 'Peek Behind Polaroid'}</span>
                </button>

                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#59391F]/20 bg-[#FFF7E7] px-4 py-1.5 text-xs font-medium hover:bg-[#F6D3B5]/40">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{activeMemory.imageSrc ? 'Replace Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handlePhotoUpload(activeMemory.id, e.target.files?.[0])}
                  />
                </label>
              </div>

              {revealHidden && (
                <div className="paper-texture rounded-2xl border border-[#D98A47]/30 p-4 font-hand text-2xl text-[#59391F]">
                  {activeMemory.hiddenMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
