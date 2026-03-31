import { useAppStore } from '../store/useAppStore';

export function NotesSection() {
  const { party, setNotes } = useAppStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">備考</h2>
      <textarea
        value={party.notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="自由にメモを入力できます"
        rows={4}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none placeholder:text-gray-300"
      />
    </div>
  );
}
