import { describe, it, expect } from 'vitest';
import { toCsv } from './csv';

describe('toCsv formula-injection guard', () => {
  it('neutralizes cells that start with a formula trigger', () => {
    const csv = toCsv([
      { name: '=HYPERLINK("http://evil")', note: '+cmd', ok: 'plain' },
    ]);
    const line = csv.trim().split('\n')[1];
    // = and + rows get a leading single quote before RFC-4180 quoting.
    expect(line).toContain(`"'=HYPERLINK`);
    expect(line).toContain(`'+cmd`);
    // benign values are untouched
    expect(line).toContain('plain');
    expect(line).not.toContain(`'plain`);
  });

  it('still escapes commas/quotes/newlines', () => {
    const csv = toCsv([{ v: 'a,"b"\nc' }]);
    expect(csv.trim().split('\n')[1]).toBe('"a,""b"" c"');
  });
});
