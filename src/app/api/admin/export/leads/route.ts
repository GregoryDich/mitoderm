import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readLeads } from '@/lib/leads-store';
import { csvFilename, toCsv } from '@/lib/csv';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const leads = await readLeads();
  leads.sort((a, b) => b.ts.localeCompare(a.ts));
  const rows = leads.map((l) => ({
    id: l.id,
    received: l.ts,
    name: l.name,
    email: l.email,
    phone: l.phone,
    clinic: l.clinic,
    message: l.message,
    status: l.status,
    note: l.note ?? '',
    score: l.classification?.score ?? '',
    lang: l.classification?.lang ?? '',
    intent: l.classification?.intent ?? '',
    size: l.classification?.size ?? '',
    tags: (l.classification?.tags ?? []).join('|'),
    updatedAt: l.updatedAt ?? '',
  }));
  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${csvFilename('mitoderm-leads')}"`,
      'cache-control': 'no-store',
    },
  });
}
