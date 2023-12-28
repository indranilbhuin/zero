export const formatCurrency = (amount: number): string => {
  const formattedAmount = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formattedAmount}`;
};
