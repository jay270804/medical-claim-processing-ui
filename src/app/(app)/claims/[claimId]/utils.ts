// Helper functions for consistent value formatting
export const formatValue = (value: any, formatter?: (val: any) => string): string => {
  if (value === null || value === undefined) return 'N/A';
  if (formatter) return formatter(value);
  return value.toString();
};

export const formatCurrency = (amount: number | null | undefined, currency: string = 'USD'): string => {
  if (amount === null || amount === undefined) return 'N/A';
  return `${currency} ${amount.toFixed(2)}`;
};

export const formatDate = (date: string | null | undefined): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};