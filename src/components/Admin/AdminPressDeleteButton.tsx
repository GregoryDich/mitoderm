'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
  name?: string;
}

const AdminPressDeleteButton: FC<Props> = ({ id, name }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (!confirm(`Delete press item${name ? ` "${name}"` : ''}?`)) return;
    setPending(true);
    const res = await fetch(`/api/admin/press/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) router.refresh();
    setPending(false);
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

export default AdminPressDeleteButton;
