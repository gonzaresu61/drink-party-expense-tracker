import type { AppState, Summary, GroupSummary } from '../types';

export function computeSummary(state: AppState): Summary {
  const { party, groups, participants } = state;
  const totalPayment = party.totalPayment ?? 0;
  const totalCollected = participants.reduce(
    (sum, p) => sum + (p.amount ?? 0),
    0,
  );
  const balance = totalPayment - totalCollected;
  const unentered = participants.filter((p) => p.amount === null).length;
  const paidCount = participants.filter((p) => p.isPaid).length;

  const groupSummaries: GroupSummary[] = [];

  for (const group of groups) {
    const members = participants.filter((p) => p.groupId === group.id);
    if (members.length === 0) continue;
    const subtotal = members.reduce((s, p) => s + (p.amount ?? 0), 0);
    const enteredMembers = members.filter((p) => p.amount !== null);
    const average =
      enteredMembers.length > 0
        ? subtotal / enteredMembers.length
        : null;
    const suggestedAmount =
      average !== null ? Math.ceil(average / 100) * 100 : null;
    groupSummaries.push({
      group,
      participants: members,
      subtotal,
      memberCount: members.length,
      average,
      suggestedAmount,
    });
  }

  // Ungrouped participants
  const ungrouped = participants.filter((p) => p.groupId === null);
  if (ungrouped.length > 0) {
    const subtotal = ungrouped.reduce((s, p) => s + (p.amount ?? 0), 0);
    groupSummaries.push({
      group: null,
      participants: ungrouped,
      subtotal,
      memberCount: ungrouped.length,
      average: null,
      suggestedAmount: null,
    });
  }

  return {
    totalCollected,
    totalPayment,
    balance,
    unentered,
    paidCount,
    totalCount: participants.length,
    groupSummaries,
  };
}
