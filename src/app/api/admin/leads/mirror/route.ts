import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { readLeads } from '@/lib/leads-store';
import { logAudit, requestMeta } from '@/lib/audit-log';

export const dynamic = 'force-dynamic';

const FILE_PATH = 'data/leads-mirror.json';

function ok(token: string | null): boolean {
  const expected = process.env.LEADS_MIRROR_TOKEN;
  if (!expected || !token) return false;
  // Constant-time compare so a bad token doesn't leak length info.
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface GhConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}
function readGh(): GhConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch };
}

/** Snapshot leads → commit a JSON file via the GitHub Contents API.
 *  Intended for a daily cron (Vercel Cron, GitHub Actions, etc.):
 *
 *    POST /api/admin/leads/mirror?token=<LEADS_MIRROR_TOKEN>
 *
 *  Sensitive PII; the receiver is the repo configured by
 *  GITHUB_OWNER/REPO/BRANCH — pick a private repo. The mirror file
 *  lives under data/leads-mirror.json on that branch and is
 *  overwritten on each run. */
export async function POST(req: Request) {
  const url = new URL(req.url);
  // Prefer an Authorization: Bearer header — tokens in the query string
  // leak into access/proxy logs and Referer. Query stays as a fallback
  // for existing cron configs.
  const auth = req.headers.get('authorization') || '';
  const bearer = auth.toLowerCase().startsWith('bearer ')
    ? auth.slice(7).trim()
    : null;
  const token = bearer || url.searchParams.get('token');
  if (!ok(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const gh = readGh();
  if (!gh) {
    return NextResponse.json({ error: 'github_not_configured' }, { status: 412 });
  }

  const leads = await readLeads();
  const body = JSON.stringify(
    {
      mirroredAt: new Date().toISOString(),
      count: leads.length,
      leads,
    },
    null,
    2
  ) + '\n';

  const api = `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${gh.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'content-type': 'application/json',
  };
  let sha: string | undefined;
  const cur = await fetch(`${api}?ref=${encodeURIComponent(gh.branch)}`, {
    headers,
    cache: 'no-store',
  });
  if (cur.ok) sha = ((await cur.json()) as { sha: string }).sha;
  else if (cur.status !== 404) {
    return NextResponse.json(
      { error: 'github_get_failed', status: cur.status },
      { status: 502 }
    );
  }
  const put = await fetch(api, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `chore(cron): leads mirror @ ${leads.length} record(s)`,
      content: Buffer.from(body, 'utf8').toString('base64'),
      branch: gh.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!put.ok) {
    return NextResponse.json(
      { error: 'github_put_failed', status: put.status },
      { status: 502 }
    );
  }
  await logAudit({
    at: new Date().toISOString(),
    action: 'lead.update',
    target: 'mirror',
    ...requestMeta(req),
    meta: { count: leads.length, file: FILE_PATH },
  });
  return NextResponse.json({ ok: true, count: leads.length });
}
