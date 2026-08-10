import { useVideoConfig } from 'remotion';

/**
 * True when the composition is taller than it is wide.
 *
 * Orientation is derived from the composition rather than passed down as a prop:
 * scenes already call `useVideoConfig()`, so one component can serve both a 9:16
 * and a 16:9 composition with no plumbing. A duplicated set of scenes would
 * diverge the first time someone edits a single line of copy.
 */
export const useIsVertical = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};

/**
 * Bottom band covered by the TikTok / Reels / Shorts interface, in pixels, on a
 * 1920px-tall canvas. Captions, the follow button and the action rail sit here.
 *
 * Nothing you need read should be placed inside it. It is exported rather than
 * inlined so you can check your own layout against it.
 */
export const UI_SAFE_BOTTOM = 384;
