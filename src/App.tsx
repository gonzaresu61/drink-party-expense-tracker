import { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { PartyInfoForm } from './components/PartyInfoForm';
import { SummaryCard } from './components/SummaryCard';
import { GroupSection } from './components/GroupSection';
import { ParticipantList } from './components/ParticipantList';
import { PdfExportButton } from './components/PdfExportButton';

function App() {
  const { party, resetAll } = useAppStore();
  const [showReset, setShowReset] = useState(false);

  const handleReset = () => {
    resetAll();
    setShowReset(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍻</span>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">飲み会会計アプリ</h1>
              {party.title && (
                <p className="text-xs text-gray-400 truncate max-w-[180px]">{party.title}</p>
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

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 pb-32 pt-4 space-y-4">
        <SummaryCard />
        <PartyInfoForm />
        <GroupSection />
        <ParticipantList />
      </main>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-10">
        <div className="max-w-lg mx-auto px-4 py-3 safe-bottom">
          <PdfExportButton />
        </div>
      </div>

      {/* Reset confirmation modal */}
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
              すべての参加者・グループ・金額が削除されます。この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3 font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={handleReset}
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
