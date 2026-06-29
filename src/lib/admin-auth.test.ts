import { describe, it, expect, beforeEach } from 'vitest';
import { createSession, verifySession, verifyPassword } from './admin-auth';

beforeEach(() => {
  process.env.ADMIN_PASSWORD = 'test-password-please-change';
});

describe('verifyPassword', () => {
  it('accepts the exact password', () => {
    expect(verifyPassword('test-password-please-change')).toBe(true);
  });

  it('rejects a wrong password', () => {
    expect(verifyPassword('nope')).toBe(false);
  });

  it('rejects when the env is unset', () => {
    delete process.env.ADMIN_PASSWORD;
    expect(verifyPassword('anything')).toBe(false);
  });
});

describe('session round-trip', () => {
  it('signs and verifies a fresh session', () => {
    const { value } = createSession();
    expect(verifySession(value)).toBe(true);
  });

  it('rejects an undefined session', () => {
    expect(verifySession(undefined)).toBe(false);
    expect(verifySession(null)).toBe(false);
    expect(verifySession('')).toBe(false);
  });

  it('rejects a malformed session (no signature)', () => {
    expect(verifySession('only-one-part')).toBe(false);
  });

  it('rejects a tampered payload', () => {
    const { value } = createSession();
    const [payload, sig] = value.split('.');
    const tampered = Buffer.from(
      JSON.stringify({ exp: Date.now() + 999999999 }),
      'utf8'
    ).toString('base64url');
    expect(verifySession(`${tampered}.${sig}`)).toBe(false);
    expect(payload).toBeTruthy();
  });

  it('rejects a tampered signature', () => {
    const { value } = createSession();
    const [payload] = value.split('.');
    expect(verifySession(`${payload}.AAAAA`)).toBe(false);
  });

  it('rejects when the password rotates', () => {
    const { value } = createSession();
    process.env.ADMIN_PASSWORD = 'rotated-password';
    expect(verifySession(value)).toBe(false);
  });
});
