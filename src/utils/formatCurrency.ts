const formatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
});

export const formatCurrency = (amount: number): string =>
  formatter.format(amount);

export const formatNumber = (amount: number): string =>
  new Intl.NumberFormat('ja-JP').format(amount);
