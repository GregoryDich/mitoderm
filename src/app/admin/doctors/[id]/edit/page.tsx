import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { getDoctor } from '@/lib/doctors-store';
import AdminDoctorForm from '@/components/Admin/AdminDoctorForm';

export const dynamic = 'force-dynamic';

export default async function EditDoctorPage({
  params: { id },
}: {
  params: { id: string };
}) {
  if (!isAdmin()) redirect('/admin');
  const doctor = await getDoctor(id);
  if (!doctor) notFound();
  return <AdminDoctorForm mode="edit" initial={doctor} />;
}
