import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useSummary } from '../hooks/useSummary';
import { formatCurrency } from '../utils/formatCurrency';
import type { Group } from '../types';

const COLOR_CLASSES: Record<string, { badge: string; header: string }> = {
  purple: { badge: 'bg-purple-100 text-purple-700', header: 'text-purple-700' },
  blue: { badge: 'bg-blue-100 text-blue-700', header: 'text-blue-700' },
  green: { badge: 'bg-green-100 text-green-700', header: 'text-green-700' },
  orange: { badge: 'bg-orange-100 text-orange-700', header: 'text-orange-700' },
  pink: { badge: 'bg-pink-100 text-pink-700', header: 'text-pink-700' },
};

interface Props {
  group: Group;
}

export function GroupCard({ group }: Props) {
  const { setBatchAmount, deleteGroup } = useAppStore();
  const summary = useSummary();
  const gs = summary.groupSummaries.find((s) => s.group?.id === group.id);

  const colors = COLOR_CLASSES[group.color] ?? COLOR_CLASSES['blue']!;

  const [batchInput, setBatchInput] = useState(
    group.defaultAmount !== null ? String(group.defaultAmount) : '',
  );

  const handleBatchBlur = () => {
    const val = batchInput.replace(/[^\d]/g, '');
    if (val === '') {
      setBatchAmount(group.id, null);
    } else {
      setBatchAmount(group.id, Number(val));
    }
  };

  const memberCount = gs?.memberCount ?? 0;
  const subtotal = gs?.subtotal ?? 0;
  const average = gs?.average ?? null;
  const suggestedAmount = gs?.suggestedAmount ?? null;
  const showHint =
    suggestedAmount !== null &&
    average !== null &&
    suggestedAmount !== average &&
    memberCount > 0;

  return (
    <div className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
            {group.name}
          </span>
          <span className="text-xs text-gray-400">{memberCount}名</span>
        </div>
        <button
          onClick={() => deleteGroup(group.id)}
          className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
          aria-label="グループ削除"
        >
          ×
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 whitespace-nowrap">一括金額</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={batchInput}
          onChange={(e) => setBatchInput(e.target.value.replace(/[^\d]/g, ''))}
          onBlur={handleBatchBlur}
          placeholder="全員に設定"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
        <span className="text-gray-500 text-xs">円</span>
      </div>

      {memberCount > 0 && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>小計</span>
          <span className={`font-semibold ${colors.header}`}>{formatCurrency(subtotal)}</span>
        </div>
      )}

      {showHint && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-700">
          💡 全員 {formatCurrency(suggestedAmount!)} にすると{' '}
          <span className="font-semibold">{formatCurrency(suggestedAmount! * memberCount)}</span>{' '}
          集まります
        </div>
      )}
    </div>
  );
}
