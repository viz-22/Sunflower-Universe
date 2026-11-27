import React from 'react';

interface SunflowerLogoProps {
  size?: number;
  className?: string;
}

export const SunflowerLogo: React.FC<SunflowerLogoProps> = ({
  size = 34,
  className = '',
}) => {
  const petals = Array.from({ length: 14 }, (_, i) => i * (360 / 14));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sfLogoCentre" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#7A4F2B" />
          <stop offset="100%" stopColor="#4A2E17" />
        </radialGradient>
        <linearGradient id="sfLogoPetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9C846" />
          <stop offset="100%" stopColor="#E09422" />
        </linearGradient>
      </defs>

      {/* Outer alternating golden petals */}
      <g transform="translate(32 32)">
        {petals.map((deg, idx) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-18.5"
            rx={idx % 2 === 0 ? '4.2' : '3.6'}
            ry={idx % 2 === 0 ? '10.5' : '9.4'}
            fill={idx % 2 === 0 ? 'url(#sfLogoPetal)' : '#F2B830'}
            opacity={idx % 2 === 0 ? 0.98 : 0.86}
            transform={`rotate(${deg})`}
          />
        ))}
      </g>

      {/* Deep brown seed disk */}
      <circle cx="32" cy="32" r="11.2" fill="url(#sfLogoCentre)" stroke="#3D2410" strokeWidth="1.2" />

      {/* Subtle golden ring */}
      <circle cx="32" cy="32" r="9.4" stroke="#E8A92E" strokeWidth="0.6" strokeDasharray="1.5 2.2" opacity="0.65" />

      {/* Delicate heart integrated inside the centre */}
      <path
        d="M32 37.6C32 37.6 26.2 33.7 26.2 29.9C26.2 28.0 27.6 26.6 29.3 26.6C30.4 26.6 31.4 27.2 32 28.2C32.6 27.2 33.6 26.6 34.7 26.6C36.4 26.6 37.8 28.0 37.8 29.9C37.8 33.7 32 37.6 32 37.6Z"
        fill="#F9C846"
        opacity="0.92"
      />
    </svg>
  );
};
