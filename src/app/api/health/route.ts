import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Unauthenticated liveness probe for load-balancer / uptime monitors.
 *  Returns 200 with a small payload. Build identifier sourced from the
 *  Vercel-provided env vars when present, falls back to "unknown". */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'mitoderm',
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'unknown',
      env: process.env.VERCEL_ENV ?? 'local',
      ts: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'cache-control': 'no-store, max-age=0',
      },
    }
  );
}
