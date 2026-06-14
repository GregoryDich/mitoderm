import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { readDoctors } from '@/lib/doctors-store';
import AdminDoctorDeleteButton from '@/components/Admin/AdminDoctorDeleteButton';

export const dynamic = 'force-dynamic';

const PROFESSION_LABEL: Record<string, string> = {
  doctor: 'Doctor / MD',
  cosmetologist: 'Cosmetologist',
  clinic: 'Clinic / Brand',
};

const AREA_LABEL: Record<string, string> = {
  north: 'North',
  center: 'Center',
  south: 'South',
  jerusalem: 'Jerusalem',
  eilat: 'Eilat',
};

export default async function AdminDoctors() {
  if (!isAdmin()) redirect('/admin');
  const doctors = await readDoctors();
  doctors.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24,
          gap: 24,
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
            Family of cosmetologists
          </h1>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: 13,
              color: 'rgba(245,242,240,0.55)',
            }}
          >
            {doctors.length} entries — published entries surface in the
            “Trusted by” strip on product pages and the clinic locator
            on /about.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href="/api/admin/export/doctors"
            style={{
              padding: '12px 18px',
              borderRadius: 30,
              border: '1px solid rgba(245,242,240,0.2)',
              color: 'rgba(245,242,240,0.85)',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Export CSV
          </a>
          <Link
            href="/admin/doctors/new"
            style={{
              padding: '12px 22px',
              borderRadius: 30,
              background: '#dfba74',
              color: '#08080a',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            + New entry
          </Link>
        </div>
      </header>

      {doctors.length === 0 ? (
        <div
          style={{
            padding: 28,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            color: 'rgba(245,242,240,0.6)',
            fontSize: 14,
          }}
        >
          No entries yet. Add the first cosmetologist / doctor / clinic —
          published entries become public social proof on the site.
        </div>
      ) : (
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
                <Th style={{ width: 70 }}>Photo</Th>
                <Th>Name</Th>
                <Th>Profession</Th>
                <Th>City · Area</Th>
                <Th>Contact</Th>
                <Th style={{ width: 110 }}>Published</Th>
                <Th style={{ width: 110, textAlign: 'right' }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr
                  key={d.id}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Td>
                    <span
                      style={{
                        display: 'inline-flex',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {d.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={d.photo}
                          alt=""
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span style={{ color: 'rgba(245,242,240,0.3)' }}>—</span>
                      )}
                    </span>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/doctors/${d.id}/edit`}
                      style={{ color: '#f5f2f0', fontWeight: 500 }}
                    >
                      {d.name}
                    </Link>
                  </Td>
                  <Td>{PROFESSION_LABEL[d.profession] ?? d.profession}</Td>
                  <Td>
                    {d.city}
                    {' · '}
                    <span style={{ color: 'rgba(245,242,240,0.6)' }}>
                      {AREA_LABEL[d.area] ?? d.area}
                    </span>
                  </Td>
                  <Td>
                    <a
                      href={`tel:${d.contact.replace(/[^+\d]/g, '')}`}
                      style={{ color: '#dfba74' }}
                    >
                      {d.contact}
                    </a>
                    {d.instagram && (
                      <>
                        {' · '}
                        <a
                          href={
                            d.instagram.startsWith('http')
                              ? d.instagram
                              : `https://instagram.com/${d.instagram.replace(/^@/, '')}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#dfba74', fontSize: 13 }}
                        >
                          @{d.instagram.replace(/^@/, '')}
                        </a>
                      </>
                    )}
                  </Td>
                  <Td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: d.isPublished ? '#66cc80' : '#9aa0a6',
                        }}
                      />
                      {d.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    <Link
                      href={`/admin/doctors/${d.id}/edit`}
                      style={{
                        marginRight: 10,
                        color: 'rgba(245,242,240,0.8)',
                        fontSize: 13,
                      }}
                    >
                      Edit
                    </Link>
                    <AdminDoctorDeleteButton id={d.id} name={d.name} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        padding: '14px 16px',
        verticalAlign: 'middle',
        color: 'rgba(245,242,240,0.85)',
        ...style,
      }}
    >
      {children}
    </td>
  );
}
