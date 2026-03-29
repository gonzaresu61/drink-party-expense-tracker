import { useAppStore } from '../store/useAppStore';
import { computeSummary } from '../store/selectors';

export function useSummary() {
  return useAppStore((s) => computeSummary(s));
}
