import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export function PartyInfoForm() {
  const { party, setPartyTitle, setTotalPayment, setPartyMemo } = useAppStore();
  const [amountInput, setAmountInput] = useState(
    party.totalPayment !== null ? String(party.totalPayment) : '',
  );

  const handleAmountBlur = () => {
    const val = amountInput.replace(/[^\d]/g, '');
    if (val === '') {
      setTotalPayment(null);
    } else {
      setTotalPayment(Number(val));
    }
  };

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
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">支払金額（総額）</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value.replace(/[^\d]/g, ''))}
            onBlur={handleAmountBlur}
            placeholder="0"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
          <span className="text-gray-600 font-medium">円</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">メモ（任意）</label>
        <input
          type="text"
          value={party.memo}
          onChange={(e) => setPartyMemo(e.target.value)}
          placeholder="例: お店名、場所など"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
        />
      </div>
    </div>
  );
}
