import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { bodyFamily, monoFamily } from '../font';
import { COLORS } from '../theme';

export type Clip = {
  /** Path under `public/`, e.g. `"avatar.mp4"` or `"clips/take-3.mp4"`. */
  file: string;
  /** Intrinsic size of the source file. */
  width: number;
  height: number;
  /**
   * Useful area of the source, in source pixels, when the file is letterboxed.
   *
   * Talking-head providers commonly return a clip that respects the requested
   * aspect ratio by padding the real footage with flat colour. Those bands are
   * invisible on a white page and obvious over a dark composition. Measure the
   * first and last non-uniform row once and put them here.
   */
  crop?: { top: number; bottom: number } | null;
};

/**
 * How much of the useful area to keep, measured from its top. 0 keeps the top of
 * the frame, 0.5 centres it. Faces usually sit in the upper third of a
 * chest-height shot, so staying low avoids cropping the chin.
 *
 * It only bites when the source overflows vertically. If the useful area is
 * flatter than the band, the scale is driven by height and there is no vertical
 * overflow left to anchor.
 */
const FACE_ANCHOR = 0.12;

/**
 * Scale and offset that make the clip cover the band.
 *
 * The scale covers BOTH dimensions (`Math.max`, not `Math.min`). Covering only
 * the width lets a source flatter than the band show its padding at the bottom,
 * which is exactly the failure this is written to avoid.
 */
const cover = (clip: Clip, bandWidth: number, bandHeight: number) => {
  const source = clip.crop ?? { top: 0, bottom: clip.height - 1 };
  const useful = source.bottom - source.top + 1;
  const scale = Math.max(bandWidth / clip.width, bandHeight / useful);
  const overflowY = Math.max(0, useful * scale - bandHeight);
  const overflowX = Math.max(0, clip.width * scale - bandWidth);
  return {
    scale,
    offsetX: -overflowX / 2,
    offsetY: -(source.top * scale + overflowY * FACE_ANCHOR),
  };
};

/**
 * Lower band of the split screen.
 *
 * `OffthreadVideo` rather than `<Video />`: Remotion recommends it as soon as you
 * render outside the preview, because browser decoding is not reliable frame by
 * frame. The API is the same.
 */
export const VideoBand: React.FC<{
  clip: Clip | null;
  width: number;
  height: number;
}> = ({ clip, width, height }) => {
  if (!clip) {
    return <Placeholder height={height} />;
  }

  const frame = cover(clip, width, height);

  return (
    <div style={{ width: '100%', height, overflow: 'hidden' }}>
      <OffthreadVideo
        src={staticFile(clip.file)}
        style={{
          width: '100%',
          transformOrigin: 'top left',
          transform:
            `translate(${frame.offsetX}px, ${frame.offsetY}px) scale(${frame.scale})`,
        }}
      />
    </div>
  );
};

/**
 * Shown when no clip is configured, so the project renders on a clean checkout
 * with no media at all. Replace it by pointing `clip` at a file in `public/`.
 */
const Placeholder: React.FC<{ height: number }> = ({ height }) => (
  <AbsoluteFill
    style={{
      position: 'relative',
      height,
      backgroundColor: COLORS.card,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      backgroundImage:
        `repeating-linear-gradient(45deg, ${COLORS.accent}0d 0 24px, transparent 24px 48px)`,
    }}
  >
    <div style={{ fontFamily: monoFamily, fontSize: 34, color: COLORS.accent, letterSpacing: 2 }}>
      YOUR CLIP HERE
    </div>
    <div style={{ fontFamily: bodyFamily, fontSize: 26, color: COLORS.textMuted }}>
      drop an mp4 in public/ and set "clip" in the JSON
    </div>
  </AbsoluteFill>
);
