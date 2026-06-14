import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readLeads } from '@/lib/leads-store';
import AdminLeadsTable from '@/components/Admin/AdminLeadsTable';

export const dynamic = 'force-dynamic';

export default async function AdminLeads() {
  if (!isAdmin()) redirect('/admin');
  const leads = await readLeads();
  leads.sort((a, b) => (b.ts > a.ts ? 1 : -1));

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    closed: leads.filter((l) => l.status === 'closed').length,
    archived: leads.filter((l) => l.status === 'archived').length,
  };

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
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: -0.5,
            }}
          >
            Leads
          </h1>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 13,
              color: 'rgba(245,242,240,0.55)',
            }}
          >
            {counts.all} total — {counts.new} new · {counts.contacted}{' '}
            contacted · {counts.closed} closed · {counts.archived} archived.
            Submissions land here from <code>/form</code> and on every
            product-page enquiry.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href="/api/admin/export/leads"
            style={{
              padding: '10px 18px',
              borderRadius: 30,
              background: '#dfba74',
              color: '#08080a',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Export CSV
          </a>
          <a
            href="/api/admin/leads"
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '10px 18px',
              borderRadius: 30,
              border: '1px solid rgba(245,242,240,0.2)',
              color: 'rgba(245,242,240,0.85)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            JSON
          </a>
        </div>
      </header>

      <AdminLeadsTable initialLeads={leads} />
    </div>
  );
}
