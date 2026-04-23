export const formatCurrency = (n: number): string =>
  '¥' + n.toLocaleString('ja-JP');

export const formatAmount = (n: number): string => {
  if (Number.isInteger(n)) return '¥' + n.toLocaleString('ja-JP');
  return '¥' + n.toFixed(2);
};

export const withCommas = (raw: string): string =>
  raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
