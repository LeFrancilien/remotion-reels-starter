import { Composition } from 'remotion';
import { Reel, reelSchema } from './Reel';
import { REELS, type ReelName } from '../data/reels';

/**
 * One composition per entry in `REELS`, generated from the data.
 *
 * Registering them in a loop is what keeps the config as the single source of
 * truth: duration, fps and dimensions are read from the JSON instead of being
 * repeated here, so a reel can never be registered at a length that disagrees
 * with its own configuration.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {(Object.keys(REELS) as ReelName[]).map((name) => {
      const config = REELS[name];
      return (
        <Composition
          key={name}
          id={config.id}
          component={Reel}
          schema={reelSchema}
          defaultProps={{ variant: name }}
          durationInFrames={config.durationInFrames}
          fps={config.fps}
          width={config.width}
          height={config.height}
        />
      );
    })}
  </>
);
