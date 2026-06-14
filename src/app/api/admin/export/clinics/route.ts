import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readClinics } from '@/lib/clinics-store';
import { csvFilename, toCsv } from '@/lib/csv';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const clinics = await readClinics();
  clinics.sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  const rows = clinics.map((c) => ({
    id: c.id,
    applied: c.appliedAt,
    status: c.status,
    clinic: c.clinic,
    name: c.name,
    email: c.email,
    phone: c.phone ?? '',
    city: c.city ?? '',
    license: c.license ?? '',
    instagram: c.instagram ?? '',
    referralCode: c.referralCode ?? '',
    referralRate: c.referralRate ?? '',
    loyaltyTier: c.loyaltyTier ?? '',
    loyaltyDiscount: c.loyaltyDiscount ?? '',
    referredById: c.referredById ?? '',
    reviewedAt: c.reviewedAt ?? '',
    lastLoginAt: c.lastLoginAt ?? '',
    note: c.note ?? '',
  }));
  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${csvFilename('mitoderm-clinics')}"`,
      'cache-control': 'no-store',
    },
  });
}
