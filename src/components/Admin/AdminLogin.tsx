'use client';

import { FC, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminLogin: FC = () => {
  const router = useRouter();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    setPending(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setErr(
          data.error === 'not_configured'
            ? 'ADMIN_PASSWORD env is not set on the server.'
            : 'Wrong password.'
        );
        setPending(false);
        return;
      }
      router.replace('/admin/products');
      router.refresh();
    } catch {
      setErr('Network error. Try again.');
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 360,
        margin: '14vh auto 0',
        padding: 28,
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <h1 style={{ margin: 0, fontWeight: 300, fontSize: 24 }}>
        Sign in to Mitoderm admin
      </h1>
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 12,
          letterSpacing: 1,
          color: 'rgba(245,242,240,0.7)',
        }}
      >
        Password
        <input
          type="password"
          autoComplete="current-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
          style={{
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            color: '#f5f2f0',
            font: 'inherit',
            fontSize: 15,
          }}
        />
      </label>
      {err && (
        <p style={{ margin: 0, color: '#d98ea0', fontSize: 13 }}>{err}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '12px 20px',
          borderRadius: 30,
          background: '#f5f2f0',
          color: '#08080a',
          border: 'none',
          font: 'inherit',
          fontWeight: 500,
          cursor: pending ? 'progress' : 'pointer',
        }}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
};

export default AdminLogin;
