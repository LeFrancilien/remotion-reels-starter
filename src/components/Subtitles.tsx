import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { bodyFamily } from '../font';
import { COLORS } from '../theme';
import { currentSubtitle } from '../timing';

/**
 * One subtitle segment at a time, faded in over 6 frames.
 *
 * The `key` on the inner node is what makes the fade replay: without it React
 * reuses the same element, the interpolation stays at 1 and the text swaps with
 * no transition at all.
 */
export const Subtitles: React.FC<{ segments: readonly string[] }> = ({ segments }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const current = currentSubtitle(segments, frame, durationInFrames);

  if (!current.text) {
    return null;
  }

  return (
    <div style={{ minHeight: 168, display: 'flex', alignItems: 'center' }}>
      <div
        key={current.index}
        style={{
          opacity: interpolate(frame - current.startedAt, [0, 6], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          fontFamily: bodyFamily,
          fontSize: 46,
          fontWeight: 500,
          lineHeight: 1.25,
          textAlign: 'center',
          color: COLORS.text,
          backgroundColor: 'rgba(13,13,17,0.72)',
          borderRadius: 22,
          padding: '20px 32px',
        }}
      >
        {current.text}
      </div>
    </div>
  );
};
