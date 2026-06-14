import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import AdminSocialForm from '@/components/Admin/AdminSocialForm';

export default function NewSocial() {
  if (!isAdmin()) redirect('/admin');
  return <AdminSocialForm mode="create" />;
}
