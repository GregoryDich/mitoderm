import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  TransitionSeries,
  linearTiming,
} from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import data from '../src/data/ugc-scripts.json';

type Locale = 'en' | 'ru' | 'he';
type L = Record<Locale, string>;
type Scene = {
  id: string;
  dur: number;
  media: string;
  motion?: string;
  transition?: string;
  onScreen: L;
};
type Script = {
  id: string;
  accent: 'gold' | 'teal' | 'rose';
  hook: L;
  scenes: Scene[];
  cta: L;
};
// One resolved visual source per scene, chosen at render time (clip > frame > still).
type Source = { type: 'video' | 'image'; src: string };

const FPS = 30;
const TRANSITION = 12; // frames
const END = 75; // 2.5s end card
const ACCENTS: Record<string, string> = { gold: '#dfba74', teal: '#6fb7ba', rose: '#b4607e' };
const FONT = '"Inter","Helvetica Neue","Segoe UI",system-ui,-apple-system,sans-serif';

export const getScript = (id: string): Script =>
  (data.scripts as unknown as Script[]).find((s) => s.id === id) ??
  (data.scripts[0] as unknown as Script);

export const totalDurationInFrames = (scriptId: string): number => {
  const s = getScript(scriptId);
  const scenes = s.scenes.reduce((a, sc) => a + Math.round(sc.dur * FPS), 0);
  return scenes + END - s.scenes.length * TRANSITION;
};

// Ken-Burns transform for a scene, over its own local timeline.
const kenBurns = (motion: string | undefined, frame: number, dur: number) => {
  const p = interpolate(frame, [0, dur], [0, 1], { extrapolateRight: 'clamp' });
  switch (motion) {
    case 'zoom-out':
      return `scale(${interpolate(p, [0, 1], [1.18, 1.05])})`;
    case 'pan-left':
      return `scale(1.14) translateX(${interpolate(p, [0, 1], [3, -3])}%)`;
    case 'pan-right':
      return `scale(1.14) translateX(${interpolate(p, [0, 1], [-3, 3])}%)`;
    case 'push-up':
      return `scale(1.14) translateY(${interpolate(p, [0, 1], [3, -3])}%)`;
    case 'zoom-in':
    default:
      return `scale(${interpolate(p, [0, 1], [1.05, 1.18])})`;
  }
};

const Visual: React.FC<{ source: Source; motion?: string; dur: number }> = ({
  source,
  motion,
  dur,
}) => {
  const frame = useCurrentFrame();
  const transform = kenBurns(motion, frame, dur);
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };
  return (
    <AbsoluteFill style={{ transform }}>
      {source.type === 'video' ? (
        <OffthreadVideo src={staticFile(source.src)} muted style={style} />
      ) : (
        <Img src={staticFile(source.src)} style={style} />
      )}
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{
  scene: Scene;
  source: Source;
  accent: string;
  locale: Locale;
  index: number;
  isFirst: boolean;
  hook: string;
  durFrames: number;
}> = ({ scene, source, accent, locale, index, isFirst, hook, durFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rtl = locale === 'he';
  const enter = spring({ frame: frame - 3, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#08080a' }}>
      <Visual source={source} motion={scene.motion} dur={durFrames} />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.22) 38%, rgba(8,8,10,0.92) 100%)',
        }}
      />
      {isFirst && (
        <div
          style={{
            position: 'absolute',
            insetInlineStart: 72,
            insetInlineEnd: 72,
            top: 150,
            direction: rtl ? 'rtl' : 'ltr',
            textAlign: rtl ? 'right' : 'left',
            fontFamily: FONT,
            color: '#f5f2f0',
            fontSize: 60,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            opacity: enter,
            textShadow: '0 4px 30px rgba(0,0,0,0.6)',
          }}
        >
          {hook}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          insetInlineStart: 72,
          insetInlineEnd: 72,
          bottom: 300,
          direction: rtl ? 'rtl' : 'ltr',
          textAlign: rtl ? 'right' : 'left',
          fontFamily: FONT,
          transform: `translateY(${y}px)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            color: '#08080a',
            background: accent,
            padding: '4px 18px',
            borderRadius: 999,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '0.14em',
            marginBottom: 22,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
        <div
          style={{
            color: '#f5f2f0',
            fontSize: 76,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 30px rgba(0,0,0,0.65)',
          }}
        >
          {scene.onScreen[locale]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ cta: string; accent: string; locale: Locale }> = ({
  cta,
  accent,
  locale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#08080a',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        direction: locale === 'he' ? 'rtl' : 'ltr',
      }}
    >
      <div style={{ opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, textAlign: 'center', padding: 80 }}>
        <div style={{ color: '#f5f2f0', fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{cta}</div>
        <div style={{ marginTop: 40, display: 'inline-block', height: 6, width: 120, background: accent, borderRadius: 6 }} />
        <div style={{ marginTop: 40, color: 'rgba(245,242,240,0.6)', fontSize: 30, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Mitoderm</div>
      </div>
    </AbsoluteFill>
  );
};

const Progress: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'rgba(255,255,255,0.12)', zIndex: 10 }}>
      <div style={{ height: '100%', width: `${w}%`, background: accent }} />
    </div>
  );
};

const presentation = (t: string | undefined) => {
  switch (t) {
    case 'slide-left':
      return slide({ direction: 'from-right' });
    case 'wipe-up':
      return wipe({ direction: 'from-bottom' });
    case 'dissolve':
    default:
      return fade();
  }
};

export const Short: React.FC<{
  scriptId: string;
  locale: Locale;
  sources?: Source[];
}> = ({ scriptId, locale, sources }) => {
  const script = getScript(scriptId);
  const accent = ACCENTS[script.accent] ?? ACCENTS.gold;

  const resolved: Source[] = script.scenes.map(
    (sc, i) =>
      sources?.[i] ?? { type: 'image', src: sc.media.replace(/^\//, '') }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#08080a' }}>
      <TransitionSeries>
        {script.scenes.flatMap((scene, i) => {
          const durFrames = Math.round(scene.dur * FPS);
          return [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={durFrames}>
              <SceneView
                scene={scene}
                source={resolved[i]}
                accent={accent}
                locale={locale}
                index={i}
                isFirst={i === 0}
                hook={script.hook[locale]}
                durFrames={durFrames}
              />
            </TransitionSeries.Sequence>,
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={presentation(scene.transition)}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />,
          ];
        })}
        <TransitionSeries.Sequence key="end" durationInFrames={END}>
          <EndCard cta={script.cta[locale]} accent={accent} locale={locale} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Progress accent={accent} />
    </AbsoluteFill>
  );
};
