import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import AdminPressForm from '@/components/Admin/AdminPressForm';

export default function NewPress() {
  if (!isAdmin()) redirect('/admin');
  return <AdminPressForm mode="create" />;
}
