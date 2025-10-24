export const PROVIDER_COLORS: Record<string, string> = {
  'Wise': 'green',
  'Nubank': 'purple',
  'Nomad Global': 'blue',
};

export const getProviderColor = (provider?: string): string => {
  return PROVIDER_COLORS[provider || ''] || 'gray';
};