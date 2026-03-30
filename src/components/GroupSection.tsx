import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { GroupCard } from './GroupCard';
import type { GroupColor } from '../types';

const COLORS: { value: GroupColor; bg: string; label: string }[] = [
  { value: 'purple', bg: 'bg-purple-500', label: '紫' },
  { value: 'blue', bg: 'bg-blue-500', label: '青' },
  { value: 'green', bg: 'bg-green-500', label: '緑' },
  { value: 'orange', bg: 'bg-orange-400', label: '橙' },
  { value: 'pink', bg: 'bg-pink-400', label: 'ピンク' },
];

export function GroupSection() {
  const { groups, addGroup } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState<GroupColor>('blue');

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    addGroup(name, newColor);
    setNewName('');
    setNewColor('blue');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">グループ管理</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-indigo-600 text-sm font-semibold flex items-center gap-1"
          >
            <span className="text-lg leading-none">+</span> グループ追加
          </button>
        )}
      </div>

      {groups.length === 0 && !isAdding && (
        <p className="text-sm text-gray-400 text-center py-2">
          グループを追加すると一括で金額を設定できます
        </p>
      )}

      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}

      {isAdding && (
        <div className="border border-indigo-200 rounded-xl p-3 space-y-3 bg-indigo-50/30">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="グループ名（例: 1年生）"
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <div>
            <p className="text-xs text-gray-500 mb-2">バッジの色</p>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setNewColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.bg} border-2 transition-all ${
                    newColor === c.value ? 'border-gray-700 scale-110' : 'border-transparent'
                  }`}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-2 text-sm font-semibold disabled:opacity-40"
            >
              追加
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewName('');
              }}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2 text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
