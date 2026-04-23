import { useState, useMemo } from 'react';
import { useEventStore } from '../store/useEventStore';
import { compute } from '../store/calculator';
import { formatAmount, formatCurrency } from '../utils/formatCurrency';

function buildTextSummary(state: ReturnType<typeof useEventStore.getState>, calc: ReturnType<typeof compute>): string {
  const { event, groups } = state;
  const lines: string[] = [];

  lines.push(`【${event.title || '飲み会'}】`);
  if (event.date) lines.push(`📅 ${event.date}${event.venue ? `　📍 ${event.venue}` : ''}`);
  lines.push('');
  lines.push('▼ 負担金額');

  for (const g of groups) {
    const pp = calc.perGroup[g.id] ?? 0;
    const label = g.name || 'グループ';
    const amt = formatAmount(pp);
    lines.push(`  ${label}（${g.count}名）　${amt} / 人`);
  }

  lines.push('');
  lines.push(`合計人数: ${calc.totalHeadcount}名`);
  if (calc.total > 0) lines.push(`総額: ${formatCurrency(calc.total)}`);
  if (calc.autoAmount !== null) {
    lines.push(`自動計算: ${formatAmount(calc.autoAmount)} / 人`);
  }

  if (event.notes) {
    lines.push('');
    lines.push(`📝 ${event.notes}`);
  }

  lines.push('');
  lines.push('─ 飲み会会計アプリ ─');
  return lines.join('\n');
}

export function ShareFooter() {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const event = useEventStore((s) => s.event);
  const groups = useEventStore((s) => s.groups);
  const members = useEventStore((s) => s.members);
  const calc = useMemo(() => compute({ event, groups, members }), [event, groups, members]);

  const handleCopy = async () => {
    const text = buildTextSummary({ event, groups, members } as any, calc);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('コピーに失敗しました。\n\n' + text);
    }
  };

  const handlePdf = async () => {
    if (groups.length === 0) return;
    setPdfLoading(true);
    try {
      const [{ pdf }, { PdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./PdfDocument'),
      ]);
      const blob = await pdf(
        <PdfDocument state={{ event, groups, members }} calc={calc} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error(e);
      alert('PDF生成に失敗しました。');
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-10">
      <div className="max-w-lg mx-auto px-4 py-3 safe-bottom flex gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
          }`}
        >
          {copied ? '✓ コピーしました！' : '📋 LINEに送る'}
        </button>
        <button
          type="button"
          onClick={handlePdf}
          disabled={pdfLoading || groups.length === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-40 hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          {pdfLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              生成中...
            </span>
          ) : (
            '📄 PDF'
          )}
        </button>
      </div>
    </div>
  );
}
