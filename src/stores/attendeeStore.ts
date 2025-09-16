// attendeeStore.ts - Zustand store for attendee data

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AttendeeState {
    // State
    name: string;
    joinable: boolean;
    hasRelative: boolean;
    transport: string;
    message: string;
    isSubmitted: boolean;

    // Actions
    setAttendee: (name: string) => void;
    setJoinable: (joinable: boolean) => void;
    setHasRelative: (hasRelative: boolean) => void;
    setTransport: (transport: string) => void;
    setMessage: (message: string) => void;
    setSubmitted: (submitted: boolean) => void;
    resetStore: () => void;

    // Computed
    getDisplayName: () => string;
}

export const useAttendeeStore = create<AttendeeState>()(
    persist(
        (set, get) => ({
            // Initial state
            name: '',
            joinable: true,
            hasRelative: false,
            transport: 'bus',
            message: '',
            isSubmitted: false,

            // Actions
            setAttendee: (name: string) => set({ name: name.trim() }),

            setJoinable: (joinable: boolean) => set({ joinable }),

            setHasRelative: (hasRelative: boolean) => set({ hasRelative }),

            setTransport: (transport: string) => set({ transport }),

            setMessage: (message: string) => set({ message: message.trim() }),

            setSubmitted: (submitted: boolean) => set({ isSubmitted: submitted }),

            resetStore: () => set({
                name: '',
                joinable: true,
                hasRelative: false,
                transport: 'bus',
                message: '',
                isSubmitted: false,
            }),

            // Computed values
            getDisplayName: () => {
                const { name } = get();
                return name.trim() || 'Bạn';
            },
        }),
        {
            name: 'wedding-attendee-storage', // localStorage key
            // Optional: only persist certain fields
            partialize: (state) => ({
                name: state.name,
                joinable: state.joinable,
                hasRelative: state.hasRelative,
                transport: state.transport,
                message: state.message,
                isSubmitted: state.isSubmitted,
            }),
        }
    )
);