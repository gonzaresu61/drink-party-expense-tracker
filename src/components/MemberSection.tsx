import { useMemo, useState } from 'react';
import { useEventStore } from '../store/useEventStore';
import { compute } from '../store/calculator';
import { MemberRow } from './MemberRow';
import type { Group } from '../types';

const COLOR_DOT: Record<string, string> = {
  red: 'bg-red-400', orange: 'bg-orange-400', amber: 'bg-amber-400',
  green: 'bg-green-400', teal: 'bg-teal-400', blue: 'bg-blue-400',
  purple: 'bg-purple-400', pink: 'bg-pink-400',
};

function GroupMemberBlock({ group, perGroupAmount }: { group: Group; perGroupAmount: number }) {
  const { members, addMember, addMembersForGroup } = useEventStore();
  const [open, setOpen] = useState(false);
  const groupMembers = members.filter((m) => m.groupId === group.id);
  const paidCount = groupMembers.filter((m) => m.isPaid).length;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* ヘッダー */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full shrink-0 ${COLOR_DOT[group.color] ?? 'bg-gray-400'}`} />
          <span className="text-sm font-semibold text-gray-700">
            {group.name || 'グループ名未設定'}
          </span>
          <span className="text-xs text-gray-400">{group.count}名</span>
        </div>
        <div className="flex items-center gap-2">
          {groupMembers.length > 0 && (
            <span className={`text-xs font-semibold ${paidCount === groupMembers.length ? 'text-green-600' : 'text-gray-500'}`}>
              {paidCount}/{groupMembers.length}名済
            </span>
          )}
          <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-3 py-2">
          {groupMembers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">メンバー未登録</p>
          ) : (
            groupMembers.map((m, idx) => (
              <MemberRow key={m.id} member={m} amount={perGroupAmount} index={idx + 1} />
            ))
          )}

          {/* ボタン群 */}
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => addMember(group.id)}
              className="flex-1 text-xs text-indigo-500 border border-indigo-200 rounded-lg py-2 hover:bg-indigo-50 transition-colors"
            >
              ＋ 1人追加
            </button>
            {groupMembers.length < group.count && (
              <button
                type="button"
                onClick={() => addMembersForGroup(group.id, group.count)}
                className="flex-1 text-xs text-indigo-500 border border-indigo-200 rounded-lg py-2 hover:bg-indigo-50 transition-colors"
              >
                {group.count}名分まとめて追加
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function MemberSection() {
  const event = useEventStore((s) => s.event);
  const groups = useEventStore((s) => s.groups);
  const members = useEventStore((s) => s.members);
  const calc = useMemo(() => compute({ event, groups, members }), [event, groups, members]);

  if (groups.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          徴収管理（任意）
        </h2>
        <span className="text-xs text-gray-400">▼ タップで展開</span>
      </div>

      {groups.map((g) => (
        <GroupMemberBlock
          key={g.id}
          group={g}
          perGroupAmount={calc.perGroup[g.id] ?? 0}
        />
      ))}
    </div>
  );
}
