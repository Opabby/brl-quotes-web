export const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(4)}`;
};

export const formatTimestamp = (timestamp?: string): string => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });
};

export const formatPercentage = (value: number): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};