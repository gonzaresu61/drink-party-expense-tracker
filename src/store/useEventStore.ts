import { create } from 'zustand';
import type { AppState, EventConfig, Group, GroupColor, AmountMode, Member } from '../types';

const defaultEvent: EventConfig = {
  title: '',
  date: new Date().toISOString().split('T')[0] ?? '',
  venue: '',
  unitPrice: null,
  attendeeCount: null,
  manualTotal: null,
  notes: '',
};

const defaultState: AppState = {
  event: defaultEvent,
  groups: [],
  members: [],
};

function loadState(): AppState {
  try {
    const stored = localStorage.getItem('drink-party-v3');
    if (stored) {
      const parsed = JSON.parse(stored) as AppState;
      if (parsed.event && Array.isArray(parsed.groups) && Array.isArray(parsed.members)) {
        return parsed;
      }
    }
  } catch { /* ignore */ }
  return defaultState;
}

interface EventStore extends AppState {
  // event
  setEventField: <K extends keyof EventConfig>(key: K, value: EventConfig[K]) => void;
  // groups
  addGroup: () => void;
  updateGroup: (id: string, patch: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  // members
  addMember: (groupId: string, name?: string) => void;
  addMembersForGroup: (groupId: string, count: number) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  togglePaid: (id: string) => void;
  resetAll: () => void;
}

const COLORS: GroupColor[] = ['red', 'orange', 'amber', 'green', 'teal', 'blue', 'purple', 'pink'];

export const useEventStore = create<EventStore>()((set, get) => ({
  ...loadState(),

  setEventField: (key, value) =>
    set((s) => ({ event: { ...s.event, [key]: value } })),

  addGroup: () => {
    const usedColors = get().groups.map((g) => g.color);
    const color = COLORS.find((c) => !usedColors.includes(c)) ?? COLORS[get().groups.length % COLORS.length]!;
    set((s) => ({
      groups: [
        ...s.groups,
        {
          id: crypto.randomUUID(),
          name: '',
          color,
          count: 0,
          amountMode: 'fixed' as AmountMode,
          fixedAmount: null,
        },
      ],
    }));
  },

  updateGroup: (id, patch) =>
    set((s) => ({
      groups: s.groups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    })),

  deleteGroup: (id) =>
    set((s) => ({
      groups: s.groups.filter((g) => g.id !== id),
      members: s.members.filter((m) => m.groupId !== id),
    })),

  addMember: (groupId, name = '') =>
    set((s) => ({
      members: [
        ...s.members,
        { id: crypto.randomUUID(), groupId, name, isPaid: false },
      ],
    })),

  addMembersForGroup: (groupId, count) => {
    const existing = get().members.filter((m) => m.groupId === groupId).length;
    const toAdd = Math.max(0, count - existing);
    if (toAdd === 0) return;
    const newMembers = Array.from({ length: toAdd }, () => ({
      id: crypto.randomUUID(),
      groupId,
      name: '',
      isPaid: false,
    }));
    set((s) => ({ members: [...s.members, ...newMembers] }));
  },

  updateMember: (id, patch) =>
    set((s) => ({
      members: s.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),

  deleteMember: (id) =>
    set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

  togglePaid: (id) =>
    set((s) => ({
      members: s.members.map((m) =>
        m.id === id ? { ...m, isPaid: !m.isPaid } : m,
      ),
    })),

  resetAll: () => set(defaultState),
}));

useEventStore.subscribe((state) => {
  try {
    localStorage.setItem(
      'drink-party-v3',
      JSON.stringify({ event: state.event, groups: state.groups, members: state.members }),
    );
  } catch { /* ignore */ }
});
