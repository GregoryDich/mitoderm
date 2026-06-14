import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readPress } from '@/lib/press-store';
import AdminPressDeleteButton from '@/components/Admin/AdminPressDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminPress() {
  if (!isAdmin()) redirect('/admin');
  const items = await readPress();
  items.sort((a, b) => a.order - b.order);

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
            Press / awards
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(245,242,240,0.55)' }}>
            {items.length} item(s). Published items appear in the
            &quot;As seen at&quot; strip on the homepage. Transparent PNG or
            SVG logos work best.
          </p>
        </div>
        <Link
          href="/admin/press/new"
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

      {items.length === 0 ? (
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
          No items yet. Add conferences (IMCAS, AMWC…), publications, awards —
          anything that earns instant trust on the homepage.
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
                <Th style={{ width: 110 }}>Logo</Th>
                <Th>Name</Th>
                <Th>URL</Th>
                <Th style={{ width: 80 }}>Order</Th>
                <Th style={{ width: 110 }}>Published</Th>
                <Th style={{ width: 130, textAlign: 'right' }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr
                  key={p.id}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Td>
                    <span
                      style={{
                        display: 'inline-flex',
                        height: 36,
                        padding: '0 8px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 6,
                        alignItems: 'center',
                      }}
                    >
                      {p.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.logo}
                          alt=""
                          style={{
                            height: 24,
                            width: 'auto',
                            filter: 'brightness(0) invert(1)',
                            opacity: 0.85,
                          }}
                        />
                      ) : (
                        <span style={{ color: 'rgba(245,242,240,0.3)' }}>—</span>
                      )}
                    </span>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/press/${p.id}/edit`}
                      style={{ color: '#f5f2f0', fontWeight: 500 }}
                    >
                      {p.name}
                    </Link>
                  </Td>
                  <Td style={{ color: 'rgba(245,242,240,0.55)', fontSize: 12 }}>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noreferrer">
                        {p.url.replace(/^https?:\/\//, '').slice(0, 32)}
                      </a>
                    ) : (
                      '—'
                    )}
                  </Td>
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
                      href={`/admin/press/${p.id}/edit`}
                      style={{
                        marginRight: 10,
                        color: 'rgba(245,242,240,0.8)',
                        fontSize: 13,
                      }}
                    >
                      Edit
                    </Link>
                    <AdminPressDeleteButton id={p.id} name={p.name} />
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
