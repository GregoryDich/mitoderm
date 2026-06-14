import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import AdminProductForm from '@/components/Admin/AdminProductForm';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  if (!isAdmin()) redirect('/admin');
  return <AdminProductForm mode="create" />;
}
