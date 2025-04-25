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
