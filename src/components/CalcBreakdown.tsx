import type { Group, CalcResult } from '../types';
import { formatCurrency, formatAmount } from '../utils/formatCurrency';

interface Props {
  groups: Group[];
  calc: CalcResult;
}

export function CalcBreakdown({ groups, calc }: Props) {
  const { total, fixedSum, autoCount, autoAmount } = calc;
  if (total === 0 || groups.length === 0) return null;

  const fixedGroups = groups.filter((g) => g.amountMode === 'fixed' && g.fixedAmount !== null && g.count > 0);
  const autoGroups = groups.filter((g) => g.amountMode === 'auto' && g.count > 0);

  if (fixedGroups.length === 0 && autoGroups.length === 0) return null;

  const remaining = total - fixedSum;

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-2">
      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">計算内訳</p>

      {/* 総額 */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">総額</span>
        <span className="font-mono font-semibold text-gray-800">{formatCurrency(total)}</span>
      </div>

      {/* 固定グループ */}
      {fixedGroups.length > 0 && (
        <div className="space-y-1">
          {fixedGroups.map((g) => (
            <div key={g.id} className="flex justify-between text-sm">
              <span className="text-gray-500">
                固定 {g.name || 'グループ'} {g.count}名 × {formatAmount(g.fixedAmount!)}
              </span>
              <span className="font-mono text-red-500">
                −{formatCurrency(g.fixedAmount! * g.count)}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-sm border-t border-indigo-100 pt-1">
            <span className="text-gray-500">固定合計</span>
            <span className="font-mono font-semibold text-red-500">−{formatCurrency(fixedSum)}</span>
          </div>
        </div>
      )}

      {/* 自動計算 */}
      {autoGroups.length > 0 && autoAmount !== null && (
        <>
          <div className="flex justify-between text-sm font-semibold border-t border-indigo-200 pt-2">
            <span className="text-gray-700">残額 ÷ {autoCount}名</span>
            <span className="font-mono text-gray-700">
              {formatCurrency(remaining)} ÷ {autoCount}
            </span>
          </div>
          <div className="bg-indigo-600 text-white rounded-xl px-4 py-2.5 flex justify-between items-center">
            <span className="text-sm font-semibold">
              自動グループ 1人あたり
              {autoGroups.length > 1 && (
                <span className="text-indigo-200 text-xs ml-1">
                  ({autoGroups.map((g) => g.name || 'グループ').join('・')})
                </span>
              )}
            </span>
            <span className="text-xl font-bold font-mono">{formatAmount(autoAmount)}</span>
          </div>
        </>
      )}
    </div>
  );
}
