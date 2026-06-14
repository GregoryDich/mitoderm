'use client';

import { FC } from 'react';
import { useLocale } from 'next-intl';

const ProLogoutButton: FC<{ label: string }> = ({ label }) => {
  const locale = useLocale();
  return (
    <form action={`/api/pro/logout?lang=${locale}`} method="POST">
      <button
        type="submit"
        style={{
          padding: '8px 18px',
          borderRadius: 24,
          background: 'transparent',
          border: '1px solid rgba(245,242,240,0.2)',
          color: 'rgba(245,242,240,0.8)',
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {label}
      </button>
    </form>
  );
};

export default ProLogoutButton;
