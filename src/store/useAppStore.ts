import { create } from 'zustand';

interface AppState {
  targetSection: string | null;
  setTargetSection: (section: string | null) => void;
  flyToSection: (section: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  targetSection: null,
  setTargetSection: (section) => set({ targetSection: section }),
  flyToSection: (section) => {
    set({ targetSection: section });
    // Evento per scollegare eventuali logiche lenis o scroll manuale
    // Dispatchamo un evento custom che HtmlOverlay o NavigationOverlay possono ascoltare
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('navigate-section', { detail: { section } });
      window.dispatchEvent(event);
    }
  },
}));
