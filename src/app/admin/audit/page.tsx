import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readAudit } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const TONE: Record<string, string> = {
  'product.create': '#6fb7ba',
  'product.update': '#dfba74',
  'product.delete': '#b4607e',
  'product.duplicate': '#6fb7ba',
  'doctor.create': '#6fb7ba',
  'doctor.update': '#dfba74',
  'doctor.delete': '#b4607e',
  'lead.update': '#dfba74',
  'lead.delete': '#b4607e',
  'asset.upload': '#6fb7ba',
  'auth.login': '#aaa',
  'auth.logout': '#aaa',
};

function fmt(at: string) {
  try {
    const d = new Date(at);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return at;
  }
}

export default async function AdminAudit() {
  if (!isAdmin()) redirect('/admin');
  const entries = await readAudit(500);

  return (
    <div>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, letterSpacing: -0.5 }}>
          Audit
        </h1>
        <p
          style={{
            margin: '6px 0 0',
            fontSize: 13,
            color: 'rgba(245,242,240,0.55)',
          }}
        >
          {entries.length} most recent admin write(s). Newest first. Stored
          locally at <code>data/audit.jsonl</code>; not committed.
        </p>
      </header>

      {entries.length === 0 ? (
        <p style={{ color: 'rgba(245,242,240,0.55)', fontSize: 14 }}>
          No audit entries yet.
        </p>
      ) : (
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(245,242,240,0.55)',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>When</th>
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>Action</th>
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>Target</th>
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>IP</th>
                <th style={{ padding: '10px 14px', fontWeight: 500 }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={`${e.at}-${i}`}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap', color: 'rgba(245,242,240,0.7)' }}>
                    {fmt(e.at)}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${TONE[e.action] || '#666'}33`,
                        color: TONE[e.action] || '#ddd',
                        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                        fontSize: 12,
                      }}
                    >
                      {e.action}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '10px 14px',
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                      fontSize: 12,
                      color: 'rgba(245,242,240,0.85)',
                    }}
                  >
                    {e.target || '—'}
                  </td>
                  <td
                    style={{
                      padding: '10px 14px',
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                      fontSize: 12,
                      color: 'rgba(245,242,240,0.55)',
                    }}
                  >
                    {e.ip || '—'}
                  </td>
                  <td
                    style={{
                      padding: '10px 14px',
                      color: 'rgba(245,242,240,0.55)',
                      fontSize: 12,
                    }}
                  >
                    {e.meta ? JSON.stringify(e.meta) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
