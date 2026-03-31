import { create } from 'zustand';
import type { AppState, Group, GroupColor, GroupId, Participant, ParticipantId } from '../types';

const defaultParty = {
  title: '',
  date: new Date().toISOString().split('T')[0] ?? '',
  totalPayment: null,
  headcount: null,
  memo: '',
};

const defaultState: AppState = {
  party: defaultParty,
  groups: [],
  participants: [],
};

// Read initial state synchronously from localStorage (no React involvement)
function loadInitialState(): AppState {
  try {
    const stored = localStorage.getItem('drink-party-v1');
    if (stored) {
      const parsed = JSON.parse(stored) as AppState;
      if (parsed.party && Array.isArray(parsed.groups) && Array.isArray(parsed.participants)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return defaultState;
}

interface AppStore extends AppState {
  setPartyTitle: (title: string) => void;
  setTotalPayment: (amount: number | null) => void;
  setHeadcount: (headcount: number | null) => void;
  setPartyMemo: (memo: string) => void;
  addGroup: (name: string, color: GroupColor) => void;
  updateGroup: (id: GroupId, patch: Partial<Group>) => void;
  deleteGroup: (id: GroupId) => void;
  setBatchAmount: (groupId: GroupId, amount: number | null) => void;
  addParticipant: (name: string, groupId: GroupId | null) => void;
  updateParticipant: (id: ParticipantId, patch: Partial<Participant>) => void;
  deleteParticipant: (id: ParticipantId) => void;
  togglePaid: (id: ParticipantId) => void;
  resetAll: () => void;
}

export const useAppStore = create<AppStore>()((set, get) => ({
  ...loadInitialState(),

  setPartyTitle: (title) =>
    set((s) => ({ party: { ...s.party, title } })),

  setTotalPayment: (totalPayment) =>
    set((s) => ({ party: { ...s.party, totalPayment } })),

  setHeadcount: (headcount) =>
    set((s) => ({ party: { ...s.party, headcount } })),

  setPartyMemo: (memo) =>
    set((s) => ({ party: { ...s.party, memo } })),

  addGroup: (name, color) =>
    set((s) => ({
      groups: [
        ...s.groups,
        { id: crypto.randomUUID(), name, color, defaultAmount: null },
      ],
    })),

  updateGroup: (id, patch) =>
    set((s) => ({
      groups: s.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    })),

  deleteGroup: (id) =>
    set((s) => ({
      groups: s.groups.filter((g) => g.id !== id),
      participants: s.participants.map((p) =>
        p.groupId === id ? { ...p, groupId: null } : p,
      ),
    })),

  setBatchAmount: (groupId, amount) =>
    set((s) => ({
      groups: s.groups.map((g) =>
        g.id === groupId ? { ...g, defaultAmount: amount } : g,
      ),
      participants: s.participants.map((p) =>
        p.groupId === groupId ? { ...p, amount } : p,
      ),
    })),

  addParticipant: (name, groupId) => {
    const group = groupId ? get().groups.find((g) => g.id === groupId) : null;
    set((s) => ({
      participants: [
        ...s.participants,
        {
          id: crypto.randomUUID(),
          name,
          groupId,
          amount: group?.defaultAmount ?? null,
          isPaid: false,
        },
      ],
    }));
  },

  updateParticipant: (id, patch) =>
    set((s) => ({
      participants: s.participants.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    })),

  deleteParticipant: (id) =>
    set((s) => ({
      participants: s.participants.filter((p) => p.id !== id),
    })),

  togglePaid: (id) =>
    set((s) => ({
      participants: s.participants.map((p) =>
        p.id === id ? { ...p, isPaid: !p.isPaid } : p,
      ),
    })),

  resetAll: () => set(defaultState),
}));

// Save to localStorage on every state change (outside React render)
useAppStore.subscribe((state) => {
  try {
    localStorage.setItem(
      'drink-party-v1',
      JSON.stringify({
        party: state.party,
        groups: state.groups,
        participants: state.participants,
      }),
    );
  } catch {
    // ignore storage errors
  }
});
