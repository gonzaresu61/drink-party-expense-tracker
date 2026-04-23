import { useState, useRef, useEffect } from 'react';
import { useEventStore } from '../store/useEventStore';
import type { Group, GroupColor } from '../types';
import { withCommas } from '../utils/formatCurrency';

const COLOR_STYLES: Record<GroupColor, { dot: string; ring: string }> = {
  red:    { dot: 'bg-red-400',    ring: 'ring-red-400' },
  orange: { dot: 'bg-orange-400', ring: 'ring-orange-400' },
  amber:  { dot: 'bg-amber-400',  ring: 'ring-amber-400' },
  green:  { dot: 'bg-green-400',  ring: 'ring-green-400' },
  teal:   { dot: 'bg-teal-400',   ring: 'ring-teal-400' },
  blue:   { dot: 'bg-blue-400',   ring: 'ring-blue-400' },
  purple: { dot: 'bg-purple-400', ring: 'ring-purple-400' },
  pink:   { dot: 'bg-pink-400',   ring: 'ring-pink-400' },
};
const ALL_COLORS = Object.keys(COLOR_STYLES) as GroupColor[];

interface Props {
  group: Group;
  autoAmount: number | null;
}

export function GroupRow({ group, autoAmount }: Props) {
  const { updateGroup, deleteGroup } = useEventStore();
  const [showColors, setShowColors] = useState(false);
  const [amountInput, setAmountInput] = useState(
    group.fixedAmount !== null ? String(group.fixedAmount) : '',
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  const cs = COLOR_STYLES[group.color] ?? COLOR_STYLES.blue;

  // 外側クリックでカラーピッカーを閉じる
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowColors(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAmountBlur = () => {
    const raw = amountInput.replace(/[^\d]/g, '');
    updateGroup(group.id, { fixedAmount: raw ? Number(raw) : null });
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 space-y-2">
      {/* Row 1: カラードット + 名前 + 削除 */}
      <div className="flex items-center gap-2">
        {/* カラーピッカー */}
        <div className="relative shrink-0" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setShowColors((v) => !v)}
            className={`w-8 h-8 rounded-full ${cs.dot} ring-2 ring-offset-1 ${cs.ring} transition-transform active:scale-90`}
            aria-label="色を選択"
          />
          {showColors && (
            <div className="absolute left-0 top-10 z-20 bg-white border border-gray-200 rounded-xl p-2 shadow-lg grid grid-cols-4 gap-1.5 w-28">
              {ALL_COLORS.map((c) => {
                const s = COLOR_STYLES[c]!;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { updateGroup(group.id, { color: c }); setShowColors(false); }}
                    className={`w-6 h-6 rounded-full ${s.dot} ${group.color === c ? `ring-2 ring-offset-1 ${s.ring}` : ''}`}
                  />
                );
              })}
            </div>
          )}
        </div>

        <input
          type="text"
          value={group.name}
          onChange={(e) => updateGroup(group.id, { name: e.target.value })}
          placeholder="グループ名（例: 1年生）"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />

        <button
          type="button"
          onClick={() => deleteGroup(group.id)}
          className="shrink-0 text-gray-300 hover:text-red-400 transition-colors p-1"
          aria-label="削除"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Row 2: 人数 + 固定/自動 + 金額 */}
      <div className="flex items-center gap-2">
        {/* 人数 */}
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="text"
            inputMode="numeric"
            value={group.count > 0 ? String(group.count) : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '');
              updateGroup(group.id, { count: raw ? Number(raw) : 0 });
            }}
            placeholder="0"
            className="w-16 border border-gray-200 rounded-xl px-2 py-2 text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <span className="text-sm text-gray-500">名</span>
        </div>

        {/* 固定 / 自動 トグル */}
        <div className="flex bg-gray-200 rounded-full p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => updateGroup(group.id, { amountMode: 'fixed' })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              group.amountMode === 'fixed'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            固定
          </button>
          <button
            type="button"
            onClick={() => updateGroup(group.id, { amountMode: 'auto' })}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              group.amountMode === 'auto'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            自動
          </button>
        </div>

        {/* 金額（固定=入力、自動=計算結果表示） */}
        <div className="flex items-center gap-1 flex-1 justify-end">
          {group.amountMode === 'fixed' ? (
            <>
              <input
                type="text"
                inputMode="numeric"
                value={withCommas(amountInput)}
                onChange={(e) => setAmountInput(e.target.value.replace(/[^\d]/g, ''))}
                onBlur={handleAmountBlur}
                placeholder="金額"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
              <span className="text-sm text-gray-500 shrink-0">円</span>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-indigo-600 font-mono">
                {autoAmount !== null
                  ? (Number.isInteger(autoAmount)
                      ? `¥${autoAmount.toLocaleString('ja-JP')}`
                      : `¥${autoAmount.toFixed(2)}`)
                  : '—'}
              </span>
              <span className="text-sm text-gray-400">/ 人</span>
            </div>
          )}
        </div>
      </div>

      {/* 小計 */}
      {group.count > 0 && (group.amountMode === 'fixed' ? group.fixedAmount !== null : autoAmount !== null) && (
        <div className="text-right text-xs text-gray-400">
          小計:{' '}
          <span className="font-semibold text-gray-600">
            {(() => {
              const pp = group.amountMode === 'fixed' ? (group.fixedAmount ?? 0) : (autoAmount ?? 0);
              const sub = pp * group.count;
              return Number.isInteger(sub)
                ? `¥${sub.toLocaleString('ja-JP')}`
                : `¥${sub.toFixed(2)}`;
            })()}
          </span>
        </div>
      )}
    </div>
  );
}
