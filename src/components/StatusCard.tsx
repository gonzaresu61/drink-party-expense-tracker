import { useMemo } from 'react';
import { useEventStore } from '../store/useEventStore';
import { compute } from '../store/calculator';
import { formatCurrency, formatAmount } from '../utils/formatCurrency';

export function StatusCard() {
  const event = useEventStore((s) => s.event);
  const groups = useEventStore((s) => s.groups);
  const members = useEventStore((s) => s.members);
  const calc = useMemo(() => compute({ event, groups, members }), [event, groups, members]);

  const { total, totalHeadcount, collectedTotal, paidCount, autoAmount } = calc;
  const hasData = total > 0 || groups.length > 0;
  const progressPct = total > 0 ? Math.min(100, (collectedTotal / total) * 100) : 0;
  const namedMembers = members.length;

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <p className="text-3xl mb-2">🍻</p>
        <p className="text-base font-semibold text-gray-700">飲み会会計アプリ</p>
        <p className="text-sm text-gray-400 mt-1">イベント情報とグループを設定してください</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 総額・徴収 */}
      <div className="px-4 pt-4 pb-3 space-y-1">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-500">総額</span>
          <span className="text-2xl font-bold text-gray-800 font-mono">
            {total > 0 ? formatCurrency(total) : '—'}
          </span>
        </div>
        {autoAmount !== null && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-500">自動計算金額</span>
            <span className="text-lg font-bold text-indigo-600 font-mono">
              {formatAmount(autoAmount)} / 人
            </span>
          </div>
        )}
        {namedMembers > 0 && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-500">徴収済</span>
            <span className="text-base font-semibold text-green-600 font-mono">
              {formatCurrency(collectedTotal)}
            </span>
          </div>
        )}
      </div>

      {/* 進捗バー（名前付きメンバーがいる場合のみ） */}
      {namedMembers > 0 && total > 0 && (
        <div className="px-4 pb-3">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>徴収済 {paidCount}名</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
        </div>
      )}

      {/* 統計 */}
      <div className="flex divide-x divide-gray-100 border-t border-gray-100">
        <div className="flex-1 py-3 flex flex-col items-center">
          <span className="text-xs text-gray-400">合計人数</span>
          <span className="text-base font-bold text-gray-700">{totalHeadcount}名</span>
        </div>
        <div className="flex-1 py-3 flex flex-col items-center">
          <span className="text-xs text-gray-400">グループ</span>
          <span className="text-base font-bold text-gray-700">{groups.length}件</span>
        </div>
        {namedMembers > 0 && (
          <div className="flex-1 py-3 flex flex-col items-center">
            <span className="text-xs text-gray-400">徴収済</span>
            <span className={`text-base font-bold ${paidCount === namedMembers ? 'text-green-600' : 'text-gray-700'}`}>
              {paidCount}/{namedMembers}名
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
