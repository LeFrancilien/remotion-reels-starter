import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { bodyFamily, displayFamily } from '../font';
import { BRAND_GRADIENT, COLORS, SPRING_CONFIG, gradientText } from '../theme';

export type Stat = {
  value: string;
  unit: string;
  label: string;
};

/**
 * A number card with a gradient border.
 *
 * The border is a gradient container with `padding: 2` wrapping an opaque child,
 * not a `border-image`: `border-image` does not follow `border-radius`, so the
 * corners come out square.
 */
export const StatCard: React.FC<{ stat: Stat; delay?: number }> = ({ stat, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, delay, config: SPRING_CONFIG });

  return (
    <div
      style={{
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.82, 1])})`,
        backgroundImage: BRAND_GRADIENT,
        padding: 2,
        borderRadius: 30,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.card,
          borderRadius: 28,
          padding: '30px 34px',
          minWidth: 250,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1,
              ...gradientText,
            }}
          >
            {stat.value}
          </span>
          <span
            style={{
              fontFamily: displayFamily,
              fontSize: 40,
              fontWeight: 500,
              color: COLORS.accent,
            }}
          >
            {stat.unit}
          </span>
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: bodyFamily,
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.textMuted,
          }}
        >
          {stat.label}
        </div>
      </div>
    </div>
  );
};
