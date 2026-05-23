import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readSocial } from '@/lib/social-store';
import AdminSocialDeleteButton from '@/components/Admin/AdminSocialDeleteButton';

export const dynamic = 'force-dynamic';

const KIND_LABEL: Record<string, string> = {
  reel: 'Reel',
  post: 'Post',
  seminar: 'Seminar',
};

const KIND_COLOR: Record<string, string> = {
  reel: '#6fb7ba',
  post: '#dfba74',
  seminar: '#b4607e',
};

export default async function AdminSocial() {
  if (!isAdmin()) redirect('/admin');
  const all = await readSocial();
  // Drafts first (so newly-ingested items from n8n surface immediately),
  // then by order, then newest createdAt.
  const posts = [...all].sort((a, b) => {
    if (a.isPublished !== b.isPublished) return a.isPublished ? 1 : -1;
    return a.order - b.order || b.createdAt.localeCompare(a.createdAt);
  });
  const draftCount = all.filter((p) => !p.isPublished).length;

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
            Social
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(245,242,240,0.55)' }}>
            {posts.length} item(s){draftCount > 0 ? ` · ` : ''}
            {draftCount > 0 && (
              <strong style={{ color: '#dfba74' }}>
                {draftCount} draft{draftCount > 1 ? 's' : ''} awaiting review
              </strong>
            )}
            . Published items surface on the homepage social strip;{' '}
            <strong>seminar</strong>-kind entries also appear at /seminars.
            Drafts arrive automatically from n8n if the ingest endpoint is
            wired (<code>SOCIAL_INGEST_TOKEN</code> in env).
          </p>
        </div>
        <Link
          href="/admin/social/new"
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
          + New item
        </Link>
      </header>

      {posts.length === 0 ? (
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
          No items yet. Add the first Instagram URL — the homepage strip will
          render automatically once at least one item is published.
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
                <Th style={{ width: 90 }}>Poster</Th>
                <Th>Caption</Th>
                <Th style={{ width: 110 }}>Kind</Th>
                <Th style={{ width: 110 }}>Date</Th>
                <Th style={{ width: 80 }}>Order</Th>
                <Th style={{ width: 110 }}>Published</Th>
                <Th style={{ width: 130, textAlign: 'right' }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Td>
                    <span
                      style={{
                        display: 'inline-flex',
                        width: 56,
                        height: 72,
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {p.poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.poster}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ color: 'rgba(245,242,240,0.3)' }}>—</span>
                      )}
                    </span>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/social/${p.id}/edit`}
                      style={{ color: '#f5f2f0', fontWeight: 500 }}
                    >
                      {p.caption || <span style={{ opacity: 0.5 }}>(no caption)</span>}
                    </Link>
                    <div style={{ marginTop: 4 }}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'rgba(245,242,240,0.5)', fontSize: 12 }}
                      >
                        {p.url.replace(/^https:\/\/(www\.)?instagram\.com\//, 'instagram.com/')}
                      </a>
                    </div>
                  </Td>
                  <Td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${KIND_COLOR[p.kind]}55`,
                        color: KIND_COLOR[p.kind],
                        fontSize: 12,
                      }}
                    >
                      {KIND_LABEL[p.kind]}
                    </span>
                  </Td>
                  <Td>{p.date || <span style={{ opacity: 0.4 }}>—</span>}</Td>
                  <Td style={{ fontVariantNumeric: 'tabular-nums' }}>{p.order}</Td>
                  <Td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: p.isPublished ? '#66cc80' : '#9aa0a6',
                        }}
                      />
                      {p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    <Link
                      href={`/admin/social/${p.id}/edit`}
                      style={{
                        marginRight: 10,
                        color: 'rgba(245,242,240,0.8)',
                        fontSize: 13,
                      }}
                    >
                      Edit
                    </Link>
                    <AdminSocialDeleteButton id={p.id} />
                  </Td>
                </tr>
              ))}
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
