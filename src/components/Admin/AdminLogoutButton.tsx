'use client';

import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

const AdminLogoutButton: FC = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch('/api/admin/logout', { method: 'POST' });
        router.replace('/admin');
        router.refresh();
      }}
      style={{
        padding: '8px 14px',
        borderRadius: 8,
        background: 'transparent',
        border: '1px solid rgba(245,242,240,0.2)',
        color: 'rgba(245,242,240,0.78)',
        fontSize: 13,
        cursor: pending ? 'progress' : 'pointer',
      }}
    >
      {pending ? '…' : 'Sign out'}
    </button>
  );
};

export default AdminLogoutButton;
