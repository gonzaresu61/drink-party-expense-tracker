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
      className="flex gap-2 pt-3 mt-3 border-t border-gray-100"
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="参加者名"
        className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
      />
      {groups.length > 0 && (
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="border border-gray-200 rounded-xl px-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 max-w-[110px]"
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
        className="bg-indigo-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-40 shrink-0"
      >
        追加
      </button>
    </form>
  );
}
