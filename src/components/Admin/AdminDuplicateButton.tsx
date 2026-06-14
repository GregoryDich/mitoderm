'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  slug: string;
}

const AdminDuplicateButton: FC<Props> = ({ slug }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    setPending(true);
    const res = await fetch(`/api/admin/products/${slug}/duplicate`, {
      method: 'POST',
    });
    const data = (await res.json().catch(() => ({}))) as {
      product?: { slug: string };
      error?: string;
    };
    if (!res.ok || !data.product) {
      alert(`Duplicate failed: ${data.error ?? res.status}`);
      setPending(false);
      return;
    }
    router.push(`/admin/products/${data.product.slug}/edit`);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      style={{
        background: 'transparent',
        border: '1px solid rgba(245,242,240,0.2)',
        color: 'rgba(245,242,240,0.8)',
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 12,
        marginInlineEnd: 8,
        cursor: pending ? 'progress' : 'pointer',
      }}
    >
      {pending ? '…' : 'Duplicate'}
    </button>
  );
};

export default AdminDuplicateButton;
