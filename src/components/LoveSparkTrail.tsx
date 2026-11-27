import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LoveSparkParticle } from '../utils/loveSpark';

interface LoveSparkTrailProps {
  particles: LoveSparkParticle[];
  glowCursor: { x: number; y: number; active: boolean };
}

export const LoveSparkTrail: React.FC<LoveSparkTrailProps> = ({
  particles,
  glowCursor,
}) => {
  return (
    <div
      data-testid="love-spark-layer"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {/* Warm cursor-following glow halo during active Love Spark trail */}
      <AnimatePresence>
        {glowCursor.active && (
          <motion.div
            key="love-spark-aura"
            data-testid="love-spark-aura"
            initial={{
              x: glowCursor.x - 48,
              y: glowCursor.y - 48,
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              x: glowCursor.x - 48,
              y: glowCursor.y - 48,
              opacity: 0.78,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{
              x: { type: 'spring', stiffness: 360, damping: 26 },
              y: { type: 'spring', stiffness: 360, damping: 26 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.25 },
            }}
            className="absolute top-0 left-0 h-24 w-24 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,232,163,0.75) 0%, rgba(249,200,70,0.34) 42%, rgba(217,138,71,0) 72%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Heart-shaped bloom & cursor-following heart sparks */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            data-testid="love-spark-particle"
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              filter: 'drop-shadow(0 0 8px rgba(249, 200, 70, 0.85))',
            }}
            initial={{
              x: -p.size / 2,
              y: -p.size / 2,
              scale: 0.25,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: p.dx - p.size / 2,
              y: p.dy - p.size / 2,
              scale: [0.35, p.scale * 1.18, p.scale * 0.72],
              opacity: [0, 0.96, 0],
              rotate: p.rotate,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeOut',
            }}
          >
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 21.2 C12 21.2 4 15.6 4 9.6 C4 6.5 6.4 4.2 9.2 4.2 C10.8 4.2 12 5.2 12 6.4 C12 5.2 13.2 4.2 14.8 4.2 C17.6 4.2 20 6.5 20 9.6 C20 15.6 12 21.2 12 21.2 Z"
                fill={p.color}
                stroke="#FFF7E7"
                strokeWidth="0.9"
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
