import { loadFont as loadDmSans } from '@remotion/google-fonts/DMSans';
import { loadFont as loadJetBrainsMono } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

/**
 * Fonts are loaded once, here, and imported everywhere else.
 *
 * Weights are listed explicitly on purpose: `loadFont()` without options does
 * not necessarily fetch the heavy weights, and the renderer then silently falls
 * back to a system sans-serif. You only notice it in the final MP4.
 */

/** Headlines. */
export const { fontFamily: displayFamily } = loadSpaceGrotesk('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
});

/** Body copy and subtitles. */
export const { fontFamily: bodyFamily } = loadDmSans('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext'],
});

/** Numbers, metrics, code. */
export const { fontFamily: monoFamily } = loadJetBrainsMono('normal', {
  weights: ['400', '500', '700', '800'],
  subsets: ['latin', 'latin-ext'],
});
