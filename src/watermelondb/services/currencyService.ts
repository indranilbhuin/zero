import {Q} from '@nozbe/watermelondb';
import {nanoid} from 'nanoid';
import {database} from '../database';
import Currency from '../models/Currency';

// Type for currency data
export interface CurrencyData {
  id: string;
  code: string;
  symbol: string;
  name: string;
  userId: string;
}

/**
 * Creates a new currency
 */
export const createCurrency = async (
  code: string,
  symbol: string,
  name: string,
  userId: string,
): Promise<string> => {
  const id = nanoid(24);
  await database.write(async () => {
    await database.get<Currency>('currencies').create(curr => {
      curr._raw.id = id;
      curr.code = code;
      curr.symbol = symbol;
      curr.name = name;
      curr.userId = userId;
    });
  });
  return id;
};

/**
 * Updates a currency by ID
 */
export const updateCurrencyById = async (
  currencyId: string,
  updates: {code?: string; symbol?: string; name?: string},
): Promise<void> => {
  await database.write(async () => {
    const currency = await database.get<Currency>('currencies').find(currencyId);
    await currency.update(curr => {
      if (updates.code !== undefined) {
        curr.code = updates.code;
      }
      if (updates.symbol !== undefined) {
        curr.symbol = updates.symbol;
      }
      if (updates.name !== undefined) {
        curr.name = updates.name;
      }
    });
  });
};

/**
 * Gets a currency by ID
 */
export const getCurrencyById = async (
  currencyId: string,
): Promise<CurrencyData | null> => {
  try {
    const currency = await database.get<Currency>('currencies').find(currencyId);
    return {
      id: currency.id,
      code: currency.code,
      symbol: currency.symbol,
      name: currency.name,
      userId: currency.userId,
    };
  } catch {
    return null;
  }
};

/**
 * Gets currency by user ID
 */
export const getCurrencyByUserId = async (
  userId: string,
): Promise<CurrencyData | null> => {
  const currencies = await database
    .get<Currency>('currencies')
    .query(Q.where('user_id', userId))
    .fetch();

  if (currencies.length === 0) {
    return null;
  }

  const currency = currencies[0];
  return {
    id: currency.id,
    code: currency.code,
    symbol: currency.symbol,
    name: currency.name,
    userId: currency.userId,
  };
};

/**
 * Gets all currencies
 */
export const getAllCurrencies = async (): Promise<CurrencyData[]> => {
  const currencies = await database.get<Currency>('currencies').query().fetch();
  return currencies.map(c => ({
    id: c.id,
    code: c.code,
    symbol: c.symbol,
    name: c.name,
    userId: c.userId,
  }));
};
