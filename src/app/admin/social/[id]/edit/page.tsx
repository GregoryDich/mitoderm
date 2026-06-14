import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { getSocial } from '@/lib/social-store';
import AdminSocialForm from '@/components/Admin/AdminSocialForm';

export const dynamic = 'force-dynamic';

export default async function EditSocial({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdmin()) redirect('/admin');
  const post = await getSocial(params.id);
  if (!post) notFound();
  return <AdminSocialForm mode="edit" initial={post} />;
}
