import { useSummary } from '../hooks/useSummary';
import { formatCurrency } from '../utils/formatCurrency';

export function SummaryCard() {
  const summary = useSummary();
  const { totalPayment, totalCollected, balance, unentered, paidCount, totalCount } = summary;

  const isShortfall = balance > 0;
  const isSurplus = balance < 0;
  const isEven = balance === 0 && totalCount > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 pt-4 pb-3 space-y-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">精算サマリー</h2>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">支払合計</span>
          <span className="font-semibold text-gray-800 font-mono">
            {totalPayment > 0 ? formatCurrency(totalPayment) : '—'}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">徴収合計</span>
          <span className="font-semibold text-gray-800 font-mono">
            {formatCurrency(totalCollected)}
          </span>
        </div>
      </div>

      <div
        className={`mx-4 mb-4 rounded-xl px-4 py-3 ${
          isShortfall
            ? 'bg-red-50 border border-red-200'
            : isSurplus
            ? 'bg-green-50 border border-green-200'
            : isEven
            ? 'bg-blue-50 border border-blue-200'
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        {totalCount === 0 ? (
          <p className="text-center text-sm text-gray-400">参加者を追加してください</p>
        ) : isEven ? (
          <div className="flex justify-between items-center">
            <span className="text-blue-700 font-semibold">ちょうど！</span>
            <span className="text-blue-700 font-bold text-xl font-mono">¥0</span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isShortfall ? (
                <span className="text-xl">✗</span>
              ) : (
                <span className="text-xl">✓</span>
              )}
              <span
                className={`font-semibold text-base ${
                  isShortfall ? 'text-red-700' : 'text-green-700'
                }`}
              >
                {isShortfall ? '不足' : '余剰'}
              </span>
            </div>
            <span
              className={`font-bold text-2xl font-mono ${
                isShortfall ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {isShortfall ? '-' : '+'}
              {formatCurrency(Math.abs(balance))}
            </span>
          </div>
        )}
      </div>

      <div className="flex divide-x divide-gray-100 border-t border-gray-100">
        <div className="flex-1 py-3 flex flex-col items-center">
          <span className="text-xs text-gray-400">参加者</span>
          <span className="text-base font-bold text-gray-700">{totalCount}名</span>
        </div>
        <div className="flex-1 py-3 flex flex-col items-center">
          <span className="text-xs text-gray-400">徴収済</span>
          <span className={`text-base font-bold ${paidCount === totalCount && totalCount > 0 ? 'text-green-600' : 'text-gray-700'}`}>
            {paidCount}/{totalCount}名
          </span>
        </div>
        <div className="flex-1 py-3 flex flex-col items-center">
          <span className="text-xs text-gray-400">未入力</span>
          <span className={`text-base font-bold ${unentered > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
            {unentered > 0 ? `${unentered}名` : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
