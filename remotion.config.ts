import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// These compositions are mostly flat dark areas and gradients. A low CRF is what
// keeps banding off the near-black background; at the default it is visible.
Config.setCrf(16);
