// Dichiarazione di tipi per il modulo web-vitals
declare module 'web-vitals' {
  // Tipi per le metriche Web Vitals
  export interface WebVitalsMetric {
    id: string;
    name: string;
    value: number;
    delta: number;
    entries: PerformanceEntry[];
    navigationType?: string;
  }

  // Tipi per le funzioni di misurazione
  export type ReportHandler = (metric: WebVitalsMetric) => void;

  // Funzioni principali esportate dal modulo
  export function getCLS(onReport: ReportHandler, reportAllChanges?: boolean): void;
  export function getFCP(onReport: ReportHandler): void;
  export function getFID(onReport: ReportHandler): void;
  export function getLCP(onReport: ReportHandler, reportAllChanges?: boolean): void;
  export function getTTFB(onReport: ReportHandler): void;
} 