export const percentToMoney = (percent: number, amount?: number): string => {
  let value = percent;
  if (amount !== undefined) {
    value = (percent / 100) * amount;
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const getSharpeRatioInterpretation = (sharpeRatio: number): string => {
  if (sharpeRatio < 0.2) return 'Poco eficiente';
  if (sharpeRatio < 0.5) return 'Moderadamente eficiente';
  return 'Muy eficiente';
};
