/**
 * Subtitle timing.
 *
 * Segments are spread across the composition in proportion to their character
 * count. This assumes a constant speaking rate, which is an approximation: it
 * holds well when segments are of comparable length and drifts when one is much
 * shorter than the others.
 *
 * If your voice track comes with real timings (an SRT, or word timestamps from
 * your TTS provider), prefer them — replace this function and keep the same
 * return shape. This exists so the template works with nothing but an array of
 * strings.
 */

export type Subtitle = {
  /** The text to show at this frame. */
  text: string;
  /** Index in the source array. Use it as a React `key` to retrigger entrances. */
  index: number;
  /** Frame at which this segment started, for a local fade-in. */
  startedAt: number;
};

export const currentSubtitle = (
  segments: readonly string[],
  frame: number,
  durationInFrames: number,
): Subtitle => {
  if (segments.length === 0) {
    return { text: '', index: 0, startedAt: 0 };
  }

  const lengths = segments.map((s) => s.length);
  const total = lengths.reduce((a, b) => a + b, 0) || 1;

  // Boundaries accumulate rather than being computed per segment: rounding each
  // one independently lets the error add up and leaves a gap at the end.
  let start = 0;
  for (let i = 0; i < segments.length; i++) {
    const end = start + (lengths[i] / total) * durationInFrames;
    if (frame < end) {
      return { text: segments[i], index: i, startedAt: start };
    }
    start = end;
  }

  return {
    text: segments[segments.length - 1],
    index: segments.length - 1,
    startedAt: start,
  };
};
