/**
 * Shared formatting utilities used across the app.
 */

export const formatCurrency = (amount: number): string => {
  return `Rp ${Math.abs(amount).toLocaleString("id-ID")}`;
};
