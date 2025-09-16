// stores/navigationStore.ts
import { create } from 'zustand';

interface NavigationState {
    hasVisitedHome: boolean;
    setHasVisitedHome: (value: boolean) => void;
    resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    hasVisitedHome: false,

    setHasVisitedHome: (value: boolean) => set({ hasVisitedHome: value }),

    resetNavigation: () => set({ hasVisitedHome: false }),
}));