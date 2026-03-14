import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {getCurrentYear} from '../../utils/dateUtils';

interface MonthSelection {
  monthIndex: number;
  year: number;
}

const monthSelectionSlice = createSlice({
  name: 'monthSelection',
  initialState: {
    monthIndex: new Date().getMonth(),
    year: getCurrentYear(),
  } as MonthSelection,
  reducers: {
    setMonthSelection: (state, action: PayloadAction<MonthSelection>) => {
      state.monthIndex = action.payload.monthIndex;
      state.year = action.payload.year;
    },
  },
});

export const selectMonthIndex = (state: RootState) => state.monthSelection.monthIndex;
export const selectYear = (state: RootState) => state.monthSelection.year;

export const {setMonthSelection} = monthSelectionSlice.actions;

export default monthSelectionSlice.reducer;
