import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

const COOKIE = 'mitoderm_admin';
const SESSION_DAYS = 7;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

function password(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error('ADMIN_PASSWORD env is not set');
  return p;
}

function secret(): string {
  // Derive a stable HMAC secret from the password itself so we don't need
  // a separate env var. Includes a fixed salt so leaks of the cookie value
  // alone don't reveal the password.
  return createHmac('sha256', 'mitoderm:admin:v1').update(password()).digest('hex');
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

export function verifyPassword(input: string): boolean {
  if (!process.env.ADMIN_PASSWORD) return false;
  return eq(input, process.env.ADMIN_PASSWORD);
}

export function createSession(): { value: string; maxAge: number } {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_MS }),
    'utf8'
  ).toString('base64url');
  const sig = sign(payload);
  return { value: `${payload}.${sig}`, maxAge: SESSION_DAYS * 24 * 60 * 60 };
}

export function verifySession(value: string | undefined | null): boolean {
  if (!value || !process.env.ADMIN_PASSWORD) return false;
  const [payload, sig] = value.split('.');
  if (!payload || !sig) return false;
  if (!eq(sig, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    );
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

/** For use inside Server Components / Route Handlers. */
export function isAdmin(): boolean {
  return verifySession(cookies().get(COOKIE)?.value);
}

/** For use inside middleware (where `cookies()` from next/headers is not
 *  available). */
export function isAdminReq(req: NextRequest): boolean {
  return verifySession(req.cookies.get(COOKIE)?.value);
}

export const SESSION_COOKIE = COOKIE;
