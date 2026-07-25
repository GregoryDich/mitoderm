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

/**
 * Minimal RFC-4180 CSV parser — the inverse of `toCsv`. Handles quoted
 * fields, doubled quotes, commas and newlines inside quotes, and CRLF.
 * The first row is treated as the header; each data row becomes an object
 * keyed by (trimmed) header. Blank lines are skipped. Excel's leading
 * apostrophe injection-guard (see toCsv) is stripped back off on read.
 */
export function fromCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  const src = text.replace(/^﻿/, ''); // drop BOM

  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i += 1;
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const nonEmpty = rows.filter((r) => r.some((v) => v.trim() !== ''));
  if (nonEmpty.length < 2) return [];
  const header = nonEmpty[0].map((h) => h.trim());
  const unesc = (s: string) => s.replace(/^'(?=[=+\-@\t\r])/, '');
  return nonEmpty.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((key, idx) => {
      obj[key] = unesc((r[idx] ?? '').trim());
    });
    return obj;
  });
}
