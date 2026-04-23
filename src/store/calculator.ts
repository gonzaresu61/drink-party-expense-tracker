import type { AppState, CalcResult } from '../types';

export function computeTotal(event: AppState['event']): number {
  if (event.manualTotal !== null) return event.manualTotal;
  if (event.unitPrice !== null && event.attendeeCount !== null) {
    return event.unitPrice * event.attendeeCount;
  }
  return 0;
}

export function compute(state: AppState): CalcResult {
  const { event, groups, members } = state;
  const total = computeTotal(event);

  const fixedGroups = groups.filter((g) => g.amountMode === 'fixed');
  const autoGroups = groups.filter((g) => g.amountMode === 'auto');

  const fixedSum = fixedGroups.reduce(
    (sum, g) => sum + (g.fixedAmount ?? 0) * g.count,
    0,
  );
  const autoCount = autoGroups.reduce((sum, g) => sum + g.count, 0);
  const autoAmount = autoCount > 0 ? (total - fixedSum) / autoCount : null;

  const perGroup: Record<string, number> = {};
  for (const g of groups) {
    perGroup[g.id] =
      g.amountMode === 'fixed' ? (g.fixedAmount ?? 0) : (autoAmount ?? 0);
  }

  const totalHeadcount = groups.reduce((sum, g) => sum + g.count, 0);

  const paidCount = members.filter((m) => m.isPaid).length;
  const collectedTotal = members
    .filter((m) => m.isPaid)
    .reduce((sum, m) => sum + (perGroup[m.groupId] ?? 0), 0);

  return {
    total,
    fixedSum,
    autoCount,
    autoAmount,
    perGroup,
    totalHeadcount,
    collectedTotal,
    paidCount,
  };
}
