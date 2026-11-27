export interface LoveSparkParticle {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  scale: number;
  rotate: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

const SPARK_COLORS = [
  '#F9C846',
  '#FFE28A',
  '#F6B89E',
  '#E8A92E',
  '#FFF1C9',
];

let uidCounter = 0;
function nextSparkId(prefix: string): string {
  uidCounter += 1;
  return `${prefix}-${Date.now()}-${uidCounter}`;
}

export function createHeartBloomParticles(
  originX: number,
  originY: number,
  count = 14,
): LoveSparkParticle[] {
  const safeCount = Math.max(6, Math.min(24, count));
  const particles: LoveSparkParticle[] = [];

  for (let i = 0; i < safeCount; i++) {
    const t = (i / safeCount) * Math.PI * 2;
    // Parametric heart curve
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );
    const spread = 3.2 + (i % 3) * 0.35;

    particles.push({
      id: nextSparkId('bloom'),
      x: originX,
      y: originY,
      dx: Number((hx * spread).toFixed(1)),
      dy: Number((hy * spread - 12).toFixed(1)),
      scale: 0.85 + (i % 3) * 0.2,
      rotate: ((i % 5) - 2) * 10,
      color: SPARK_COLORS[i % SPARK_COLORS.length],
      size: 14 + (i % 3) * 4,
      delay: (i % 4) * 0.03,
      duration: 1.05 + (i % 3) * 0.14,
    });
  }

  return particles;
}

export function createCursorTrailSpark(
  x: number,
  y: number,
  sequence: number,
): LoveSparkParticle {
  const angle = ((sequence % 7) - 3) * 0.32;
  const dx = Math.sin(angle) * 20;
  const dy = -26 - (sequence % 3) * 10;

  return {
    id: nextSparkId('trail'),
    x,
    y,
    dx: Number(dx.toFixed(1)),
    dy: Number(dy.toFixed(1)),
    scale: 0.72 + (sequence % 3) * 0.16,
    rotate: ((sequence % 5) - 2) * 14,
    color: SPARK_COLORS[sequence % SPARK_COLORS.length],
    size: 12 + (sequence % 3) * 3,
    delay: 0,
    duration: 1.05,
  };
}
