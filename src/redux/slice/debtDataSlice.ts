import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  debtData: [],
  isLoading: false,
  error: null,
};

const debtDataSlice = createSlice({
  name: 'debt',
  initialState,
  reducers: {
    getDebtRequest: (state, _debtorId) => {
      state.isLoading = true;
      state.error = null;
    },
    getDebtSuccess: (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.error = null;
      state.debtData = action.payload;
    },
    getDebtFaliure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const selectDebtData = (state: RootState) => state.debt.debtData;
export const selectDebtLoading = (state: RootState) => state.debt.isLoading;
export const selectDebtError = (state: RootState) => state.debt.error;

export const {getDebtRequest, getDebtSuccess, getDebtFaliure} =
  debtDataSlice.actions;

export default debtDataSlice.reducer;
