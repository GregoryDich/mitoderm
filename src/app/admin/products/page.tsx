import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readProducts } from '@/lib/admin-store';
import AdminDeleteButton from '@/components/Admin/AdminDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  if (!isAdmin()) redirect('/admin');
  const products = await readProducts();

  const usingGithub = !!(
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO
  );

  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: -0.5,
            }}
          >
            Products
          </h1>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 13,
              color: 'rgba(245,242,240,0.55)',
            }}
          >
            {products.length} items · saves write to{' '}
            <strong>{usingGithub ? 'GitHub (repo commit)' : 'local file'}</strong>
          </p>
        </div>
        <Link
          href="/admin/products/new"
          style={{
            padding: '12px 22px',
            borderRadius: 30,
            background: '#dfba74',
            color: '#08080a',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          + New product
        </Link>
      </header>

      <div
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.025)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Th>Name (en)</Th>
              <Th>Slug</Th>
              <Th>Category</Th>
              <Th>Accent</Th>
              <Th>Status</Th>
              <Th style={{ textAlign: 'right' }}>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.slug}
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Td>
                  <Link
                    href={`/admin/products/${p.slug}/edit`}
                    style={{
                      color: '#f5f2f0',
                      fontWeight: 500,
                    }}
                  >
                    {p.content.en?.name ?? p.slug}
                  </Link>
                </Td>
                <Td mono>{p.slug}</Td>
                <Td>{p.category}</Td>
                <Td>
                  <Dot color={accentColor(p.accent)} /> {p.accent}
                </Td>
                <Td>
                  <Dot
                    color={p.status === 'available' ? '#66cc80' : '#cca64d'}
                  />{' '}
                  {p.status === 'available' ? 'Available' : 'Coming soon'}
                </Td>
                <Td style={{ textAlign: 'right' }}>
                  <Link
                    href={`/admin/products/${p.slug}/edit`}
                    style={{
                      marginRight: 10,
                      color: 'rgba(245,242,240,0.8)',
                      fontSize: 13,
                    }}
                  >
                    Edit
                  </Link>
                  <AdminDeleteButton slug={p.slug} name={p.content.en?.name} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '12px 16px',
        fontWeight: 500,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'rgba(245,242,240,0.55)',
        ...style,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  mono,
  style,
}: {
  children: React.ReactNode;
  mono?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        padding: '14px 16px',
        verticalAlign: 'middle',
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined,
        color: 'rgba(245,242,240,0.85)',
        ...style,
      }}
    >
      {children}
    </td>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        marginRight: 6,
        verticalAlign: 'middle',
      }}
    />
  );
}

function accentColor(a: 'teal' | 'gold' | 'rose') {
  return a === 'teal' ? '#6fb7ba' : a === 'gold' ? '#dfba74' : '#b4607e';
}
