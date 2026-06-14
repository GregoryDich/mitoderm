import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'mitoderm_pro';
const SESSION_DAYS = 90;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

/** The HMAC secret backing /pro sessions. We derive it from ADMIN_PASSWORD
 *  so we don't need an extra env var — the secret is rotated together with
 *  the admin password (which is the right blast radius for a small site). */
function secret(): string {
  const seed = process.env.ADMIN_PASSWORD;
  if (!seed) throw new Error('ADMIN_PASSWORD env is not set');
  return createHmac('sha256', 'mitoderm:pro:v1').update(seed).digest('hex');
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function eq(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return timingSafeEqual(A, B);
}

export interface ProSession {
  /** ClinicAccount.id */
  id: string;
  /** Approved-clinic display name (for the badge in the header). */
  name: string;
  exp: number;
}

export function createProSession(opts: { id: string; name: string }): {
  value: string;
  maxAge: number;
} {
  const payload = Buffer.from(
    JSON.stringify({
      id: opts.id,
      name: opts.name,
      exp: Date.now() + SESSION_MS,
    } satisfies ProSession),
    'utf8'
  ).toString('base64url');
  const sig = sign(payload);
  return { value: `${payload}.${sig}`, maxAge: SESSION_DAYS * 24 * 60 * 60 };
}

export function verifyProSession(value: string | undefined | null): ProSession | null {
  if (!value || !process.env.ADMIN_PASSWORD) return null;
  const [payload, sig] = value.split('.');
  if (!payload || !sig) return null;
  if (!eq(sig, sign(payload))) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    ) as ProSession;
    if (
      typeof parsed !== 'object' ||
      typeof parsed.id !== 'string' ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= Date.now()
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Server-component / route-handler helper. */
export function currentProUser(): ProSession | null {
  return verifyProSession(cookies().get(COOKIE)?.value);
}

export const PRO_SESSION_COOKIE = COOKIE;
