export type GroupColor =
  | 'red' | 'orange' | 'amber' | 'green'
  | 'teal' | 'blue' | 'purple' | 'pink';

export type AmountMode = 'fixed' | 'auto';

export interface EventConfig {
  title: string;
  date: string;
  venue: string;
  unitPrice: number | null;     // 1人あたり料金
  attendeeCount: number | null; // 参加人数
  manualTotal: number | null;   // 総額を直接入力する場合
  notes: string;
}

export interface Group {
  id: string;
  name: string;
  color: GroupColor;
  count: number;               // 計算に使う人数
  amountMode: AmountMode;      // 'fixed' = 固定, 'auto' = 自動計算
  fixedAmount: number | null;  // modeが'fixed'のときの1人あたり金額
}

export interface Member {
  id: string;
  groupId: string;
  name: string;
  isPaid: boolean;
}

export interface AppState {
  event: EventConfig;
  groups: Group[];
  members: Member[];
}

export interface CalcResult {
  total: number;
  fixedSum: number;
  autoCount: number;
  autoAmount: number | null; // null = 自動グループなし
  perGroup: Record<string, number>; // groupId → 1人あたり金額
  totalHeadcount: number;
  collectedTotal: number;
  paidCount: number;
}
