import { test, expect } from '@playwright/test';

/** Smoke test that every public route returns 200 in every locale and
 *  the page does not emit any uncaught console errors. We don't assert
 *  specific copy here — that's the owner's domain — only that the
 *  page renders without exploding. */

const LOCALES = ['en', 'ru', 'he'] as const;
const PATHS = [
  '',
  '/catalog',
  '/about',
  '/clinics',
  '/seminars',
  '/science',
  '/blog',
  '/blog/what-are-exosomes-in-skin-care',
  '/lines/exosomes',
  '/lines/exosignal-hair',
  '/lines/peeling',
  '/lines/devices',
  '/products/v-tech-serum',
  '/products/mitopen',
  '/products/mitoscan',
  '/form',
  '/apply',
  '/glossary',
  '/concerns/density',
  '/concerns/hair',
  '/concerns/longevity',
  '/concerns/devices',
  '/privacy',
  '/terms',
];

for (const locale of LOCALES) {
  for (const path of PATHS) {
    test(`${locale}${path || ' /'} renders without console errors`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
      });

      const res = await page.goto(`/${locale}${path}`);
      expect(res, 'navigation response').not.toBeNull();
      expect(res!.status(), `status for /${locale}${path}`).toBe(200);

      // Hebrew renders RTL.
      if (locale === 'he') {
        const dir = await page.evaluate(() => document.documentElement.dir);
        // App sets dir on body; some pages set on html. Accept either rtl.
        const bodyDir = await page.evaluate(() => document.body.dir);
        expect([dir, bodyDir]).toContain('rtl');
      }

      // Some uncaught hydration warnings are noisy but non-fatal — only
      // hard-fail on errors that aren't from third-party scripts.
      const meaningful = errors.filter(
        (e) => !/Failed to load resource|favicon\.ico|googletagmanager/i.test(e)
      );
      expect(meaningful, `console errors on /${locale}${path}`).toEqual([]);
    });
  }
}

test('GET /api/health returns 200 and a JSON body', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe('ok');
  expect(body.service).toBe('mitoderm');
});
