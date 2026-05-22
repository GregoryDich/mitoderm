'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  slug: string;
  name?: string;
}

const AdminDeleteButton: FC<Props> = ({ slug, name }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (
      !confirm(
        `Delete product "${name ?? slug}"? This will commit the removal and cannot be undone from the UI.`
      )
    ) {
      return;
    }
    setPending(true);
    const res = await fetch(`/api/admin/products/${slug}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      alert(`Delete failed: ${data.error ?? res.status}`);
      setPending(false);
      return;
    }
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      style={{
        background: 'transparent',
        border: '1px solid rgba(217,142,160,0.45)',
        color: '#d98ea0',
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 12,
        cursor: pending ? 'progress' : 'pointer',
      }}
    >
      {pending ? '…' : 'Delete'}
    </button>
  );
};

export default AdminDeleteButton;
