import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readClinics } from '@/lib/clinics-store';
import AdminApplicationsTable from '@/components/Admin/AdminApplicationsTable';

export const dynamic = 'force-dynamic';

export default async function AdminApplications() {
  if (!isAdmin()) redirect('/admin');
  const clinics = await readClinics();
  clinics.sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));

  const counts = {
    pending: clinics.filter((c) => c.status === 'pending').length,
    approved: clinics.filter((c) => c.status === 'approved').length,
    rejected: clinics.filter((c) => c.status === 'rejected').length,
  };

  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, letterSpacing: -0.5 }}>
            /pro applications
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(245,242,240,0.55)' }}>
            {counts.pending} pending · {counts.approved} approved · {counts.rejected} rejected.
            Approve grants the clinic a magic-link login to the /pro portal.
          </p>
        </div>
        <a
          href="/api/admin/export/clinics"
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
      </header>
      <AdminApplicationsTable initial={clinics} />
    </div>
  );
}
