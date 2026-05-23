import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

const ACCENTS: Record<string, string> = {
  teal: '#6fb7ba',
  gold: '#dfba74',
  rose: '#b4607e',
};

/** Edge-rendered Open Graph image. Query params:
 *  - title (required)       — main heading, ≤ 80 chars
 *  - eyebrow (optional)     — small label above the title
 *  - tagline (optional)     — secondary line under the title
 *  - accent (optional)      — teal | gold | rose, default gold
 *  - locale (optional)      — en | ru | he, sets dir
 *
 *  Default size 1200×630 — Twitter / Facebook / LinkedIn safe. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Mitoderm').slice(0, 100);
  const eyebrow = (searchParams.get('eyebrow') || '').slice(0, 40);
  const tagline = (searchParams.get('tagline') || '').slice(0, 120);
  const accentKey = searchParams.get('accent') || 'gold';
  const accent = ACCENTS[accentKey] || ACCENTS.gold;
  const locale = searchParams.get('locale') || 'en';
  const isRtl = locale === 'he';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background: '#08080a',
          color: '#f5f2f0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            [isRtl ? 'left' : 'right']: -180,
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: accent,
            opacity: 0.18,
            filter: 'blur(180px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            [isRtl ? 'right' : 'left']: -180,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: accent,
            opacity: 0.12,
            filter: 'blur(160px)',
            display: 'flex',
          }}
        />

        {/* top — brand line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 22,
            letterSpacing: 6,
            color: 'rgba(245, 242, 240, 0.6)',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: accent,
              display: 'flex',
            }}
          />
          <span>MITODERM</span>
        </div>

        {/* middle — content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            maxWidth: '88%',
          }}
        >
          {eyebrow ? (
            <div
              style={{
                fontSize: 22,
                letterSpacing: 4,
                color: accent,
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 50 ? 64 : 80,
              lineHeight: 1.06,
              fontWeight: 500,
              letterSpacing: -1,
              color: '#f5f2f0',
              display: 'flex',
            }}
          >
            {title}
          </div>
          {tagline ? (
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.35,
                color: 'rgba(245, 242, 240, 0.7)',
                display: 'flex',
                maxWidth: 880,
                fontWeight: 400,
              }}
            >
              {tagline}
            </div>
          ) : null}
        </div>

        {/* bottom — meta strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 20,
            color: 'rgba(245, 242, 240, 0.55)',
          }}
        >
          <div style={{ display: 'flex' }}>mitoderm.com</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 18,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: 'rgba(245, 242, 240, 0.45)',
            }}
          >
            <div
              style={{
                width: 24,
                height: 1,
                background: 'rgba(245, 242, 240, 0.45)',
                display: 'flex',
              }}
            />
            <span>Professional exosome skincare</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Aggressive caching — these images are determined by query string.
        'cache-control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
