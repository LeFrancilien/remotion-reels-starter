import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { Background } from './components/Background';
import { CtaPill } from './components/CtaPill';
import { StatCard } from './components/StatCard';
import { Subtitles } from './components/Subtitles';
import { VideoBand } from './components/VideoBand';
import { displayFamily } from './font';
import { BRAND_GRADIENT, COLORS, SPRING_CONFIG } from './theme';
import { REELS, type ReelName } from '../data/reels';

/**
 * 9:16 reel, 50/50 split screen.
 *
 *   0    – 960px   overlay: headline, stat cards, subtitles
 *   960  – 1920px  your footage, cropped to the band
 *
 * WHY 50/50
 * The platform interface covers roughly the bottom 384px (see `UI_SAFE_BOTTOM`).
 * With a 1280/640 split the interface eats more than half of the footage band and
 * the face has to be framed unnaturally high to survive. At 960/960 it covers
 * 384 of 960, leaving 576px of visible footage, and the framing can be normal.
 *
 * The trade-off is real and worth knowing before you shoot: the band is now
 * portrait (1080x960) while most talking-head footage is wide and flat. Covering
 * a portrait band with flat footage means scaling up, which crops the sides. A
 * taller source is the only thing that fixes it — no setting will.
 *
 * ONE COMPONENT, MANY REELS
 * The variant prop indexes `REELS`. Imports there are static on purpose: Remotion
 * bundles the project ahead of time, so a computed `import()` would not resolve
 * at render time.
 */

export const reelSchema = z.object({
  variant: z.custom<ReelName>(),
});

/** Split line. Strict half of 1920. */
const OVERLAY_HEIGHT = 960;
const BAND_HEIGHT = 1920 - OVERLAY_HEIGHT;

export const Reel: React.FC<z.infer<typeof reelSchema>> = ({ variant }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const config = REELS[variant];

  const headline = spring({ frame, fps, config: SPRING_CONFIG });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Outside every Sequence, so the orbs drift across the whole reel. */}
      <Background />

      {/* ── Upper half: overlay ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: OVERLAY_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // The bottom padding is not decoration: the CTA pill straddles the
          // seam and its top edge sits 46px above it. Anything less than ~92px
          // here and a two-line subtitle runs underneath the pill.
          padding: '76px 64px 92px',
        }}
      >
        {/*
          The headline stays anchored at the top. It is the hook: it has to be
          readable on frame 1. Only the cards centre themselves in what is left,
          otherwise a large gap opens in the middle of the frame.
        */}
        <div
          style={{
            opacity: headline,
            transform: `translateY(${interpolate(headline, [0, 1], [40, 0])}px)`,
            fontFamily: displayFamily,
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
            textAlign: 'center',
            color: COLORS.text,
          }}
        >
          {config.headline}
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {config.stats.map((stat, i) => (
            // Staggered entrances, same spring physics for all of them.
            <StatCard key={stat.label} stat={stat} delay={22 + i * 9} />
          ))}
        </div>

        <Subtitles segments={config.subtitles} />
      </div>

      {/* ── Lower half: footage ──────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: OVERLAY_HEIGHT, left: 0, width: '100%' }}>
        <VideoBand clip={config.clip} width={width} height={BAND_HEIGHT} />
      </div>

      {/* Seam between the two halves. */}
      <div
        style={{
          position: 'absolute',
          top: OVERLAY_HEIGHT - 3,
          left: 0,
          width: '100%',
          height: 3,
          backgroundImage: BRAND_GRADIENT,
        }}
      />

      {/* CTA sits on the seam: high enough to clear the platform interface. */}
      <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
        <div style={{ marginTop: OVERLAY_HEIGHT - 46 }}>
          <CtaPill label={config.cta} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
