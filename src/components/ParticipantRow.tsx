import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Participant } from '../types';

const COLOR_DOT: Record<string, string> = {
  purple: 'bg-purple-400',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  orange: 'bg-orange-400',
  pink: 'bg-pink-400',
};

const withCommas = (raw: string) =>
  raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

interface Props {
  participant: Participant;
}

export function ParticipantRow({ participant }: Props) {
  const { groups, togglePaid, updateParticipant, deleteParticipant } = useAppStore();
  const group = groups.find((g) => g.id === participant.groupId) ?? null;

  const [amountInput, setAmountInput] = useState(
    participant.amount !== null ? String(participant.amount) : '',
  );

  const handleAmountBlur = () => {
    const val = amountInput.replace(/[^\d]/g, '');
    if (val === '') {
      updateParticipant(participant.id, { amount: null });
    } else {
      updateParticipant(participant.id, { amount: Number(val) });
    }
  };

  // 一括設定など外部からamountが変わったらinputに反映
  useEffect(() => {
    const storeAmountStr = participant.amount !== null ? String(participant.amount) : '';
    setAmountInput(storeAmountStr);
  }, [participant.amount]);

  return (
    <div
      className={`flex items-center gap-2 py-3 px-1 border-b border-gray-50 last:border-b-0 transition-opacity ${
        participant.isPaid ? 'opacity-60' : ''
      }`}
    >
      {/* Paid toggle */}
      <button
        onClick={() => togglePaid(participant.id)}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
          participant.isPaid
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 text-transparent hover:border-green-400'
        }`}
        aria-label={participant.isPaid ? '受け取り済み' : '未受け取り'}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      {/* Group color dot */}
      <div
        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
          group ? (COLOR_DOT[group.color] ?? 'bg-blue-400') : 'bg-gray-200'
        }`}
      />

      {/* Name (editable) + group selector */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <input
          type="text"
          value={participant.name}
          onChange={(e) => updateParticipant(participant.id, { name: e.target.value })}
          placeholder="名前を入力"
          className={`w-full font-medium bg-transparent border-0 border-b border-transparent focus:border-indigo-300 focus:outline-none placeholder:text-gray-300 min-w-0 ${
            participant.isPaid ? 'line-through text-gray-400' : 'text-gray-800'
          }`}
        />
        {groups.length > 0 && (
          <select
            value={participant.groupId ?? ''}
            onChange={(e) =>
              updateParticipant(participant.id, {
                groupId: e.target.value || null,
              })
            }
            className="w-full bg-transparent border-0 text-xs text-gray-400 focus:outline-none p-0 leading-tight"
          >
            <option value="">グループなし</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Amount input */}
      <div className="flex items-center gap-1 shrink-0">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          data-id={participant.id}
          value={withCommas(amountInput)}
          onChange={(e) => setAmountInput(e.target.value.replace(/[^\d]/g, ''))}
          onBlur={handleAmountBlur}
          placeholder="未入力"
          className={`w-24 border rounded-lg px-2 py-1.5 text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
            participant.amount === null
              ? 'border-orange-200 bg-orange-50 text-orange-400 placeholder:text-orange-300'
              : 'border-gray-200 bg-gray-50 text-gray-800'
          }`}
        />
        <span className="text-xs text-gray-400">円</span>
      </div>

      {/* Delete */}
      <button
        onClick={() => deleteParticipant(participant.id)}
        className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
        aria-label="削除"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
