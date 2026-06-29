/** Structured error reporting hook.
 *
 *  - Always emits a single console.error line with a stable shape so
 *    Vercel logs are greppable.
 *  - When SENTRY_DSN is set, fires an envelope-style POST to the Sentry
 *    public endpoint. No SDK dependency, no source-maps — just the
 *    structured payload. Failures here are swallowed; we never let
 *    the error reporter break the calling request.
 *
 *  Call from API route catch blocks, especially around outbound calls
 *  (Resend, leads webhook, social ingest, LLM, GitHub Contents API).
 */

interface ReportContext {
  /** Logical site of failure — "leads.webhook", "social.poster",
   *  "chat.llm", "admin.github". Used as the Sentry event "logger". */
  where: string;
  /** Any small JSON-safe payload for triage. Avoid PII. */
  meta?: Record<string, unknown>;
}

function parseDsn(dsn: string): {
  storeUrl: string;
  publicKey: string;
} | null {
  try {
    const u = new URL(dsn);
    const projectId = u.pathname.replace(/^\//, '');
    if (!projectId || !u.username) return null;
    const storeUrl = `${u.protocol}//${u.host}/api/${projectId}/store/`;
    return { storeUrl, publicKey: u.username };
  } catch {
    return null;
  }
}

export function reportError(err: unknown, ctx: ReportContext): void {
  const msg = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  const env = process.env.VERCEL_ENV ?? 'local';

  // 1) Always log — primary surface in Vercel.
  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify({
      level: 'error',
      where: ctx.where,
      env,
      msg,
      meta: ctx.meta ?? {},
      ts: new Date().toISOString(),
    })
  );

  // 2) Optionally ship to Sentry. Best-effort, fire-and-forget.
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  const parsed = parseDsn(dsn);
  if (!parsed) return;

  const payload = {
    event_id: crypto.randomUUID().replace(/-/g, ''),
    timestamp: Date.now() / 1000,
    level: 'error',
    logger: ctx.where,
    platform: 'javascript',
    environment: env,
    server_name: process.env.VERCEL_REGION ?? 'unknown',
    release: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
    exception: {
      values: [
        {
          type: err instanceof Error ? err.constructor.name : 'Error',
          value: msg,
          stacktrace: stack ? { frames: parseStack(stack) } : undefined,
        },
      ],
    },
    extra: ctx.meta ?? {},
  };

  const auth = [
    'Sentry sentry_version=7',
    `sentry_key=${parsed.publicKey}`,
    'sentry_client=mitoderm/0.1.0',
  ].join(', ');

  // Don't await — best-effort, never block the calling handler.
  fetch(parsed.storeUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-sentry-auth': auth,
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

function parseStack(stack: string): { filename: string; function?: string; lineno?: number }[] {
  return stack
    .split('\n')
    .slice(1, 20)
    .map((line) => {
      const m = /at\s+(.+?)\s+\((.+?):(\d+):\d+\)/.exec(line) || /at\s+(.+?):(\d+):\d+/.exec(line);
      if (!m) return null;
      if (m.length === 4) {
        return { function: m[1], filename: m[2], lineno: Number(m[3]) };
      }
      return { filename: m[1], lineno: Number(m[2]) };
    })
    .filter(Boolean) as { filename: string; function?: string; lineno?: number }[];
}
