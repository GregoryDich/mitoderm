/**
 * Tiny CSV serializer — no dependencies. Escapes per RFC 4180:
 * fields with comma / newline / quote are wrapped in double quotes
 * and inner quotes are doubled.
 */
export function toCsv(
  rows: Array<Record<string, unknown>>,
  columns?: string[]
): string {
  if (rows.length === 0) return '';
  const cols = columns ?? Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const esc = (v: unknown): string => {
    if (v == null) return '';
    let s = typeof v === 'string' ? v : String(v);
    s = s.replace(/\r?\n/g, ' ');
    // Formula-injection guard: a cell starting with = + - @ (or a
    // control char) is executed as a formula by Excel/Sheets. Lead
    // fields are attacker-controlled via public forms, so prefix a
    // single quote before RFC-4180 quoting.
    if (/^[=+\-@\t\r]/.test(s)) {
      s = "'" + s;
    }
    if (/[",]/.test(s)) {
      s = '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const head = cols.join(',');
  const body = rows.map((r) => cols.map((c) => esc(r[c])).join(',')).join('\n');
  return head + '\n' + body + '\n';
}

/** Same-day-stamped filename, safe for Content-Disposition. */
export function csvFilename(base: string): string {
  const stamp = new Date().toISOString().slice(0, 10);
  return `${base}-${stamp}.csv`;
}
