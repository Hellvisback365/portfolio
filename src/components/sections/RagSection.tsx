'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import RagChat from '@/components/RagChat';

export default function RagSection() {
  return (
    <section id="copilot" className="container mx-auto px-4 py-16" aria-labelledby="copilot-title">
      <span id="copilot-title" className="sr-only">
        Copilot CV
      </span>
      <SectionHeader
        eyebrow="Copilot"
        title="Chat con il mio profilo"
        description="Questo RAG assistant indicizza CV, progetti e metriche direttamente da Qdrant. Usa le domande rapide oppure scrivi la tua per ricevere risposte con fonti verificabili."
        align="center"
      />

      <div className="mt-10">
        <RagChat />
      </div>
    </section>
  );
}
