import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { displayFamily } from '../font';
import { BRAND_GRADIENT, COLORS, SPRING_CONFIG } from '../theme';

/**
 * Call to action.
 *
 * `delay` defaults to 70% of the composition: late enough that the viewer has
 * heard the point, early enough to be on screen for a few seconds. Pass your own
 * frame number if your script lands elsewhere.
 */
export const CtaPill: React.FC<{ label: string; delay?: number }> = ({ label, delay }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrance = spring({
    frame,
    fps,
    delay: delay ?? Math.round(durationInFrames * 0.7),
    config: SPRING_CONFIG,
  });

  return (
    <div
      style={{
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [24, 0])}px)`,
        padding: '22px 52px',
        borderRadius: 999,
        backgroundImage: BRAND_GRADIENT,
        color: '#08080c',
        fontFamily: displayFamily,
        fontSize: 44,
        fontWeight: 700,
        letterSpacing: -1,
        boxShadow: `0 18px 60px -12px ${COLORS.accent}99`,
      }}
    >
      {label}
    </div>
  );
};
