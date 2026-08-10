import type { Clip } from '../src/components/VideoBand';
import type { Stat } from '../src/components/StatCard';
import example from './example.json';
import launch from './launch.json';

/**
 * Every reel this project can render.
 *
 * Adding one takes exactly two edits: a JSON file next to these, and a line in
 * `REELS` below. `Root.tsx` walks this object, so there is no third list to keep
 * in sync and no composition id to repeat.
 *
 * The imports are static because Remotion bundles the project before rendering.
 * A dynamic `import(path)` built from a variable resolves in the Studio and then
 * fails at render time, which is the worst place to find out.
 */

export type ReelConfig = {
  /** Composition id in the Studio and on the CLI. */
  id: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  headline: string;
  stats: Stat[];
  subtitles: string[];
  cta: string;
  /** `null` renders the built-in placeholder. */
  clip: Clip | null;
};

export const REELS = {
  example: example as ReelConfig,
  launch: launch as ReelConfig,
} satisfies Record<string, ReelConfig>;

export type ReelName = keyof typeof REELS;
