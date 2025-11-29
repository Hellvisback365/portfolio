# Portfolio di Vito Piccolini

Un sito portfolio moderno e reattivo costruito con Next.js, TypeScript, Tailwind CSS e Framer Motion.

## Caratteristiche

- 🌓 Tema chiaro/scuro con persistenza
- 📱 Design completamente responsive
- 🎯 Animazioni fluide con Framer Motion
- 📊 Barre di progresso animate per le competenze
- 📝 Modulo di contatto funzionante
- 🔄 CI/CD con GitHub Actions per deploy automatico su Vercel
- ⚡ Ottimizzazione delle performance con code splitting, lazy loading e immagini ottimizzate

## Struttura del Progetto

- `/src/components`: Componenti riutilizzabili
- `/src/app`: Pagine dell'applicazione (routing basato su cartelle)
- `/src/styles`: Fogli di stile globali
- `/public`: Asset statici

## Sviluppo Locale

```bash
# Clona il repository
git clone https://github.com/username/portfolio.git
cd portfolio

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Ora puoi visitare `http://localhost:3000` nel tuo browser per vedere il sito in azione.

## Script Disponibili

- `npm run dev`: Avvia il server di sviluppo con hot reload
- `npm run build`: Crea una build ottimizzata per la produzione
- `npm run start`: Avvia il server di produzione con la build
- `npm run lint`: Esegue il linting del codice

## Ottimizzazioni Performance

Il sito include numerose ottimizzazioni per la performance:

- **Lazy Loading**: Componenti caricati dinamicamente con `next/dynamic`
- **Immagini Ottimizzate**: Utilizzo di `next/image` per ottimizzazione automatica
- **Code Splitting**: Caricamento del codice on-demand
- **Minificazione**: CSS e JS minificati in produzione
- **Prefetching**: Prefetching automatico di pagine per navigazione istantanea
- **Animazioni efficienti**: Utilizzo di Framer Motion con animazioni hardware-accelerated

## Deployment

Il sito è configurato per il deployment automatico su Vercel attraverso GitHub Actions.

Per eseguire un deploy manuale:

```bash
# Installa Vercel CLI (se non già installato)
npm install -g vercel

# Login su Vercel
vercel login

# Deploy in modalità produzione
vercel --prod
```

In alternativa, è possibile utilizzare Netlify:

```bash
# Installa Netlify CLI (se non già installato)
npm install -g netlify-cli

# Login su Netlify
netlify login

# Deploy in modalità produzione
netlify deploy --prod
```

## Tecnologie Utilizzate

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - JavaScript tipizzato
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Framer Motion](https://www.framer.com/motion/) - Libreria di animazioni
- [React Intersection Observer](https://github.com/thebuilder/react-intersection-observer) - Animazioni on-scroll
- [Brevo](https://www.brevo.com/) - API per l'invio di email del form contatti

## Architettura & Integrazioni

- **App Router + Edge-ready API**: le route in `src/app/api/*` gestiscono il form contatti (`contact`), l'endpoint di test (`test-brevo`) e il logging dei Web Vitals (`metrics`) in modo indipendente dal layer di UI.
- **Dark mode dichiarativo**: il tema viene gestito da Tailwind e dal `ThemeProviderWrapper`, eliminando logiche imperative e MutationObserver dal layer di presentazione.
- **Performance surfaces**: `PerformanceMonitor`, immagini ottimizzate e componenti caricati dinamicamente mantengono il TTFB basso su Vercel/Netlify.
- **CI/CD ibrido**: il repo è configurato per deploy automatici su Vercel (GitHub Actions) ma può usare Netlify come fallback grazie ai file `vercel.json` e `netlify.toml` già pronti.

## AI Engineering Journey

- **BeFluent** ([repo](https://github.com/Hellvisback365/BeFluentVITO)): piattaforma React + Node.js pensata per bambini con DSA che integra LLM via LangChain per creare tutoring conversazionale adattivo.
- **POSD System** ([repo](https://github.com/Hellvisback365/POSD-System)): architettura MVC con focus su compliance GDPR, crittografia dei dati e tracciabilità del consenso.
- **LLM Tooling**: esperienza pratica con LLaMA/Mistral locali, prompt chaining e ottimizzazione dei tempi di inferenza; il portfolio funge da hub per future feature intelligenti (es. “Chat with my Resume” basata su RAG).

## Backend & Deployment Details

- `src/app/api/contact/route.ts`: gestisce la validazione dei dati del form, richiama `services/brevo.ts` e invia email verso l'indirizzo configurato.
- `src/app/api/metrics/route.ts`: endpoint pensato per tracciare i Web Vitals inviati dal componente `PerformanceMonitor` (estendibile a qualsiasi data store).
- `src/app/api/test-brevo/route.ts`: diagnostica rapida per verificare la corretta configurazione dell'API key Brevo durante lo sviluppo.
- **Hosting**: progettato per girare su Vercel (edge runtime + analytics native) ma pienamente compatibile con Netlify; basta configurare le stesse variabili d'ambiente (`BREVO_API_KEY`) sui due provider.

## Contatti

Vito Piccolini - [contatto@example.com](mailto:contatto@example.com)

## Modulo di Contatto con Brevo

Il form di contatto utilizza [Brevo API](https://www.brevo.com/) per inviare le email. Per configurarlo:

1. Crea un account gratuito su [Brevo](https://www.brevo.com/)
2. Vai su SMTP & API e genera una nuova API key
3. Crea un file `.env.local` nella radice del progetto con il seguente contenuto:
   ```
   BREVO_API_KEY=tua_api_key_qui
   ```
4. Registra un mittente verificato in Brevo o configura un dominio personalizzato
5. Aggiorna l'email di destinazione in `src/app/api/contact/route.ts` con la tua email

Se non hai accesso alla configurazione delle variabili d'ambiente (ad esempio su Vercel), aggiungile tramite il pannello di controllo del tuo provider di hosting.
