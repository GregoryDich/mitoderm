import { describe, it, expect, vi, afterEach } from 'vitest';
import { isSameOrigin, honeypotClean, spamGuard } from './spam-guard';

const fake = (headers: Record<string, string> = {}): Request =>
  new Request('https://exoskin.co.il/api/leads', {
    method: 'POST',
    headers,
  });

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('isSameOrigin', () => {
  it('accepts the production host on Origin', () => {
    expect(isSameOrigin(fake({ origin: 'https://exoskin.co.il' }))).toBe(true);
  });

  it('accepts the production host on Referer', () => {
    expect(
      isSameOrigin(fake({ referer: 'https://exoskin.co.il/form' }))
    ).toBe(true);
  });

  it('accepts localhost', () => {
    expect(isSameOrigin(fake({ origin: 'http://localhost:3000' }))).toBe(true);
  });

  it('rejects a different host', () => {
    expect(isSameOrigin(fake({ origin: 'https://evil.example' }))).toBe(false);
  });

  it('rejects a malformed origin', () => {
    expect(isSameOrigin(fake({ origin: '::::not-a-url' }))).toBe(false);
  });

  it('rejects requests with neither Origin nor Referer in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(isSameOrigin(fake())).toBe(false);
  });

  it('accepts header-less requests in dev', () => {
    expect(isSameOrigin(fake())).toBe(true);
  });
});

describe('honeypotClean', () => {
  it('passes when website is missing', () => {
    expect(honeypotClean({})).toBe(true);
  });

  it('passes when website is empty', () => {
    expect(honeypotClean({ website: '' })).toBe(true);
    expect(honeypotClean({ website: '   ' })).toBe(true);
  });

  it('fails when website is filled', () => {
    expect(honeypotClean({ website: 'spam.example' })).toBe(false);
  });
});

describe('spamGuard', () => {
  it('passes a clean same-origin request', () => {
    const r = spamGuard(
      fake({ origin: 'https://exoskin.co.il' }),
      { website: '' }
    );
    expect(r.ok).toBe(true);
  });

  it('fails on origin mismatch', () => {
    const r = spamGuard(
      fake({ origin: 'https://evil.example' }),
      { website: '' }
    );
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.reason).toBe('origin');
  });

  it('fails on filled honeypot even with valid origin', () => {
    const r = spamGuard(
      fake({ origin: 'https://exoskin.co.il' }),
      { website: 'spam.example' }
    );
    expect(r.ok).toBe(false);
    expect(r.ok === false && r.reason).toBe('honeypot');
  });
});
