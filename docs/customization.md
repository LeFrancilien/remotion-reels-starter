# Customization reference

Every reel is one JSON file in `data/`, registered by one line in
`data/reels.ts`. This page documents every field the component reads.

Written in English only; the README carries the bilingual overview.

## A complete reel file

```jsonc
{
  // Composition id, used in Remotion Studio and on the CLI:
  //   npx remotion render ReelLaunch out/launch.mp4
  // Must be unique across data/reels.ts. Letters, digits, dashes.
  "id": "ReelLaunch",

  // Canvas. 1080x1920 at 30fps is the common denominator across
  // TikTok, Instagram Reels, YouTube Shorts and Facebook Reels.
  "fps": 30,
  "width": 1080,
  "height": 1920,

  // Total length. 540 frames / 30fps = 18s.
  // When a clip is attached, match this to the clip so the video does
  // not freeze on its last frame or get cut mid-sentence.
  "durationInFrames": 540,

  // The hook. Anchored to the top of the frame and animated in on frame 0,
  // because it has to be readable before anyone decides to scroll past.
  // Two lines read well, three is the practical ceiling at 82px.
  "headline": "Ship the same video ten different ways",

  // 0 to 3 number cards, centred in the space between headline and subtitles.
  // Each enters on a spring, staggered 9 frames apart.
  "stats": [
    { "value": "1",  "unit": "x", "label": "component" },
    { "value": "10", "unit": "",  "label": "variants"  },
    { "value": "18", "unit": "s", "label": "per cut"   }
  ],

  // Spoken segments, shown one at a time above the footage band.
  // Timing is proportional to character count — see the caveat below.
  "subtitles": [
    "One component, one JSON file per variant.",
    "Test a different hook without touching the code.",
    "Only the copy changes, so the comparison stays readable.",
    "That is the whole point of the template."
  ],

  // Call to action. Enters at 70% of the duration and sits on the seam
  // between the two halves, above the platform interface.
  "cta": "Read the README",

  // null renders the built-in placeholder. See "Attaching footage".
  "clip": null
}
```

## Field reference

| Field | Type | Notes |
|---|---|---|
| `id` | string | Composition id. Unique. This is what `remotion render` takes. |
| `fps` | number | 30 unless you have a reason. |
| `width` / `height` | number | 1080 / 1920 for the 9:16 master. |
| `durationInFrames` | number | Total length. Match your clip when you attach one. |
| `headline` | string | Top of frame, on screen from frame 0. |
| `stats` | array | 0 to 3 items of `{ value, unit, label }`. All strings. |
| `subtitles` | string[] | One segment shown at a time. |
| `cta` | string | Short. It is a pill, not a paragraph. |
| `clip` | object or null | `null` shows the placeholder. |

### `stats[]`

```jsonc
{ "value": "10", "unit": "x", "label": "variants" }
```

`value` and `unit` are **strings**, not numbers, so `"2.5"`, `"90"`, `"5"` and
`""` all work and nothing gets formatted behind your back. `value` renders in
gradient text at 92px, `unit` in accent colour at 40px, `label` in muted body
text at 28px.

Two or three cards fit the 1080px width. A fourth overflows at the current font
size: use two cards, or lower `fontSize` in `src/components/StatCard.tsx`.

### `clip`

```jsonc
"clip": {
  "file": "avatar.mp4",   // path under public/, resolved with staticFile()
  "width": 1080,          // intrinsic size of the source file
  "height": 1920,
  "crop": null            // or { "top": 452, "bottom": 1467 }
}
```

`crop` describes the **useful area** of a letterboxed source, in source pixels.
Talking-head generators honour the aspect ratio you asked for by padding the real
footage with flat colour; those bands are invisible on a white page and obvious
over a dark composition. Measure the first and last non-uniform row once and put
them here — the band will then frame the footage instead of the padding.

The clip is scaled to cover the band in **both** dimensions. A source flatter
than the band gets scaled up and cropped on the sides rather than showing its
padding. That is deliberate, and it is why a wide source in a portrait band
produces a tighter shot than you might expect.

## Colours and fonts

Neither lives in the reel JSON — they are shared by every reel.

- Palette: `src/theme.ts`. Change `accent` and `secondary`; everything
  downstream reads from there.
- Fonts: `src/font.ts`. Space Grotesk for headlines, DM Sans for body,
  JetBrains Mono for numbers, all loaded through `@remotion/google-fonts`.
- Animation feel: `SPRING_CONFIG` in `src/theme.ts`. One config for the whole
  project, so elements appearing seconds apart still belong to the same system.

## Registering a new reel

```ts
// data/reels.ts
import pricing from './pricing.json';

export const REELS = {
  example: example as ReelConfig,
  launch: launch as ReelConfig,
  pricing: pricing as ReelConfig,   // <- one line
} satisfies Record<string, ReelConfig>;
```

`src/Root.tsx` walks `REELS` and registers a composition per entry, so there is
no third list to maintain.

The import must stay **static**. Remotion bundles the project ahead of time; a
computed `import(path)` resolves in the Studio and then fails at render time,
which is the worst place to discover it.

## Known limits

- **Subtitle timing is an approximation.** With no per-word timings, segments are
  spread across the duration in proportion to their character count. It holds
  when segments are of comparable length and drifts when one is much shorter. If
  your voice track has real timings, replace `currentSubtitle()` in
  `src/timing.ts` and keep the return shape.
- **The bottom ~384px belong to the platform.** Captions, the follow button and
  the action rail are drawn there. `UI_SAFE_BOTTOM` in `src/layout.ts` documents
  it; put nothing you need read inside it.
- **There is no audio track wired in.** Add `<Audio />` inside `Reel.tsx` if you
  want music or a voice-over. If you loop it, compute the volume at component
  level and pass a number: under `loop`, the frame handed to a `volume={(f) =>
  …}` callback is local to the iteration, so a fade written that way replays at
  every loop point and never reaches the fade-out.
