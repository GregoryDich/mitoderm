'use client';

import { FC, useMemo, useState } from 'react';
import type { Lead, LeadStatus } from '@/lib/leads-store';

interface Props {
  initialLeads: Lead[];
}

const STATUSES: { key: LeadStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'closed', label: 'Closed' },
  { key: 'archived', label: 'Archived' },
];

const STATUS_COLOR: Record<LeadStatus, string> = {
  new: '#66cc80',
  contacted: '#dfba74',
  closed: '#9aa0a6',
  archived: 'rgba(245,242,240,0.4)',
};

const AdminLeadsTable: FC<Props> = ({ initialLeads }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== 'all' && l.status !== filter) return false;
      if (!term) return true;
      return (
        l.name.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        l.phone.toLowerCase().includes(term) ||
        l.clinic.toLowerCase().includes(term) ||
        l.message.toLowerCase().includes(term)
      );
    });
  }, [leads, filter, q]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    setPendingId(id);
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const { lead } = (await res.json()) as { lead: Lead };
      setLeads((cur) => cur.map((l) => (l.id === id ? lead : l)));
    }
    setPendingId(null);
  };

  const saveNote = async (id: string, note: string) => {
    setPendingId(id);
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    if (res.ok) {
      const { lead } = (await res.json()) as { lead: Lead };
      setLeads((cur) => cur.map((l) => (l.id === id ? lead : l)));
    }
    setPendingId(null);
  };

  const remove = async (id: string) => {
    if (!confirm('Permanently delete this lead?')) return;
    setPendingId(id);
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) setLeads((cur) => cur.filter((l) => l.id !== id));
    setPendingId(null);
  };

  if (leads.length === 0) {
    return (
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
        No leads yet. Submissions from /form and the “Contact for price”
        CTA will land here.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUSES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setFilter(s.key)}
              aria-pressed={filter === s.key}
              style={{
                padding: '8px 14px',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.14)',
                background: filter === s.key ? '#f5f2f0' : 'transparent',
                color: filter === s.key ? '#08080a' : 'rgba(245,242,240,0.78)',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search name / email / clinic / message…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            flex: 1,
            minWidth: 260,
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            color: '#f5f2f0',
            font: 'inherit',
            fontSize: 14,
          }}
        />
      </div>

      <div
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.025)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Th style={{ width: 130 }}>Received</Th>
              <Th>Contact</Th>
              <Th>Clinic</Th>
              <Th>Message</Th>
              <Th style={{ width: 130 }}>Status</Th>
              <Th style={{ width: 80, textAlign: 'right' }}>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {visible.map((l) => {
              const open = openId === l.id;
              return (
                <>
                  <tr
                    key={l.id}
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setOpenId(open ? null : l.id)}
                  >
                    <Td>{new Date(l.ts).toLocaleString('en-IL')}</Td>
                    <Td>
                      <div style={{ fontWeight: 500 }}>{l.name || '—'}</div>
                      <div
                        style={{
                          fontSize: 12,
                          color: 'rgba(245,242,240,0.6)',
                        }}
                      >
                        {l.email}
                        {l.phone ? ` · ${l.phone}` : ''}
                      </div>
                    </Td>
                    <Td>{l.clinic || '—'}</Td>
                    <Td
                      style={{
                        maxWidth: 320,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {l.message}
                    </Td>
                    <Td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: STATUS_COLOR[l.status],
                          }}
                        />
                        {l.status}
                      </span>
                    </Td>
                    <Td style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          color: 'rgba(245,242,240,0.6)',
                          fontSize: 12,
                        }}
                      >
                        {open ? 'Hide ↑' : 'Open ↓'}
                      </span>
                    </Td>
                  </tr>
                  {open && (
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <td colSpan={6} style={{ padding: '16px 18px' }}>
                        <LeadDetail
                          lead={l}
                          pending={pendingId === l.id}
                          onStatus={(s) => updateStatus(l.id, s)}
                          onNote={(n) => saveNote(l.id, n)}
                          onDelete={() => remove(l.id)}
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function Th({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '12px 16px',
        fontWeight: 500,
        fontSize: 11,
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
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        padding: '12px 16px',
        verticalAlign: 'top',
        color: 'rgba(245,242,240,0.85)',
        ...style,
      }}
    >
      {children}
    </td>
  );
}

function LeadDetail({
  lead,
  pending,
  onStatus,
  onNote,
  onDelete,
}: {
  lead: Lead;
  pending: boolean;
  onStatus: (s: LeadStatus) => void;
  onNote: (n: string) => void;
  onDelete: () => void;
}) {
  const [note, setNote] = useState(lead.note ?? '');
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 24,
        alignItems: 'start',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'rgba(245,242,240,0.5)',
            }}
          >
            Message
          </span>
          <p
            style={{
              margin: '4px 0 0',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5,
            }}
          >
            {lead.message}
          </p>
        </div>
        <div>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'rgba(245,242,240,0.5)',
            }}
          >
            Internal note
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Private operator note — visible only here."
            style={{
              width: '100%',
              marginTop: 4,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              color: '#f5f2f0',
              font: 'inherit',
              fontSize: 14,
              resize: 'vertical',
            }}
          />
          <button
            type="button"
            onClick={() => onNote(note)}
            disabled={pending}
            style={{
              marginTop: 8,
              padding: '6px 14px',
              borderRadius: 16,
              background: 'transparent',
              border: '1px solid rgba(245,242,240,0.25)',
              color: 'rgba(245,242,240,0.85)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {pending ? '…' : 'Save note'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            padding: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <Row label="Email">
            <a
              href={`mailto:${lead.email}`}
              style={{ color: '#dfba74' }}
            >
              {lead.email}
            </a>
          </Row>
          {lead.phone && (
            <Row label="Phone">
              <a
                href={`tel:${lead.phone.replace(/[^+\d]/g, '')}`}
                style={{ color: '#dfba74' }}
              >
                {lead.phone}
              </a>
              {' · '}
              <a
                href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#dfba74' }}
              >
                WhatsApp
              </a>
            </Row>
          )}
          {lead.clinic && <Row label="Clinic">{lead.clinic}</Row>}
          <Row label="ID">
            <code style={{ fontSize: 11 }}>{lead.id}</code>
          </Row>
          {lead.updatedAt && (
            <Row label="Updated">
              {new Date(lead.updatedAt).toLocaleString('en-IL')}
            </Row>
          )}
        </div>

        <div>
          <span
            style={{
              fontSize: 11,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'rgba(245,242,240,0.5)',
            }}
          >
            Set status
          </span>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginTop: 6,
            }}
          >
            {(['new', 'contacted', 'closed', 'archived'] as LeadStatus[]).map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  disabled={pending || lead.status === s}
                  onClick={() => onStatus(s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 16,
                    border:
                      lead.status === s
                        ? '1px solid #dfba74'
                        : '1px solid rgba(245,242,240,0.2)',
                    background:
                      lead.status === s
                        ? 'rgba(223,186,116,0.12)'
                        : 'transparent',
                    color: 'rgba(245,242,240,0.85)',
                    fontSize: 12,
                    cursor: pending || lead.status === s ? 'default' : 'pointer',
                  }}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          style={{
            alignSelf: 'flex-start',
            padding: '6px 12px',
            borderRadius: 16,
            background: 'transparent',
            border: '1px solid rgba(217,142,160,0.45)',
            color: '#d98ea0',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '70px 1fr',
        gap: 8,
        padding: '4px 0',
      }}
    >
      <span style={{ color: 'rgba(245,242,240,0.5)' }}>{label}</span>
      <span>{children}</span>
    </div>
  );
}

export default AdminLeadsTable;
