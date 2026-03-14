import StorageService from './asyncStorageService';
import {getAvailableExpenseYears} from '../watermelondb/services';

const CACHE_KEY = 'available-expense-years';

export const getCachedYears = (): number[] => {
  const raw = StorageService.getItemSync(CACHE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
};

const setCachedYears = (years: number[]): void => {
  StorageService.setItemSync(CACHE_KEY, JSON.stringify(years));
};

export const loadAvailableYears = async (userId: string): Promise<number[]> => {
  const cached = getCachedYears();
  if (cached.length > 0) {
    return cached;
  }
  const years = await getAvailableExpenseYears(userId);
  if (years.length > 0) {
    setCachedYears(years);
  }
  return years;
};

export const ensureYearInCache = (year: number): number[] => {
  const cached = getCachedYears();
  if (!cached.includes(year)) {
    const updated = [...cached, year].sort((a, b) => a - b);
    setCachedYears(updated);
    return updated;
  }
  return cached;
};

export const refreshYearsCache = async (userId: string): Promise<number[]> => {
  const years = await getAvailableExpenseYears(userId);
  setCachedYears(years);
  return years;
};
