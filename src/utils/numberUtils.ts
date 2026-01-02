const CURRENCY_DECIMALS: Record<string, number> = {
  JPY: 0,
  KRW: 0,
  VND: 0,
  IDR: 0,
  CLP: 0,
  COP: 0,
  HUF: 0,
  ISK: 0,
  PYG: 0,
  RWF: 0,
  UGX: 0,
  VUV: 0,
  XAF: 0,
  XOF: 0,
  XPF: 0,
  DJF: 0,
  GNF: 0,
  KMF: 0,
  MGA: 0,
  PKR: 0,
  IRR: 0,
  IQD: 0,
  LBP: 0,
  MMK: 0,
  SOS: 0,
  SYP: 0,
  TZS: 0,
  UZS: 0,
  YER: 0,
  ZMK: 0,
  ZWL: 0,
  AFN: 0,
  ALL: 0,
  AMD: 0,
  BHD: 3,
  KWD: 3,
  OMR: 3,
  TND: 3,
  LYD: 3,
  JOD: 3,
};

export const getCurrencyDecimals = (currencyCode?: string): number => {
  if (!currencyCode) return 2;
  return CURRENCY_DECIMALS[currencyCode.toUpperCase()] ?? 2;
};

export const formatNumber = (
  amount: number,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
  } = {},
): string => {
  const {locale = 'en-IN', minimumFractionDigits = 0, maximumFractionDigits = 2, useGrouping = true} = options;

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping,
    }).format(amount);
  } catch {
    return amount.toLocaleString();
  }
};

export const formatCurrency = (amount: number, currencyCode?: string, locale: string = 'en-IN'): string => {
  const maxDecimals = getCurrencyDecimals(currencyCode);

  if (!Number.isFinite(amount)) return '0';

  const isWholeNumber = Number.isInteger(amount);
  const minDecimals = isWholeNumber ? 0 : maxDecimals;

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals,
      useGrouping: true,
    }).format(amount);
  } catch {
    if (isWholeNumber) {
      return amount.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return amount.toFixed(maxDecimals).replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

export const formatWithSymbol = (
  amount: number,
  symbol: string,
  currencyCode?: string,
  locale: string = 'en-IN',
): string => {
  const formattedAmount = formatCurrency(amount, currencyCode, locale);
  return `${symbol}${formattedAmount}`;
};

export const formatCompact = (amount: number, locale: string = 'en'): string => {
  if (!Number.isFinite(amount)) return '0';

  try {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    if (Math.abs(amount) >= 1e9) return `${(amount / 1e9).toFixed(1)}B`;
    if (Math.abs(amount) >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
    if (Math.abs(amount) >= 1e3) return `${(amount / 1e3).toFixed(1)}K`;
    return amount.toString();
  }
};

export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  const cleaned = value.replaceAll(/[^0-9.-]/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const roundCurrency = (amount: number, currencyCode?: string): number => {
  const decimals = getCurrencyDecimals(currencyCode);
  const factor = Math.pow(10, decimals);
  return Math.round(amount * factor) / factor;
};

export const isValidAmount = (amount: unknown): amount is number => {
  return typeof amount === 'number' && Number.isFinite(amount) && !Number.isNaN(amount);
};

export const safeAdd = (...amounts: number[]): number => {
  const sum = amounts.reduce((acc, val) => acc + (val || 0), 0);
  return roundCurrency(sum);
};

export const safeSubtract = (a: number, b: number): number => {
  return roundCurrency((a || 0) - (b || 0));
};
