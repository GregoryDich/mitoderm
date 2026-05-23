'use client';

import { FC, useMemo, useState } from 'react';
import type { ClinicAccount, ClinicStatus } from '@/lib/clinics-store';

interface Props {
  initial: ClinicAccount[];
}

const STATUS_COLOR: Record<ClinicStatus, string> = {
  pending: '#cca64d',
  approved: '#66cc80',
  rejected: '#d98ea0',
};

const AdminApplicationsTable: FC<Props> = ({ initial }) => {
  const [clinics, setClinics] = useState<ClinicAccount[]>(initial);
  const [filter, setFilter] = useState<ClinicStatus | 'all'>('all');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? clinics : clinics.filter((c) => c.status === filter)),
    [clinics, filter]
  );

  const act = async (id: string, action: string) => {
    setPendingId(id);
    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      const { clinic } = (await res.json()) as { clinic: ClinicAccount };
      setClinics((cur) => cur.map((c) => (c.id === id ? clinic : c)));
    }
    setPendingId(null);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this application? This cannot be undone.')) return;
    setPendingId(id);
    const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) setClinics((cur) => cur.filter((c) => c.id !== id));
    setPendingId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.14)',
              background: filter === k ? '#f5f2f0' : 'transparent',
              color: filter === k ? '#08080a' : 'rgba(245,242,240,0.78)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {k}
          </button>
        ))}
      </div>

      <div
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.025)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Th style={{ width: 110 }}>Applied</Th>
              <Th>Clinic</Th>
              <Th>Contact</Th>
              <Th style={{ width: 110 }}>Status</Th>
              <Th style={{ width: 280, textAlign: 'right' }}>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => {
              const open = openId === c.id;
              const loginUrl =
                c.token != null
                  ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/pro/login?token=${encodeURIComponent(c.token)}`
                  : null;
              const busy = pendingId === c.id;
              return (
                <>
                  <tr
                    key={c.id}
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setOpenId(open ? null : c.id)}
                  >
                    <Td>{c.appliedAt.slice(0, 10)}</Td>
                    <Td>
                      <strong>{c.clinic}</strong>
                      <div style={{ fontSize: 12, color: 'rgba(245,242,240,0.55)' }}>
                        {c.name}
                        {c.city ? ` · ${c.city}` : ''}
                        {c.license ? ` · #${c.license}` : ''}
                      </div>
                    </Td>
                    <Td>
                      {c.email}
                      {c.phone && (
                        <div style={{ fontSize: 12, color: 'rgba(245,242,240,0.55)' }}>
                          {c.phone}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: STATUS_COLOR[c.status],
                          }}
                        />
                        {c.status}
                      </span>
                    </Td>
                    <Td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      {c.status === 'pending' && (
                        <>
                          <ActionBtn
                            label="Approve"
                            color="#66cc80"
                            disabled={busy}
                            onClick={() => act(c.id, 'approve')}
                          />{' '}
                          <ActionBtn
                            label="Reject"
                            color="#d98ea0"
                            disabled={busy}
                            onClick={() => act(c.id, 'reject')}
                          />
                        </>
                      )}
                      {c.status === 'approved' && (
                        <>
                          <ActionBtn
                            label="Regen token"
                            color="rgba(245,242,240,0.6)"
                            disabled={busy}
                            onClick={() => act(c.id, 'regenerate')}
                          />{' '}
                          <ActionBtn
                            label="Reject"
                            color="#d98ea0"
                            disabled={busy}
                            onClick={() => act(c.id, 'reject')}
                          />
                        </>
                      )}
                      {c.status === 'rejected' && (
                        <ActionBtn
                          label="Approve"
                          color="#66cc80"
                          disabled={busy}
                          onClick={() => act(c.id, 'approve')}
                        />
                      )}
                      <ActionBtn
                        label="Delete"
                        color="#d98ea0"
                        disabled={busy}
                        onClick={() => remove(c.id)}
                      />
                    </Td>
                  </tr>
                  {open && (
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <Td colSpan={5} style={{ padding: 20 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                          <div>
                            <h4 style={detailH4}>Application detail</h4>
                            {c.instagram && (
                              <p style={detailP}>
                                Instagram: <code>{c.instagram}</code>
                              </p>
                            )}
                            {c.message && (
                              <p style={{ ...detailP, whiteSpace: 'pre-wrap', marginTop: 10 }}>
                                {c.message}
                              </p>
                            )}
                            {c.note && (
                              <p style={{ ...detailP, color: '#dfba74', marginTop: 10 }}>
                                Note: {c.note}
                              </p>
                            )}
                            {c.reviewedAt && (
                              <p style={{ ...detailP, color: 'rgba(245,242,240,0.5)', marginTop: 10 }}>
                                Reviewed {c.reviewedAt.slice(0, 10)}
                                {c.lastLoginAt && ` · last login ${c.lastLoginAt.slice(0, 16)}`}
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 style={detailH4}>Magic-link login</h4>
                            {c.status === 'approved' && loginUrl ? (
                              <>
                                <p style={detailP}>
                                  Send this URL to the clinic via WhatsApp / email —
                                  one click signs them into <code>/pro</code> for 90 days.
                                </p>
                                <input
                                  readOnly
                                  value={loginUrl}
                                  onFocus={(e) => e.currentTarget.select()}
                                  style={{
                                    width: '100%',
                                    marginTop: 10,
                                    padding: '10px 12px',
                                    borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.14)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#f5f2f0',
                                    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                                    fontSize: 12,
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    void navigator.clipboard.writeText(loginUrl);
                                  }}
                                  style={{
                                    marginTop: 10,
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.14)',
                                    color: '#f5f2f0',
                                    fontSize: 12.5,
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                  }}
                                >
                                  Copy to clipboard
                                </button>
                              </>
                            ) : (
                              <p style={detailP}>
                                Available after approval.
                              </p>
                            )}
                          </div>
                        </div>
                      </Td>
                    </tr>
                  )}
                </>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <Td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'rgba(245,242,240,0.5)' }}>
                  No applications in this filter.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function ActionBtn({
  label,
  color,
  onClick,
  disabled,
}: {
  label: string;
  color: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 12px',
        borderRadius: 8,
        background: 'transparent',
        border: `1px solid ${color}66`,
        color,
        fontSize: 12,
        cursor: disabled ? 'progress' : 'pointer',
        marginInlineStart: 6,
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
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

function Td({
  children,
  style,
  colSpan,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  colSpan?: number;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <td
      colSpan={colSpan}
      onClick={onClick}
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

const detailH4: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: 11,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'rgba(245,242,240,0.55)',
  fontWeight: 600,
};

const detailP: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: 'rgba(245,242,240,0.85)',
  lineHeight: 1.55,
};

export default AdminApplicationsTable;
