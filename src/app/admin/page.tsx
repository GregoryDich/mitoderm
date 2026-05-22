import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import AdminLogin from '@/components/Admin/AdminLogin';

export default function AdminEntry() {
  if (isAdmin()) {
    redirect('/admin/products');
  }
  return <AdminLogin />;
}
