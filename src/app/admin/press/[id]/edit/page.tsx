import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { getPress } from '@/lib/press-store';
import AdminPressForm from '@/components/Admin/AdminPressForm';

export const dynamic = 'force-dynamic';

export default async function EditPress({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdmin()) redirect('/admin');
  const item = await getPress(params.id);
  if (!item) notFound();
  return <AdminPressForm mode="edit" initial={item} />;
}
