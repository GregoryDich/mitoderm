import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readLeads } from '@/lib/leads-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const leads = await readLeads();
  // newest first
  leads.sort((a, b) => (b.ts > a.ts ? 1 : -1));
  return NextResponse.json({ leads });
}
