import { useState } from 'react';
import { useEventStore } from '../store/useEventStore';
import { withCommas, formatCurrency } from '../utils/formatCurrency';
import { computeTotal } from '../store/calculator';

export function EventForm() {
  const event = useEventStore((s) => s.event);
  const setField = useEventStore((s) => s.setEventField);

  const [unitInput, setUnitInput] = useState(event.unitPrice !== null ? String(event.unitPrice) : '');
  const [countInput, setCountInput] = useState(event.attendeeCount !== null ? String(event.attendeeCount) : '');
  const [totalInput, setTotalInput] = useState(event.manualTotal !== null ? String(event.manualTotal) : '');

  const derivedTotal = computeTotal(event);
  const showDerived = event.unitPrice !== null && event.attendeeCount !== null && event.manualTotal === null;
  const unitCountActive = event.unitPrice !== null || event.attendeeCount !== null;
  const manualActive = event.manualTotal !== null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">イベント情報</h2>

      {/* タイトル */}
      <input
        type="text"
        value={event.title}
        onChange={(e) => setField('title', e.target.value)}
        placeholder="イベントタイトル（例: 2026年度 新歓食事会）"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
      />

      {/* 日付・会場 */}
      <div className="flex gap-2">
        <input
          type="date"
          value={event.date}
          onChange={(e) => setField('date', e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
        <input
          type="text"
          value={event.venue}
          onChange={(e) => setField('venue', e.target.value)}
          placeholder="会場・お店名"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
      </div>

      {/* 単価 × 人数 = 総額 */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          料金 計算
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 whitespace-nowrap">1人</span>
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              inputMode="numeric"
              value={withCommas(unitInput)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, '');
                setUnitInput(raw);
                setField('unitPrice', raw ? Number(raw) : null);
                setField('manualTotal', null);
                setTotalInput('');
              }}
              placeholder="0"
              disabled={manualActive}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <span className="text-xs text-gray-400">円</span>
          </div>
          <span className="text-gray-400">×</span>
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              inputMode="numeric"
              value={countInput}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, '');
                setCountInput(raw);
                setField('attendeeCount', raw ? Number(raw) : null);
                setField('manualTotal', null);
                setTotalInput('');
              }}
              placeholder="0"
              disabled={manualActive}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <span className="text-xs text-gray-400">名</span>
          </div>
        </div>
        {showDerived && (
          <div className="mt-1.5 flex justify-end">
            <span className="text-base font-bold text-indigo-600 font-mono">
              = {formatCurrency(derivedTotal)}
            </span>
          </div>
        )}
      </div>

      {/* 総額 直接入力 */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          または総額を直接入力
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={withCommas(totalInput)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, '');
              setTotalInput(raw);
              setField('manualTotal', raw ? Number(raw) : null);
              if (raw) {
                setUnitInput('');
                setCountInput('');
                setField('unitPrice', null);
                setField('attendeeCount', null);
              }
            }}
            placeholder="0"
            disabled={unitCountActive}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <span className="text-gray-600 font-medium">円</span>
        </div>
      </div>
    </div>
  );
}
