import dayjs, {Dayjs} from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(calendar);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localeData);

// Cache locale data - computed once at module load, not on every function call
const MONTHS = dayjs.months();
const MONTHS_SHORT = dayjs.monthsShort();
const WEEKDAYS = dayjs.weekdays();
const WEEKDAYS_SHORT = dayjs.weekdaysShort();
const WEEKDAYS_MIN = dayjs.weekdaysMin();

export type DateInput = string | number | Date | Dayjs | null | undefined;
export type DateUnit =
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'hour'
  | 'minute'
  | 'second';

export const parseDate = (date?: DateInput): Dayjs => {
  return date ? dayjs(date) : dayjs();
};

export const now = (): Dayjs => dayjs();

export const formatDate = (
  date?: DateInput,
  format: string = 'YYYY-MM-DD',
): string => {
  return parseDate(date).format(format);
};

export const getCurrentYear = (): number => dayjs().year();

export const getCurrentMonthName = (): string => dayjs().format('MMMM');

export const getYear = (date: DateInput): number => parseDate(date).year();

export const getMonthName = (date: DateInput): string =>
  parseDate(date).format('MMMM');

export const getDayOfMonth = (date: DateInput): number =>
  parseDate(date).date();

export const getDayOfWeek = (date: DateInput): number => parseDate(date).day();

// Use cached locale data - no array recreation on each call
export const getMonthNames = (): string[] => MONTHS;
export const getMonthNamesShort = (): string[] => MONTHS_SHORT;
export const getWeekdayNames = (): string[] => WEEKDAYS;
export const getWeekdayShortNames = (): string[] => WEEKDAYS_SHORT;
export const getWeekdayNamesMin = (): string[] => WEEKDAYS_MIN;

export const getDaysInMonth = (year: number, month: string): number => {
  const monthIndex = dayjs().month(getMonthIndex(month)).month();
  return dayjs().year(year).month(monthIndex).daysInMonth();
};

// Uses cached MONTHS array for O(N) lookup
export const getMonthIndex = (monthName: string): number => {
  return MONTHS.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
};

export const getMonthNumber = (monthName: string): string => {
  const index = getMonthIndex(monthName);
  return String(index + 1).padStart(2, '0');
};

export const isSameDate = (
  date1: DateInput,
  date2: DateInput,
  unit: DateUnit = 'day',
): boolean => {
  return parseDate(date1).isSame(parseDate(date2), unit);
};

export const diffDates = (
  date1: DateInput,
  date2: DateInput,
  unit: DateUnit = 'day',
): number => {
  return parseDate(date1).diff(parseDate(date2), unit);
};

export const subtractFromDate = (
  date: DateInput,
  amount: number,
  unit: DateUnit,
): Dayjs => {
  return parseDate(date).subtract(amount, unit);
};

export const addToDate = (
  date: DateInput,
  amount: number,
  unit: DateUnit,
): Dayjs => {
  return parseDate(date).add(amount, unit);
};

export const getYesterday = (): Dayjs => dayjs().subtract(1, 'day');

export const formatCalendar = (date: DateInput): string => {
  return parseDate(date).calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'Do MMM YYYY',
  });
};

export const getFirstDayOfMonth = (year: number, month: string): number => {
  const monthNum = getMonthNumber(month);
  return dayjs(`${year}-${monthNum}-01`).day();
};

export const createDateString = (
  year: number,
  month: string,
  day: number,
): string => {
  return dayjs(`${year}-${month}-${day}`, 'YYYY-MMM-D').format('YYYY-MM-DD');
};

export const getTimestamp = (): string => {
  return dayjs().format('YYYYMMDDHHmmss');
};

export const getISODateTime = (): string => {
  return dayjs().format('YYYY-MM-DDTHH:mm:ss');
};

export const sortByDateDesc = <T extends {date: DateInput}>(
  items: T[],
): T[] => {
  return [...items].sort((a, b) => diffDates(b.date, a.date));
};

export const sortByDateAsc = <T extends {date: DateInput}>(items: T[]): T[] => {
  return [...items].sort((a, b) => diffDates(a.date, b.date));
};

export default {
  now,
  parseDate,
  formatDate,
  getCurrentYear,
  getCurrentMonthName,
  getYear,
  getMonthName,
  getDayOfMonth,
  getDayOfWeek,
  getMonthNames,
  getMonthNamesShort,
  getWeekdayNames,
  getWeekdayShortNames,
  getWeekdayNamesMin,
  getDaysInMonth,
  getMonthIndex,
  getMonthNumber,
  isSameDate,
  diffDates,
  subtractFromDate,
  addToDate,
  getYesterday,
  formatCalendar,
  getFirstDayOfMonth,
  createDateString,
  getTimestamp,
  getISODateTime,
  sortByDateDesc,
  sortByDateAsc,
};
