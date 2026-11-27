import React from 'react';
import { UniverseChapter } from '../utils/universeState';
import { SunflowerLogo } from './SunflowerLogo';

interface TopNavigationProps {
  activeChapter: UniverseChapter;
  onSelectChapter: (chapter: UniverseChapter) => void;
  eveningMode?: boolean;
}

const NAV_ITEMS: { id: UniverseChapter; label: string }[] = [
  { id: 'garden', label: 'Meadow' },
  { id: 'letters', label: 'Letters' },
  { id: 'music', label: 'Music' },
  { id: 'memories', label: 'Memories' },
  { id: 'grow', label: 'Grow' },
];

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeChapter,
  onSelectChapter,
  eveningMode = false,
}) => {
  const isOver3D = activeChapter === 'garden' || activeChapter === 'secret-garden';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
        eveningMode
          ? 'bg-[#2B1D14]/90 text-[#FFF7E7] border-b border-[#F9C846]/20'
          : isOver3D
            ? 'bg-[#FFF7E7]/92 text-[#59391F] border-b border-[#59391F]/10'
            : 'bg-[#FFF7E7]/95 text-[#59391F] border-b border-[#59391F]/10'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectChapter('garden')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 text-left"
        >
          <SunflowerLogo size={30} />
          <span className="font-display text-xl sm:text-2xl font-semibold tracking-wide">
            SUNFLOWER
          </span>
        </button>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Universe Chapters"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              activeChapter === item.id ||
              (item.id === 'garden' && activeChapter === 'secret-garden');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectChapter(item.id)}
                className={`cursor-pointer whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  active
                    ? 'border-[#D98A47] font-semibold'
                    : 'border-transparent opacity-80 hover:opacity-100 hover:border-[#F9C846]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onSelectChapter('final')}
            className="cursor-pointer whitespace-nowrap shrink-0 rounded-full bg-[#59391F] px-4 py-1.5 text-xs sm:text-sm font-medium text-[#FFF7E7] shadow-sm transition-colors hover:bg-[#734A29]"
          >
            Final Garden
          </button>
        </div>
      </div>

      {/* Compact mobile chapter strip when < md */}
      <nav
        aria-label="Mobile Universe Chapters"
        className="flex md:hidden items-center justify-around border-t border-[#59391F]/10 px-2 py-1.5 text-xs"
      >
        {NAV_ITEMS.map((item) => {
          const active =
            activeChapter === item.id ||
            (item.id === 'garden' && activeChapter === 'secret-garden');
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectChapter(item.id)}
              className={`cursor-pointer whitespace-nowrap shrink-0 px-2 py-1 rounded-md transition-colors ${
                active ? 'bg-[#F9C846]/35 font-semibold' : 'opacity-80'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
