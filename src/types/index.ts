export type GroupId = string;
export type ParticipantId = string;

export type GroupColor = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

export interface Group {
  id: GroupId;
  name: string;
  color: GroupColor;
  defaultAmount: number | null;
}

export interface Participant {
  id: ParticipantId;
  name: string;
  groupId: GroupId | null;
  amount: number | null; // null = 未入力 (not entered, different from 0)
  isPaid: boolean;
}

export interface PartyConfig {
  title: string;
  date: string; // ISO date string
  totalPayment: number | null;
  headcount: number | null; // 割り勘計算用人数（参加者リストとは独立）
  memo: string;
  notes: string; // 備考欄（自由記述）
}

export interface AppState {
  party: PartyConfig;
  groups: Group[];
  participants: Participant[];
}

export interface GroupSummary {
  group: Group | null;
  participants: Participant[];
  subtotal: number;
  memberCount: number;
  average: number | null;
  suggestedAmount: number | null; // 100円切り上げ
}

export interface Summary {
  totalCollected: number;
  totalPayment: number;
  balance: number; // positive = shortfall, negative = surplus
  unentered: number; // participants with amount === null
  paidCount: number;
  totalCount: number;
  groupSummaries: GroupSummary[];
}
