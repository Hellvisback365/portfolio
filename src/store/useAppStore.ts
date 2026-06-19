import { create } from 'zustand';

/**
 * Due canali, una sola dipendenza:
 *
 * 1) Stato UI reattivo (Zustand classico): copilot aperto, navigazione.
 * 2) Canale "transiente" per lo scroll: `scrollProgress` è un oggetto
 *    mutabile letto via ref dentro useFrame. Lo scroll a 60–120 Hz NON
 *    deve mai attraversare React: niente setState per frame, niente
 *    re-render, niente letture di layout nel loop WebGL.
 */

export const SECTIONS = ['hero', 'about', 'skills', 'projects', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];

/** Canale ad alta frequenza: scritto da Lenis, letto da useFrame. */
export const scrollProgress = {
  /** 0 → 1 sull'intera pagina */
  value: 0,
  /** 0 → SECTIONS.length - 1, continuo (input del morphing) */
  stage: 0,
};

interface AppState {
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  language: 'it' | 'en';
  setLanguage: (lang: 'it' | 'en') => void;
  /** Naviga la pagina (e quindi la scena) verso una sezione. */
  flyToSection: (section: SectionId | string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  copilotOpen: false,
  setCopilotOpen: (open) => set({ copilotOpen: open }),
  language: 'it',
  setLanguage: (lang) => set({ language: lang }),
  flyToSection: (section) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('navigate-section', { detail: { section } }),
    );
  },
}));
