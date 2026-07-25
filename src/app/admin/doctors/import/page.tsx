import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import AdminDoctorImport from '@/components/Admin/AdminDoctorImport';

export const dynamic = 'force-dynamic';

export default function ImportDoctorsPage() {
  if (!isAdmin()) redirect('/admin');
  return (
    <div>
      <header style={{ marginBottom: 24 }}>
        <Link
          href="/admin/doctors"
          style={{ fontSize: 13, color: 'rgba(245,242,240,0.55)' }}
        >
          ← Family
        </Link>
        <h1
          style={{
            margin: '10px 0 4px',
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: -0.5,
          }}
        >
          Import specialists
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(245,242,240,0.55)' }}>
          Bulk-add from a CSV — ids are assigned automatically and duplicates
          are skipped, so it’s safe to re-run.
        </p>
      </header>
      <AdminDoctorImport />
    </div>
  );
}
