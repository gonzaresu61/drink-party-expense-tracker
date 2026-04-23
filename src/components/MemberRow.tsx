import { useEventStore } from '../store/useEventStore';
import type { Member } from '../types';
import { formatAmount } from '../utils/formatCurrency';

interface Props {
  member: Member;
  amount: number;
}

export function MemberRow({ member, amount }: Props) {
  const { updateMember, deleteMember, togglePaid } = useEventStore();

  return (
    <div className={`flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 ${member.isPaid ? 'opacity-60' : ''}`}>
      {/* 支払いトグル */}
      <button
        type="button"
        onClick={() => togglePaid(member.id)}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          member.isPaid
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 text-transparent hover:border-green-400'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      {/* 名前 */}
      <input
        type="text"
        value={member.name}
        onChange={(e) => updateMember(member.id, { name: e.target.value })}
        placeholder="名前を入力"
        className={`flex-1 bg-transparent border-0 border-b border-transparent focus:border-indigo-300 focus:outline-none placeholder:text-gray-300 min-w-0 ${
          member.isPaid ? 'line-through text-gray-400' : 'text-gray-700'
        }`}
      />

      {/* 金額 */}
      <span className="text-sm font-mono text-gray-500 shrink-0">
        {formatAmount(amount)}
      </span>

      {/* 削除 */}
      <button
        type="button"
        onClick={() => deleteMember(member.id)}
        className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
