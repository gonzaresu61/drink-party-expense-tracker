import { useMemo } from 'react';
import { useEventStore } from '../store/useEventStore';
import { compute } from '../store/calculator';
import { GroupRow } from './GroupRow';
import { CalcBreakdown } from './CalcBreakdown';

export function GroupCalculator() {
  const event = useEventStore((s) => s.event);
  const groups = useEventStore((s) => s.groups);
  const members = useEventStore((s) => s.members);
  const addGroup = useEventStore((s) => s.addGroup);

  const calc = useMemo(() => compute({ event, groups, members }), [event, groups, members]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">グループ別金額設定</h2>
        <span className="text-xs text-gray-400">固定 = 手動入力　自動 = 計算</span>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <p className="text-sm">グループをまだ追加していません</p>
          <p className="text-xs mt-1">「＋ グループ追加」から追加してください</p>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((g) => (
            <GroupRow
              key={g.id}
              group={g}
              autoAmount={calc.autoAmount}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addGroup}
        className="w-full border-2 border-dashed border-indigo-200 text-indigo-500 rounded-2xl py-3 text-sm font-semibold hover:bg-indigo-50 transition-colors active:bg-indigo-100"
      >
        ＋ グループ追加
      </button>

      <CalcBreakdown groups={groups} calc={calc} />
    </div>
  );
}
