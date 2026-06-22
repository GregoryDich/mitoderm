import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notifyLead, forwardLeadWebhook } from './leads-pipeline';

const baseLead = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '',
  clinic: '',
  message: 'Hello',
};

describe('notifyLead', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does nothing when RESEND_API_KEY is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('LEADS_TO_EMAIL', 'inbox@example.com');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await notifyLead({ lead: baseLead });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('does nothing when LEADS_TO_EMAIL is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_abc');
    vi.stubEnv('LEADS_TO_EMAIL', '');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await notifyLead({ lead: baseLead });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('POSTs to Resend when both env vars are set', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_abc');
    vi.stubEnv('LEADS_TO_EMAIL', 'inbox@example.com');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 200 }));
    await notifyLead({ lead: baseLead });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe('https://api.resend.com/emails');
    expect((init as RequestInit)?.method).toBe('POST');
  });

  it('uses a source-aware subject when the lead carries a source', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_abc');
    vi.stubEnv('LEADS_TO_EMAIL', 'inbox@example.com');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 200 }));
    await notifyLead({
      lead: { ...baseLead, source: 'bio-spicules-waitlist' },
    });
    const body = JSON.parse(
      String((fetchSpy.mock.calls[0][1] as RequestInit).body)
    ) as { subject: string };
    expect(body.subject).toContain('bio-spicules-waitlist');
  });
});

describe('forwardLeadWebhook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does nothing when LEADS_WEBHOOK_URL is missing', async () => {
    vi.stubEnv('LEADS_WEBHOOK_URL', '');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await forwardLeadWebhook({ lead: baseLead });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('POSTs to the configured URL with the lead payload', async () => {
    vi.stubEnv('LEADS_WEBHOOK_URL', 'https://example.com/hook');
    vi.stubEnv('LEADS_WEBHOOK_SECRET', '');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 200 }));
    await forwardLeadWebhook({ lead: baseLead });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe('https://example.com/hook');
    const body = JSON.parse(String((init as RequestInit)?.body)) as {
      source: string;
      lead: typeof baseLead;
    };
    expect(body.source).toBe('exoskin.co.il');
    expect(body.lead.email).toBe(baseLead.email);
    // No signature header when secret is unset.
    const headers = (init as RequestInit)?.headers as Record<string, string>;
    expect(headers['x-mitoderm-signature']).toBeUndefined();
  });

  it('signs the body when LEADS_WEBHOOK_SECRET is set', async () => {
    vi.stubEnv('LEADS_WEBHOOK_URL', 'https://example.com/hook');
    vi.stubEnv('LEADS_WEBHOOK_SECRET', 'shhh');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 200 }));
    await forwardLeadWebhook({ lead: baseLead });
    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers['x-mitoderm-signature']).toMatch(/^sha256=[a-f0-9]+$/);
  });
});
