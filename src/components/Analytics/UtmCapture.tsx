'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'mitoderm_utm_v1';
const UTM_FIELDS = ['source', 'medium', 'campaign', 'term', 'content'] as const;

type UtmField = (typeof UTM_FIELDS)[number];

export interface StoredUtm {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landing?: string;
  ts?: string;
}

/** Captures `?utm_*` query params on first visit and stashes them in
 *  sessionStorage so subsequent form submissions can include the
 *  attribution. Only the FIRST UTM-bearing visit in a session is
 *  recorded — re-landing later in the same session shouldn't overwrite
 *  the original source.
 *
 *  Mounted in the root layout. Renders nothing. */
export default function UtmCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const existing = window.sessionStorage.getItem(STORAGE_KEY);
      if (existing) return; // first-touch wins
      const params = new URLSearchParams(window.location.search);
      const utm: StoredUtm = {};
      let hasAny = false;
      for (const f of UTM_FIELDS) {
        const v = params.get(`utm_${f}`);
        if (v) {
          (utm as Record<UtmField, string>)[f] = v.slice(0, 200);
          hasAny = true;
        }
      }
      // Even without UTM params, record the landing path so we know
      // where the visitor entered the site.
      utm.landing = window.location.pathname.slice(0, 200);
      utm.ts = new Date().toISOString();
      if (hasAny || utm.landing) {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
      }
    } catch {
      // sessionStorage may be blocked — silently skip; lead still posts.
    }
  }, []);

  return null;
}

/** Read the stored UTM payload for inclusion in a form POST body.
 *  Safe to call from any client component. */
export function readStoredUtm(): StoredUtm | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as StoredUtm;
    return parsed;
  } catch {
    return undefined;
  }
}
