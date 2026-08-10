import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../theme';

/**
 * Permanent backdrop: a technical grid plus two orbs that drift across the whole
 * composition.
 *
 * Mount it once, OUTSIDE any `<Sequence>`. Inside a sequence `useCurrentFrame()`
 * is local to that sequence, so the drift would restart at every scene and the
 * reel would read as a series of cuts instead of one continuous shot.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            `linear-gradient(${COLORS.accent}0a 1px, transparent 1px), ` +
            `linear-gradient(90deg, ${COLORS.accent}0a 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 40%, transparent 100%)',
        }}
      />

      <Orb color={COLORS.accent} x={interpolate(progress, [0, 1], [12, 30])} y={22} size={900} />
      <Orb color={COLORS.secondary} x={interpolate(progress, [0, 1], [82, 66])} y={78} size={1050} />

      {/* Vignette: pulls the eye back to the centre and hides the orb edges. */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const Orb: React.FC<{ color: string; x: number; y: number; size: number }> = ({
  color,
  x,
  y,
  size,
}) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      transform: 'translate(-50%, -50%)',
      background: `radial-gradient(circle, ${color}2e 0%, transparent 66%)`,
      filter: 'blur(60px)',
    }}
  />
);
