import { registerOTel } from '@vercel/otel';
import { LangfuseSpanProcessor } from '@langfuse/otel';

export const langfuseSpanProcessor = new LangfuseSpanProcessor();

export function register() {
  console.log('>>> [OTEL] INIZIALIZZAZIONE OPEN TELEMETRY E LANGFUSE <<<');
  registerOTel({
    serviceName: 'portfolio-vito',
    spanProcessors: [langfuseSpanProcessor]
  });
}
