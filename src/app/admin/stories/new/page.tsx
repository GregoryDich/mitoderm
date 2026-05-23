import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import AdminStoryForm from '@/components/Admin/AdminStoryForm';

export default function NewStory() {
  if (!isAdmin()) redirect('/admin');
  return <AdminStoryForm mode="create" />;
}
