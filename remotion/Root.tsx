import React from 'react';
import { Composition } from 'remotion';
import { Short, totalDurationInFrames } from './Short';
import data from '../src/data/ugc-scripts.json';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Short"
        component={Short}
        durationInFrames={450}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          scriptId: 'vtech-mechanism',
          locale: 'en' as const,
          sources: undefined,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: totalDurationInFrames(props.scriptId),
        })}
      />
    </>
  );
};

// exported for reference / batch tooling
export const scriptIds = (data.scripts as { id: string }[]).map((s) => s.id);
