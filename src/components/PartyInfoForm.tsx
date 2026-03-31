import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const withCommas = (raw: string) =>
  raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

export function PartyInfoForm() {
  const { party, setPartyTitle, setTotalPayment, setHeadcount, setPartyMemo, syncParticipantsByHeadcount } = useAppStore();
  const [amountInput, setAmountInput] = useState(
    party.totalPayment !== null ? String(party.totalPayment) : '',
  );
  const [headcountInput, setHeadcountInput] = useState(
    party.headcount !== null ? String(party.headcount) : '',
  );

  const handleAmountBlur = () => {
    const val = amountInput.replace(/[^\d]/g, '');
    if (val === '') {
      setTotalPayment(null);
    } else {
      setTotalPayment(Number(val));
    }
  };

  const handleHeadcountBlur = () => {
    const val = headcountInput.replace(/[^\d]/g, '');
    if (val === '' || val === '0') {
      setHeadcount(null);
    } else {
      const n = Number(val);
      setHeadcount(n);
      syncParticipantsByHeadcount(n);
    }
  };

  const perPerson =
    party.totalPayment !== null && party.headcount !== null && party.headcount > 0
      ? Math.ceil(party.totalPayment / party.headcount)
      : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">会の情報</h2>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">タイトル</label>
        <input
          type="text"
          value={party.title}
          onChange={(e) => setPartyTitle(e.target.value)}
          placeholder="例: 2026年度 歓迎会"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">支払金額（総額）</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={withCommas(amountInput)}
            onChange={(e) => setAmountInput(e.target.value.replace(/[^\d]/g, ''))}
            onBlur={handleAmountBlur}
            placeholder="0"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
          <span className="text-gray-600 font-medium">円</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">人数（割り勘計算用）</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={headcountInput}
            onChange={(e) => setHeadcountInput(e.target.value.replace(/[^\d]/g, ''))}
            onBlur={handleHeadcountBlur}
            placeholder="0"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
          <span className="text-gray-600 font-medium">名</span>
        </div>
        {perPerson !== null && (
          <div className="mt-2 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2">
            <span className="text-sm text-indigo-600 font-medium">1人あたり（切り上げ）</span>
            <span className="text-lg font-bold text-indigo-700 font-mono">
              ¥{perPerson.toLocaleString('ja-JP')}
            </span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">メモ（任意）</label>
        <input
          type="text"
          value={party.memo}
          onChange={(e) => setPartyMemo(e.target.value)}
          placeholder="例: お店名、場所など"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
      </div>
    </div>
  );
}
