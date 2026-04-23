import { useEventStore } from '../store/useEventStore';

export function NotesSection() {
  const notes = useEventStore((s) => s.event.notes);
  const setField = useEventStore((s) => s.setEventField);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">備考</h2>
      <textarea
        value={notes}
        onChange={(e) => setField('notes', e.target.value)}
        placeholder="自由にメモを入力できます"
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none placeholder:text-gray-300"
      />
    </div>
  );
}
