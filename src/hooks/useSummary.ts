import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { computeSummary } from '../store/selectors';

export function useSummary() {
  const party = useAppStore((s) => s.party);
  const groups = useAppStore((s) => s.groups);
  const participants = useAppStore((s) => s.participants);
  return useMemo(
    () => computeSummary({ party, groups, participants }),
    [party, groups, participants],
  );
}
