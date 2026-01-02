import {registerSheet, SheetDefinition} from 'react-native-actions-sheet';
import IconPickerSheet from './IconPickerSheet';
import ColorPickerSheet from './ColorPickerSheet';
import DatePickerSheet from './DatePickerSheet';
import CurrencyPickerSheet from './CurrencyPickerSheet';

registerSheet('icon-picker-sheet', IconPickerSheet);
registerSheet('color-picker-sheet', ColorPickerSheet);
registerSheet('date-picker-sheet', DatePickerSheet);
registerSheet('currency-picker-sheet', CurrencyPickerSheet);

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'icon-picker-sheet': SheetDefinition<{
      payload: {
        selectedIcon?: string;
        onSelect?: (icon: string) => void;
      };
    }>;
    'color-picker-sheet': SheetDefinition<{
      payload: {
        selectedColor?: string;
        onSelect?: (color: string) => void;
      };
    }>;
    'date-picker-sheet': SheetDefinition<{
      payload: {
        selectedDate?: string;
        onSelect?: (date: Date) => void;
      };
    }>;
    'currency-picker-sheet': SheetDefinition<{
      payload: {
        selectedCurrency?: {code: string; name: string; symbol: string};
        onSelect?: (currency: {code: string; name: string; symbol: string}) => void;
      };
    }>;
  }
}
