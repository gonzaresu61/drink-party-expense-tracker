import { useAppStore } from '../store/useAppStore';
import { useSummary } from '../hooks/useSummary';
import { formatCurrency } from '../utils/formatCurrency';
import { ParticipantRow } from './ParticipantRow';
import { AddParticipantForm } from './AddParticipantForm';

const COLOR_HEADER: Record<string, string> = {
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-green-50 text-green-700 border-green-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  pink: 'bg-pink-50 text-pink-700 border-pink-100',
};

export function ParticipantList() {
  const { participants } = useAppStore();
  const summary = useSummary();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">参加者一覧</h2>

      {summary.groupSummaries.length === 0 && participants.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          参加者を追加してください
        </p>
      ) : (
        <div>
          {summary.groupSummaries.map((gs, i) => {
            const color = gs.group?.color ?? 'blue';
            const headerClass = COLOR_HEADER[color] ?? COLOR_HEADER['blue']!;

            return (
              <div key={gs.group?.id ?? `ungrouped-${i}`} className="mb-4">
                <div
                  className={`flex justify-between items-center rounded-lg px-3 py-1.5 border mb-1 ${headerClass}`}
                >
                  <span className="text-xs font-bold">
                    {gs.group ? gs.group.name : 'グループなし'}
                  </span>
                  <span className="text-xs font-semibold">
                    小計: {formatCurrency(gs.subtotal)}
                  </span>
                </div>
                {gs.participants.map((p) => (
                  <ParticipantRow key={p.id} participant={p} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      <AddParticipantForm />
    </div>
  );
}
