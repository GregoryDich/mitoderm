import { describe, it, expect } from 'vitest';
import { rateLimited, clientIp } from './rate-limit';

const fakeReq = (headers: Record<string, string> = {}): Request =>
  new Request('https://example.com', { headers });

describe('rateLimited', () => {
  it('returns ok on first hit and tracks per-identity', () => {
    const r1 = rateLimited('leads', 'rl-test-ip-a');
    expect(r1.ok).toBe(true);
    const r2 = rateLimited('leads', 'rl-test-ip-b');
    expect(r2.ok).toBe(true);
  });

  it('returns retryInMs once the limit is hit', () => {
    // apply is the strictest at 3/min — easy to trip.
    const ip = `rl-test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimited('apply', ip).ok).toBe(true);
    }
    const over = rateLimited('apply', ip);
    expect(over.ok).toBe(false);
    expect(typeof over.retryInMs).toBe('number');
    expect(over.retryInMs).toBeGreaterThan(0);
  });

  it('is independent across buckets', () => {
    const ip = `rl-test-${Math.random()}`;
    for (let i = 0; i < 3; i++) rateLimited('apply', ip);
    expect(rateLimited('apply', ip).ok).toBe(false);
    // Same IP, different bucket — fresh budget.
    expect(rateLimited('chat', ip).ok).toBe(true);
  });
});

describe('clientIp', () => {
  it('prefers the left-most x-forwarded-for entry', () => {
    expect(
      clientIp(fakeReq({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }))
    ).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip when x-forwarded-for is missing', () => {
    expect(clientIp(fakeReq({ 'x-real-ip': '9.9.9.9' }))).toBe('9.9.9.9');
  });

  it('falls back to "unknown" when nothing identifies the client', () => {
    expect(clientIp(fakeReq())).toBe('unknown');
  });
});
