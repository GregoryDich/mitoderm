import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import AdminDoctorForm from '@/components/Admin/AdminDoctorForm';

export const dynamic = 'force-dynamic';

export default function NewDoctorPage() {
  if (!isAdmin()) redirect('/admin');
  return <AdminDoctorForm mode="create" />;
}
