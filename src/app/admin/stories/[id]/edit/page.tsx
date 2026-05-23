import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { getStory } from '@/lib/stories-store';
import AdminStoryForm from '@/components/Admin/AdminStoryForm';

export const dynamic = 'force-dynamic';

export default async function EditStory({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdmin()) redirect('/admin');
  const story = await getStory(params.id);
  if (!story) notFound();
  return <AdminStoryForm mode="edit" initial={story} />;
}
