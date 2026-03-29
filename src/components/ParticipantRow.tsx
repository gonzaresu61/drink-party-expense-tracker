import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Participant } from '../types';

const COLOR_BADGE: Record<string, string> = {
  purple: 'bg-purple-100 text-purple-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  pink: 'bg-pink-100 text-pink-600',
};

interface Props {
  participant: Participant;
}

export function ParticipantRow({ participant }: Props) {
  const { groups, togglePaid, updateParticipant, deleteParticipant } = useAppStore();
  const group = groups.find((g) => g.id === participant.groupId) ?? null;
  const badgeClass = group ? (COLOR_BADGE[group.color] ?? COLOR_BADGE['blue']!) : '';

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

  // Sync if amount changes externally (e.g. batch set)
  const storeAmount = participant.amount;
  const storeAmountStr = storeAmount !== null ? String(storeAmount) : '';
  // Only sync if the input is not currently focused
  if (amountInput !== storeAmountStr && document.activeElement?.getAttribute('data-id') !== participant.id) {
    setAmountInput(storeAmountStr);
  }

  return (
    <div
      className={`flex items-center gap-3 py-3 px-1 border-b border-gray-50 last:border-b-0 transition-opacity ${
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

      {/* Name */}
      <span className={`flex-1 text-sm font-medium text-gray-800 truncate ${participant.isPaid ? 'line-through text-gray-400' : ''}`}>
        {participant.name}
      </span>

      {/* Group badge */}
      {group && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${badgeClass}`}>
          {group.name}
        </span>
      )}

      {/* Amount input */}
      <div className="flex items-center gap-1 shrink-0">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          data-id={participant.id}
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value.replace(/[^\d]/g, ''))}
          onBlur={handleAmountBlur}
          placeholder="未入力"
          className={`w-24 border rounded-lg px-2 py-1.5 text-sm text-right font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
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
