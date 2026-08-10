/**
 * Design tokens. This is the only file you need to touch to rebrand the template.
 *
 * The palette is deliberately neutral: a dark canvas, one accent, one secondary.
 * Change `accent` and `secondary` and every card border, gradient text, CTA pill
 * and background orb follows, because nothing below hardcodes a colour.
 */

export const COLORS = {
  accent: '#4f8cff',
  secondary: '#a855f7',
  bg: '#0d0d11',
  card: '#141418',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.62)',
} as const;

export const BRAND_GRADIENT = `linear-gradient(135deg, ${COLORS.accent} 0%, ${COLORS.secondary} 100%)`;

/**
 * Gradient applied to text. `-webkit-background-clip` is required — without the
 * prefixed property Chrome paints the box, not the glyphs.
 *
 * Careful: `background-clip: text` clips the WHOLE background of the element. If
 * you also set a `backgroundColor` on the same node, that colour disappears too
 * and you get an empty gradient rectangle. Put the fill on a parent instead.
 */
export const gradientText = {
  backgroundImage: BRAND_GRADIENT,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
} as const;

/** Soft halo, used on the CTA and anything that should read as lit. */
export const glow = (color: string, strength = 1) => ({
  filter: `drop-shadow(0 0 ${18 * strength}px ${color}) drop-shadow(0 0 ${52 * strength}px ${color}66)`,
});

/**
 * One spring config for the whole project.
 *
 * Every entrance animation imports this instead of passing its own numbers, so
 * elements that appear a few frames apart still feel like one system. Change it
 * here and the entire reel re-times consistently.
 */
export const SPRING_CONFIG = { damping: 12, mass: 0.5 } as const;
