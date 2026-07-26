import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import data from '../src/data/ugc-scripts.json';

// ---- types (loose — the JSON is the source of truth) --------------------
type Locale = 'en' | 'ru' | 'he';
type L = Record<Locale, string>;
type Scene = { dur: number; media: string; onScreen: L; vo?: { en: string } };
type Script = {
  id: string;
  title: string;
  accent: 'gold' | 'teal' | 'rose';
  audience: string;
  hook: L;
  scenes: Scene[];
  cta: L;
};

const ACCENTS: Record<string, string> = {
  gold: '#dfba74',
  teal: '#6fb7ba',
  rose: '#b4607e',
};

const FONT =
  '"Inter", "Helvetica Neue", "Segoe UI", system-ui, -apple-system, sans-serif';

export const getScript = (id: string): Script =>
  (data.scripts as unknown as Script[]).find((s) => s.id === id) ??
  (data.scripts[0] as unknown as Script);

// ---- one scene ----------------------------------------------------------
const SceneView: React.FC<{
  scene: Scene;
  accent: string;
  locale: Locale;
  index: number;
  isFirst: boolean;
  hook: string;
}> = ({ scene, accent, locale, index, isFirst, hook }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const rtl = locale === 'he';

  // slow Ken-Burns push on the media
  const scale = interpolate(frame, [0, durationInFrames], [1.06, 1.16], {
    extrapolateRight: 'clamp',
  });

  // text rises + fades in
  const enter = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [44, 0]);
  const textOut = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#08080a' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Img
          src={staticFile(scene.media.replace(/^\//, ''))}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* legibility veil */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.25) 38%, rgba(8,8,10,0.92) 100%)',
        }}
      />

      {/* hook (first scene only), top */}
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

      {/* on-screen line, lower third */}
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
          opacity: Math.min(enter, textOut),
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
            textTransform: 'uppercase',
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

// ---- end card -----------------------------------------------------------
const EndCard: React.FC<{ cta: string; accent: string; locale: Locale }> = ({
  cta,
  accent,
  locale,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  const rtl = locale === 'he';
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#08080a',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        direction: rtl ? 'rtl' : 'ltr',
      }}
    >
      <div style={{ opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`, textAlign: 'center', padding: 80 }}>
        <div style={{ color: '#f5f2f0', fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          {cta}
        </div>
        <div style={{ marginTop: 40, display: 'inline-block', height: 6, width: 120, background: accent, borderRadius: 6 }} />
        <div style={{ marginTop: 40, color: 'rgba(245,242,240,0.6)', fontSize: 30, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Mitoderm
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- progress bar -------------------------------------------------------
const Progress: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'rgba(255,255,255,0.12)' }}>
      <div style={{ height: '100%', width: `${w}%`, background: accent }} />
    </div>
  );
};

// ---- composition --------------------------------------------------------
export const Short: React.FC<{ scriptId: string; locale: Locale }> = ({
  scriptId,
  locale,
}) => {
  const { fps } = useVideoConfig();
  const script = getScript(scriptId);
  const accent = ACCENTS[script.accent] ?? ACCENTS.gold;
  const endSec = 2.5;

  let acc = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#08080a' }}>
      {script.scenes.map((scene, i) => {
        const from = Math.round(acc * fps);
        const durationInFrames = Math.round(scene.dur * fps);
        acc += scene.dur;
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <SceneView
              scene={scene}
              accent={accent}
              locale={locale}
              index={i}
              isFirst={i === 0}
              hook={script.hook[locale]}
            />
          </Sequence>
        );
      })}
      <Sequence from={Math.round(acc * fps)} durationInFrames={Math.round(endSec * fps)}>
        <EndCard cta={script.cta[locale]} accent={accent} locale={locale} />
      </Sequence>
      <Progress accent={accent} />
    </AbsoluteFill>
  );
};

export const totalDurationInFrames = (scriptId: string, fps: number): number => {
  const script = getScript(scriptId);
  const scenes = script.scenes.reduce((a, s) => a + s.dur, 0);
  return Math.round((scenes + 2.5) * fps);
};
