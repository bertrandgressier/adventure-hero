'use client';

import { useReportWebVitals } from 'next/web-vitals';
import * as gtag from '@/src/infrastructure/analytics/gtag';

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (!gtag.GA_TRACKING_ID) return;

    // Envoyer les Web Vitals à Google Analytics
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  });

  return null;
}
