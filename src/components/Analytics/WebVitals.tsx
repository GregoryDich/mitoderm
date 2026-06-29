'use client';

import { useReportWebVitals } from 'next/web-vitals';

/** Forwards Core Web Vitals to GA4 as events via the same gtag the
 *  GoogleAnalytics component installs. Renders nothing. Only does work
 *  when gtag is present (i.e. when NEXT_PUBLIC_GOOGLE_ID is configured),
 *  so it's inert in local/dev or when analytics is off.
 *
 *  Metric values are rounded the GA-conventional way: CLS ×1000 (since
 *  it's a small float), everything else to the nearest integer ms. */
type GtagWindow = Window & {
  gtag?: (
    command: 'event',
    name: string,
    params?: Record<string, unknown>
  ) => void;
};

export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (typeof window === 'undefined') return;
    const w = window as GtagWindow;
    if (!w.gtag) return;
    const value = Math.round(
      metric.name === 'CLS' ? metric.value * 1000 : metric.value
    );
    try {
      w.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value,
        metric_id: metric.id,
        metric_rating: metric.rating,
        non_interaction: true,
      });
    } catch {
      // never let analytics break a render
    }
  });

  return null;
}
