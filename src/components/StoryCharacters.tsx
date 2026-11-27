import React from 'react';

interface BoyProps {
  holdingBouquet?: boolean;
  extendingFlower?: boolean;
  flowerGiven?: boolean;
  onFlowerClick?: () => void;
  className?: string;
}

export const IllustratedBoy: React.FC<BoyProps> = ({
  holdingBouquet = false,
  extendingFlower = false,
  flowerGiven = false,
  onFlowerClick,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 220 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustrated boy holding a sunflower"
    >
      {/* Soft ground shadow */}
      <ellipse cx="105" cy="306" rx="52" ry="10" fill="#4A2E17" opacity="0.22" />

      {/* Shoes */}
      <ellipse cx="86" cy="298" rx="13" ry="6.5" fill="#59391F" />
      <ellipse cx="122" cy="298" rx="13" ry="6.5" fill="#59391F" />

      {/* Trousers */}
      <path d="M80 210 L76 294 L95 294 L103 230 L111 294 L130 294 L126 210 Z" fill="#6F5643" />
      <path d="M80 210 H126 L124 224 H82 Z" fill="#5E4736" />

      {/* Warm cream linen shirt */}
      <path
        d="M72 132 C72 120 86 114 103 114 C120 114 134 120 134 132 L130 214 H76 Z"
        fill="#FFF7E7"
        stroke="#E6D5BC"
        strokeWidth="1.5"
      />
      {/* Rolled sleeves & collar */}
      <path d="M93 115 L103 128 L113 115" stroke="#D9C3A3" strokeWidth="2" fill="none" />
      <path d="M74 132 L54 166 L68 172 L82 146" fill="#F8EBD6" stroke="#E6D5BC" strokeWidth="1.2" />

      {/* Left arm resting gently */}
      <path d="M56 168 Q52 195 66 208" stroke="#EBC3A4" strokeWidth="11" strokeLinecap="round" />

      {/* Neck & Head */}
      <rect x="95" y="96" width="16" height="22" rx="8" fill="#EBC3A4" />
      <circle cx="103" cy="74" r="28" fill="#F3CFB3" />

      {/* Gentle rosy cheeks */}
      <ellipse cx="87" cy="80" rx="5" ry="3" fill="#E89A7B" opacity="0.45" />
      <ellipse cx="119" cy="80" rx="5" ry="3" fill="#E89A7B" opacity="0.45" />

      {/* Warm eyes & gentle smile */}
      <circle cx="93" cy="72" r="2.6" fill="#4A2E17" />
      <circle cx="113" cy="72" r="2.6" fill="#4A2E17" />
      <circle cx="94" cy="71" r="0.9" fill="#FFFCF5" />
      <circle cx="114" cy="71" r="0.9" fill="#FFFCF5" />
      <path d="M96 84 Q103 90 110 84" stroke="#7A4F2B" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Tousled warm brown hair */}
      <path
        d="M74 72 C72 45 90 36 105 38 C124 38 135 50 132 72 C127 60 118 55 107 57 C95 59 83 56 74 72 Z"
        fill="#59391F"
      />
      <path d="M86 44 Q102 32 120 44" stroke="#6E492A" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Extended Right Arm offering flower / bouquet */}
      <g
        style={{
          transform: extendingFlower ? 'translate(8px, -4px) rotate(-6deg)' : 'translate(0px, 0px)',
          transformOrigin: '126px 138px',
          transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <path d="M126 136 L146 164 L134 172 L120 148" fill="#F8EBD6" stroke="#E6D5BC" strokeWidth="1.2" />
        <path d="M138 166 Q156 172 168 164" stroke="#EBC3A4" strokeWidth="11" strokeLinecap="round" />

        {!flowerGiven && !holdingBouquet && (
          <g
            onClick={onFlowerClick}
            className={onFlowerClick ? 'cursor-pointer' : undefined}
            style={{
              transform: extendingFlower ? 'translate(4px, -4px) scale(1.06)' : 'translate(0px, 0px)',
              transformOrigin: '174px 140px',
              transition: 'transform 600ms ease',
            }}
          >
            {/* Stem */}
            <path d="M167 195 Q170 156 176 124" stroke="#526B42" strokeWidth="4.2" strokeLinecap="round" />
            <ellipse cx="164" cy="168" rx="9" ry="4.5" transform="rotate(-28 164 168)" fill="#63804E" />
            {/* Single radiant sunflower */}
            <g transform="translate(178 118)">
              {Array.from({ length: 12 }, (_, idx) => (
                <ellipse
                  key={idx}
                  cx="0"
                  cy="-15"
                  rx="4.2"
                  ry="10"
                  fill={idx % 2 === 0 ? '#F9C846' : '#E8A92E'}
                  transform={`rotate(${idx * 30})`}
                />
              ))}
              <circle cx="0" cy="0" r="9.5" fill="#59391F" stroke="#3D2410" strokeWidth="1" />
              <circle cx="0" cy="0" r="5" fill="#7A4F2B" opacity="0.65" />
            </g>
          </g>
        )}

        {!flowerGiven && holdingBouquet && (
          <g transform="translate(152, 118)">
            {/* Paper wrap */}
            <path d="M6 34 L22 72 L38 34 Z" fill="#F6D3B5" stroke="#D98A47" strokeWidth="1.2" />
            <path d="M16 56 Q22 61 28 56" stroke="#D98A47" strokeWidth="2.5" fill="none" />
            {/* Bouquet of 3 sunflowers */}
            {[
              { x: 6, y: 18, s: 0.82 },
              { x: 34, y: 20, s: 0.8 },
              { x: 20, y: 6, s: 0.95 },
            ].map((fl, i) => (
              <g key={i} transform={`translate(${fl.x}, ${fl.y}) scale(${fl.s})`}>
                {Array.from({ length: 12 }, (_, idx) => (
                  <ellipse
                    key={idx}
                    cx="0"
                    cy="-13"
                    rx="3.8"
                    ry="8.5"
                    fill={idx % 2 === 0 ? '#F9C846' : '#E8A92E'}
                    transform={`rotate(${idx * 30})`}
                  />
                ))}
                <circle cx="0" cy="0" r="8" fill="#59391F" />
              </g>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
};

interface GirlProps {
  holdingBouquet?: boolean;
  className?: string;
}

export const IllustratedGirl: React.FC<GirlProps> = ({
  holdingBouquet = false,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 210 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Illustrated girl approaching gently"
    >
      {/* Ground shadow */}
      <ellipse cx="105" cy="302" rx="48" ry="9" fill="#4A2E17" opacity="0.2" />

      {/* Shoes */}
      <ellipse cx="90" cy="294" rx="11" ry="5.5" fill="#7A4F2B" />
      <ellipse cx="120" cy="294" rx="11" ry="5.5" fill="#7A4F2B" />

      {/* Legs */}
      <rect x="86" y="246" width="8" height="46" rx="4" fill="#F0CBB0" />
      <rect x="115" y="246" width="8" height="46" rx="4" fill="#F0CBB0" />

      {/* Flowing sundress in soft peach & cream */}
      <path
        d="M84 128 C84 118 94 114 105 114 C116 114 126 118 126 128 L148 250 Q105 262 62 250 Z"
        fill="#F6D3B5"
        stroke="#E6B691"
        strokeWidth="1.4"
      />
      <path d="M72 222 Q105 232 138 222" stroke="#FFF7E7" strokeWidth="2.5" opacity="0.65" fill="none" />

      {/* Arms */}
      <path d="M84 134 Q68 158 62 178" stroke="#F0CBB0" strokeWidth="9.5" strokeLinecap="round" />
      <path d="M126 134 Q140 162 146 184" stroke="#F0CBB0" strokeWidth="9.5" strokeLinecap="round" />

      {/* Hair back layer */}
      <path
        d="M74 74 C69 102 74 128 84 138 Q105 144 126 138 C136 128 141 102 136 74 Z"
        fill="#4A2E17"
      />

      {/* Neck & Head */}
      <rect x="98" y="96" width="14" height="20" rx="7" fill="#F0CBB0" />
      <circle cx="105" cy="74" r="26" fill="#F6D7BF" />

      {/* Rosy cheeks & gentle eyes */}
      <ellipse cx="90" cy="80" rx="4.8" ry="2.8" fill="#E48F76" opacity="0.45" />
      <ellipse cx="120" cy="80" rx="4.8" ry="2.8" fill="#E48F76" opacity="0.45" />
      <circle cx="95" cy="72" r="2.4" fill="#3D2410" />
      <circle cx="115" cy="72" r="2.4" fill="#3D2410" />
      <circle cx="96" cy="71" r="0.8" fill="#FFFCF5" />
      <circle cx="116" cy="71" r="0.8" fill="#FFFCF5" />
      <path d="M98 83 Q105 88 112 83" stroke="#8C4F3E" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Hair front & tiny sunflower hairclip */}
      <path
        d="M78 72 C80 46 95 40 106 42 C122 42 132 52 131 72 C123 60 112 56 100 58 C90 60 83 64 78 72 Z"
        fill="#4A2E17"
      />
      <circle cx="123" cy="57" r="5" fill="#F9C846" />
      <circle cx="123" cy="57" r="2.2" fill="#59391F" />

      {/* Optional bouquet when boy gives it to her */}
      {holdingBouquet && (
        <g transform="translate(50, 148)">
          <path d="M8 28 L22 64 L36 28 Z" fill="#FFF7E7" stroke="#D98A47" strokeWidth="1.2" />
          {[
            { x: 8, y: 16, s: 0.78 },
            { x: 34, y: 18, s: 0.78 },
            { x: 21, y: 6, s: 0.9 },
          ].map((fl, i) => (
            <g key={i} transform={`translate(${fl.x}, ${fl.y}) scale(${fl.s})`}>
              {Array.from({ length: 10 }, (_, idx) => (
                <ellipse
                  key={idx}
                  cx="0"
                  cy="-12"
                  rx="3.6"
                  ry="8"
                  fill="#F9C846"
                  transform={`rotate(${idx * 36})`}
                />
              ))}
              <circle cx="0" cy="0" r="7" fill="#59391F" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};

interface ButterflyProps {
  onClick: () => void;
  discovered?: boolean;
  className?: string;
}

export const InteractiveButterfly: React.FC<ButterflyProps> = ({
  onClick,
  discovered = false,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Catch fluttering golden butterfly"
    className={`group cursor-pointer p-2 rounded-full transition-transform hover:scale-125 focus-visible:ring-2 focus-visible:ring-[#D98A47] animate-butterfly ${className}`}
  >
    <svg width="36" height="30" viewBox="0 0 36 30" fill="none" aria-hidden="true">
      <path
        d="M17 15 C11 4, 2 5, 3 13 C4 19, 11 19, 17 16 Z"
        fill={discovered ? '#E8A92E' : '#F9C846'}
        stroke="#59391F"
        strokeWidth="0.9"
      />
      <path
        d="M19 15 C25 4, 34 5, 33 13 C32 19, 25 19, 19 16 Z"
        fill={discovered ? '#E8A92E' : '#F9C846'}
        stroke="#59391F"
        strokeWidth="0.9"
      />
      <path d="M17 16 C12 20, 7 26, 11 27 C14 28, 17 22, 17 16 Z" fill="#F6D3B5" stroke="#59391F" strokeWidth="0.8" />
      <path d="M19 16 C24 20, 29 26, 25 27 C22 28, 19 22, 19 16 Z" fill="#F6D3B5" stroke="#59391F" strokeWidth="0.8" />
      <line x1="18" y1="8" x2="18" y2="23" stroke="#59391F" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </button>
);

interface FallingPetalsProps {
  onPetalClick: () => void;
}

const PETAL_SLOTS = [
  { left: '12%', delay: '0s', dur: '13s' },
  { left: '31%', delay: '3.5s', dur: '15s' },
  { left: '58%', delay: '1.8s', dur: '12s' },
  { left: '82%', delay: '5s', dur: '14s' },
];

export const FallingPetalsOverlay: React.FC<FallingPetalsProps> = ({ onPetalClick }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden" aria-hidden="false">
      {PETAL_SLOTS.map((slot, idx) => (
        <button
          key={idx}
          type="button"
          onClick={onPetalClick}
          aria-label={`Catch falling sunflower petal ${idx + 1}`}
          style={{
            left: slot.left,
            animationDelay: slot.delay,
            animationDuration: slot.dur,
          }}
          className="pointer-events-auto absolute -top-8 cursor-pointer p-2 opacity-85 hover:scale-125 transition-transform animate-float-petal"
        >
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" aria-hidden="true">
            <path
              d="M10 1 C15 8, 17 18, 10 27 C3 18, 5 8, 10 1 Z"
              fill={idx % 2 === 0 ? '#F9C846' : '#E8A92E'}
              stroke="#D98A47"
              strokeWidth="0.8"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};
