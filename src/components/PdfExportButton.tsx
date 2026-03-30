import { useState, createElement } from 'react';
import { useAppStore } from '../store/useAppStore';
import { computeSummary } from '../store/selectors';

export function PdfExportButton() {
  const [loading, setLoading] = useState(false);
  const party = useAppStore((s) => s.party);
  const groups = useAppStore((s) => s.groups);
  const participants = useAppStore((s) => s.participants);
  const state = { party, groups, participants };

  const handleExport = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const [{ pdf }, { PdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./PdfDocument'),
      ]);
      const summary = computeSummary(state);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(
        createElement(PdfDocument, { state, summary }) as any,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const fileName = `${state.party.title || '精算表'}_${state.party.date}.pdf`;
      // Open in new tab (iOS Safari shows native PDF viewer with share sheet)
      window.open(url, '_blank');
      // Also trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDFの生成に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading || state.participants.length === 0}
      className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-300 text-white rounded-2xl py-4 font-semibold text-base transition-colors"
    >
      {loading ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          PDF生成中...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF出力・共有
        </>
      )}
    </button>
  );
}
