import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {FPS, TOTAL} from './timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Film"
      component={Film}
      durationInFrames={Math.ceil(TOTAL * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
