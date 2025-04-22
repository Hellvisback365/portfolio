'use client';

import { useEffect } from 'react';
import type { WebVitalsMetric, ReportHandler } from 'web-vitals';

// Componente per tracciare le web vitals
export default function PerformanceMonitor() {
  useEffect(() => {
    // Importiamo la libreria web-vitals solo sul client
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        // Funzione per inviare i dati di performance
        const sendToAnalytics: ReportHandler = (metric: WebVitalsMetric) => {
          // Log alla console per debug
          if (process.env.NODE_ENV !== 'production') {
            console.log(metric);
          }
          
          // Invia i dati all'endpoint API
          const body = JSON.stringify({
            name: metric.name,
            value: metric.value,
            id: metric.id,
            delta: metric.delta,
            navigation: metric.entries && metric.entries[0]?.name,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
          });

          // Utilizzo dell'API di Beacon quando disponibile per non bloccare la navigazione
          // Altrimenti fallback su fetch
          const sendBeacon = navigator.sendBeacon && navigator.sendBeacon('/api/metrics', body);
          
          if (!sendBeacon) {
            fetch('/api/metrics', {
              keepalive: true,
              method: 'POST',
              body,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        };

        // Monitoraggio delle Core Web Vitals
        getCLS(sendToAnalytics); // Cumulative Layout Shift
        getFID(sendToAnalytics); // First Input Delay
        getFCP(sendToAnalytics); // First Contentful Paint
        getLCP(sendToAnalytics); // Largest Contentful Paint
        getTTFB(sendToAnalytics); // Time to First Byte
      });
    }
  }, []);

  // Questo componente non renderizza nulla
  return null;
} 