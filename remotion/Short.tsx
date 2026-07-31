import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
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
  /** 'cut' (default, hard jump cut per the virality rubric) | 'dissolve' |
   *  'slide-left' | 'wipe-up' — transition INTO the next segment. */
  transition?: string;
  /** Kling-grammar camera instruction (one named move, used by
   *  generate-clips.mjs — not by this renderer). */
  camera?: string;
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
// mediaDur (seconds) lets the engine slow a shorter clip to fill a longer
// VO-fitted scene instead of freezing/ending early.
type Source = {
  type: 'video' | 'image';
  src: string;
  mediaDur?: number;
  /** Clip carries its own (lip-synced) voice: play it, never slow it. */
  hasAudio?: boolean;
};

const FPS = 30;
const TRANSITION = 12; // frames
const END = 75; // 2.5s end card
const ACCENTS: Record<string, string> = { gold: '#dfba74', teal: '#6fb7ba', rose: '#b4607e' };
const FONT = '"Inter","Helvetica Neue","Segoe UI",system-ui,-apple-system,sans-serif';

export const getScript = (id: string): Script =>
  (data.scripts as unknown as Script[]).find((s) => s.id === id) ??
  (data.scripts[0] as unknown as Script);

// A transition element is inserted only for non-'cut' scenes; hard cuts
// (the rubric default) cost no overlap frames.
const transitionCount = (s: Script): number =>
  s.scenes.filter((sc) => (sc.transition ?? 'cut') !== 'cut').length;

export const totalDurationInFrames = (scriptId: string): number => {
  const s = getScript(scriptId);
  const scenes = s.scenes.reduce((a, sc) => a + Math.round(sc.dur * FPS), 0);
  return scenes + END - transitionCount(s) * TRANSITION;
};

/** Absolute start frame of each scene on the timeline — a non-'cut'
 *  transition overlaps the next sequence by TRANSITION frames. Used to
 *  align per-scene voiceover; must mirror the TransitionSeries layout. */
const sceneStarts = (s: Script): number[] => {
  const starts: number[] = [];
  let acc = 0;
  s.scenes.forEach((sc, i) => {
    if (i > 0) {
      const prev = s.scenes[i - 1];
      acc +=
        Math.round(prev.dur * FPS) -
        ((prev.transition ?? 'cut') !== 'cut' ? TRANSITION : 0);
    }
    starts.push(acc);
  });
  return starts;
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
  // Scene stretched past the clip length (VO-fit)? Slow the clip to cover
  // the whole beat — doc pacing tolerates gentle slow-mo; never freeze.
  const sceneSec = dur / FPS;
  const rate =
    source.type === 'video' &&
    !source.hasAudio && // never slow a lip-synced clip
    source.mediaDur &&
    source.mediaDur < sceneSec - 0.05
      ? Math.max(source.mediaDur / sceneSec, 0.4)
      : 1;
  return (
    <AbsoluteFill style={{ transform }}>
      {source.type === 'video' ? (
        <OffthreadVideo
          src={staticFile(source.src)}
          muted={!source.hasAudio}
          playbackRate={rate}
          style={style}
        />
      ) : (
        <Img src={staticFile(source.src)} style={style} />
      )}
    </AbsoluteFill>
  );
};

/** Center word-pop captions — the native visual language of top reels:
 *  words appear sequentially across the first ~55% of the beat, each with
 *  a spring pop; key tokens (numbers/percent) take the accent color. */
const WordPop: React.FC<{
  text: string;
  accent: string;
  rtl: boolean;
  durFrames: number;
}> = ({ text, accent, rtl, durFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  const span = Math.max(durFrames * 0.5 - 4, 1);
  return (
    <div
      style={{
        position: 'absolute',
        insetInlineStart: 54,
        insetInlineEnd: 54,
        top: '58%',
        direction: rtl ? 'rtl' : 'ltr',
        textAlign: 'center',
        fontFamily: FONT,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 18,
        rowGap: 4,
      }}
    >
      {words.map((w, i) => {
        const appear = 3 + (i * span) / Math.max(words.length - 1, 1);
        const s = spring({ frame: frame - appear, fps, config: { damping: 14, stiffness: 160 } });
        const key = /[0-9%₪$]|—/.test(w);
        return (
          <span
            key={i}
            style={{
              fontSize: 82,
              lineHeight: 1.12,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: key ? accent : '#ffffff',
              opacity: Math.min(s * 1.4, 1),
              transform: `scale(${interpolate(s, [0, 1], [1.35, 1])})`,
              textShadow: '0 4px 26px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)',
              display: 'inline-block',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
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
  const enter = spring({ frame: frame - 2, fps, config: { damping: 200 } });
  // Punch-in on every cut: 6-frame settle adds cut energy (rubric pacing).
  const punch = interpolate(frame, [0, 6], [1.06, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#08080a' }}>
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <Visual source={source} motion={scene.motion} dur={durFrames} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,10,0.5) 0%, rgba(8,8,10,0.12) 40%, rgba(8,8,10,0.7) 100%)',
        }}
      />
      {isFirst && (
        <div
          style={{
            position: 'absolute',
            insetInlineStart: 60,
            insetInlineEnd: 60,
            top: 140,
            direction: rtl ? 'rtl' : 'ltr',
            textAlign: 'center',
            fontFamily: FONT,
            color: '#f5f2f0',
            fontSize: 58,
            lineHeight: 1.12,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            opacity: enter,
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}
        >
          {hook}
        </div>
      )}
      <WordPop
        text={scene.onScreen[locale] ?? scene.onScreen.en}
        accent={accent}
        rtl={rtl}
        durFrames={durFrames}
      />
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
  /** Path under public/ to a licensed music track; baked when provided. */
  audioSrc?: string;
  audioVolume?: number;
  /** Per-scene voiceover mp3 paths under public/ (null = no VO for that
   *  scene). Aligned to scene starts; music auto-ducks when present. */
  voSrcs?: (string | null)[];
}> = ({ scriptId, locale, sources, audioSrc, audioVolume = 0.35, voSrcs }) => {
  const script = getScript(scriptId);
  const accent = ACCENTS[script.accent] ?? ACCENTS.gold;
  const total = totalDurationInFrames(script.id);
  const starts = sceneStarts(script);
  const hasVo = !!voSrcs?.some(Boolean);
  const musicVol = hasVo ? audioVolume * 0.45 : audioVolume; // duck under VO

  const resolved: Source[] = script.scenes.map(
    (sc, i) =>
      sources?.[i] ?? { type: 'image', src: sc.media.replace(/^\//, '') }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#08080a' }}>
      <TransitionSeries>
        {script.scenes.flatMap((scene, i) => {
          const durFrames = Math.round(scene.dur * FPS);
          const seq = (
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
            </TransitionSeries.Sequence>
          );
          // Hard cut (rubric default): consecutive sequences, no overlap.
          if ((scene.transition ?? 'cut') === 'cut') return [seq];
          return [
            seq,
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
      {audioSrc && (
        <Audio
          src={staticFile(audioSrc)}
          loop
          volume={(f) =>
            musicVol *
            interpolate(f, [0, 15, total - 30, total], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      )}
      {voSrcs?.map((src, i) =>
        src ? (
          <Sequence
            key={`vo${i}`}
            from={starts[i]}
            durationInFrames={Math.round(script.scenes[i].dur * FPS) + TRANSITION}
          >
            <Audio src={staticFile(src)} volume={0.95} />
          </Sequence>
        ) : null
      )}
      <Progress accent={accent} />
    </AbsoluteFill>
  );
};
