import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { GroupId } from '../types';

export function AddParticipantForm() {
  const { groups, addParticipant } = useAppStore();
  const [name, setName] = useState('');
  const [groupId, setGroupId] = useState<GroupId | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addParticipant(trimmed, groupId || null);
    setName('');
    // Keep selected group for convenience (adding multiple people to same group)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 pt-3 mt-3 border-t border-gray-100"
    >
      {/* Row 1: 参加者名 */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="参加者名"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
      />
      {/* Row 2: グループ + 追加ボタン */}
      <div className="flex gap-2">
        {groups.length > 0 && (
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          >
            <option value="">グループなし</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-indigo-500 text-white rounded-xl px-6 py-2.5 font-semibold disabled:opacity-40 shrink-0"
        >
          追加
        </button>
      </div>
    </form>
  );
}
