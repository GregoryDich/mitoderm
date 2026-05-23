import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readStories, isLive } from '@/lib/stories-store';
import AdminStoryDeleteButton from '@/components/Admin/AdminStoryDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminStories() {
  if (!isAdmin()) redirect('/admin');
  const stories = await readStories();
  stories.sort((a, b) => a.order - b.order);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24,
          gap: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, letterSpacing: -0.5 }}>
            Stories
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(245,242,240,0.55)' }}>
            {stories.length} story(s). IG-style timed slideshows that appear
            at the top of the homepage. Each story has a circular cover, an
            optional publish/expire window, and an ordered set of slides.
            5 seconds per slide; the visitor can tap to navigate.
          </p>
        </div>
        <Link
          href="/admin/stories/new"
          style={{
            padding: '12px 22px',
            borderRadius: 30,
            background: '#dfba74',
            color: '#08080a',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          + New story
        </Link>
      </header>

      {stories.length === 0 ? (
        <div
          style={{
            padding: 28,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            color: 'rgba(245,242,240,0.6)',
            fontSize: 14,
          }}
        >
          No stories yet. Create the first one — once published, a row of
          IG-style circles will appear above the featured products on the
          homepage.
        </div>
      ) : (
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.025)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Th style={{ width: 64 }}>Cover</Th>
                <Th>Title</Th>
                <Th style={{ width: 90 }}>Slides</Th>
                <Th style={{ width: 220 }}>Schedule</Th>
                <Th style={{ width: 80 }}>Order</Th>
                <Th style={{ width: 110 }}>Status</Th>
                <Th style={{ width: 130, textAlign: 'right' }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => {
                const live = isLive(s, today);
                const stateColor = !s.isPublished
                  ? '#9aa0a6'
                  : live
                  ? '#66cc80'
                  : '#cca64d';
                const stateLabel = !s.isPublished
                  ? 'Draft'
                  : live
                  ? 'Live'
                  : s.publishAt && s.publishAt > today
                  ? 'Scheduled'
                  : 'Expired';
                return (
                  <tr
                    key={s.id}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Td>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {s.cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={s.cover}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : null}
                      </span>
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/stories/${s.id}/edit`}
                        style={{ color: '#f5f2f0', fontWeight: 500 }}
                      >
                        {s.title}
                      </Link>
                    </Td>
                    <Td>{s.slides.length}</Td>
                    <Td style={{ color: 'rgba(245,242,240,0.7)', fontSize: 12 }}>
                      {s.publishAt ? `from ${s.publishAt}` : '—'}
                      {s.expireAt ? ` · to ${s.expireAt}` : ''}
                    </Td>
                    <Td style={{ fontVariantNumeric: 'tabular-nums' }}>{s.order}</Td>
                    <Td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: stateColor,
                          }}
                        />
                        {stateLabel}
                      </span>
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/admin/stories/${s.id}/edit`}
                        style={{
                          marginRight: 10,
                          color: 'rgba(245,242,240,0.8)',
                          fontSize: 13,
                        }}
                      >
                        Edit
                      </Link>
                      <AdminStoryDeleteButton id={s.id} title={s.title} />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '12px 16px',
        fontWeight: 500,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'rgba(245,242,240,0.55)',
        ...style,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td
      style={{
        padding: '14px 16px',
        verticalAlign: 'middle',
        color: 'rgba(245,242,240,0.85)',
        ...style,
      }}
    >
      {children}
    </td>
  );
}
