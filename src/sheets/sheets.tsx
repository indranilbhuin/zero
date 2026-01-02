import {registerSheet, SheetDefinition} from 'react-native-actions-sheet';
import IconPickerSheet from './IconPickerSheet';
import ColorPickerSheet from './ColorPickerSheet';

// Register all sheets
registerSheet('icon-picker-sheet', IconPickerSheet);
registerSheet('color-picker-sheet', ColorPickerSheet);

// Type definitions for sheets
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
  }
}
