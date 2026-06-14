import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readProducts } from '@/lib/admin-store';
import AdminProductForm from '@/components/Admin/AdminProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  if (!isAdmin()) redirect('/admin');
  const all = await readProducts();
  const product = all.find((p) => p.slug === slug);
  if (!product) notFound();
  return <AdminProductForm mode="edit" initial={product} />;
}
