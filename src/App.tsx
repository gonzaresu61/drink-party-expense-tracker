import { useState } from 'react';
import { useEventStore } from './store/useEventStore';
import { StatusCard } from './components/StatusCard';
import { EventForm } from './components/EventForm';
import { GroupCalculator } from './components/GroupCalculator';
import { MemberSection } from './components/MemberSection';
import { NotesSection } from './components/NotesSection';
import { ShareFooter } from './components/ShareFooter';

function App() {
  const { event, resetAll } = useEventStore();
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍻</span>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">飲み会会計アプリ</h1>
              {event.title && (
                <p className="text-xs text-gray-400 truncate max-w-[200px]">{event.title}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowReset(true)}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            リセット
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-32 space-y-4">
        <StatusCard />
        <EventForm />
        <GroupCalculator />
        <MemberSection />
        <NotesSection />
      </main>

      <ShareFooter />

      {/* Reset modal */}
      {showReset && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          onClick={() => setShowReset(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-gray-800 mb-2">データをリセットしますか？</h3>
            <p className="text-sm text-gray-500 mb-5">
              すべてのグループ・メンバー・金額が削除されます。この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3 font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={() => { resetAll(); setShowReset(false); }}
                className="flex-1 bg-red-500 text-white rounded-xl py-3 font-semibold"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
