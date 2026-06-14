import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readDoctors } from '@/lib/doctors-store';
import { csvFilename, toCsv } from '@/lib/csv';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const doctors = await readDoctors();
  doctors.sort((a, b) => a.name.localeCompare(b.name));
  const rows = doctors.map((d) => ({
    id: d.id,
    name: d.name,
    profession: d.profession,
    city: d.city,
    area: d.area,
    contact: d.contact,
    instagram: d.instagram ?? '',
    bio: d.bio ?? '',
    photo: d.photo ?? '',
    isPublished: d.isPublished ? 'yes' : 'no',
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));
  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${csvFilename('mitoderm-doctors')}"`,
      'cache-control': 'no-store',
    },
  });
}
