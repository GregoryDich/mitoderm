import fs from 'node:fs/promises';
import path from 'node:path';

export type AuditAction =
  | 'product.create'
  | 'product.update'
  | 'product.delete'
  | 'product.duplicate'
  | 'doctor.create'
  | 'doctor.update'
  | 'doctor.delete'
  | 'lead.update'
  | 'lead.delete'
  | 'social.create'
  | 'social.update'
  | 'social.delete'
  | 'press.create'
  | 'press.update'
  | 'press.delete'
  | 'asset.upload'
  | 'auth.login'
  | 'auth.logout';

export interface AuditEntry {
  at: string; // ISO timestamp
  action: AuditAction;
  target?: string; // slug / id / filename
  ip?: string;
  ua?: string;
  meta?: Record<string, unknown>;
}

const REL_PATH = 'data/audit.jsonl';

/** Append an audit entry. Best-effort: any failure is logged and
 *  swallowed — the audit log must never break an admin write. */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    const abs = path.join(process.cwd(), REL_PATH);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.appendFile(abs, JSON.stringify(entry) + '\n', 'utf8');
  } catch (err) {
    console.error('[audit] write failed', err);
  }
}

/** Read the latest entries, newest first. Returns at most `limit`. */
export async function readAudit(limit = 200): Promise<AuditEntry[]> {
  try {
    const abs = path.join(process.cwd(), REL_PATH);
    const raw = await fs.readFile(abs, 'utf8');
    const lines = raw.split('\n').filter(Boolean);
    const entries: AuditEntry[] = [];
    for (const line of lines) {
      try {
        entries.push(JSON.parse(line) as AuditEntry);
      } catch {
        /* skip malformed */
      }
    }
    return entries.reverse().slice(0, limit);
  } catch {
    return [];
  }
}

/** Extract request metadata for the audit entry. */
export function requestMeta(req: Request): { ip?: string; ua?: string } {
  const h = req.headers;
  const fwd = h.get('x-forwarded-for') || '';
  const ip = fwd.split(',')[0]?.trim() || h.get('x-real-ip') || undefined;
  const ua = h.get('user-agent') || undefined;
  return { ip, ua };
}
