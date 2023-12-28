import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  expenseData: [],
  isLoading: false,
  error: null,
};

const expenseDataSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    getExpenseRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    getExpenseSuccess: (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.error = null;
      state.expenseData = action.payload;
    },
    getExpenseFaliure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const selectExpenseData = (state: RootState) =>
  state.expense.expenseData;
export const selectExpenseLoading = (state: RootState) =>
  state.expense.isLoading;
export const selectExpenseError = (state: RootState) => state.expense.error;

export const {getExpenseRequest, getExpenseSuccess, getExpenseFaliure} =
  expenseDataSlice.actions;

export default expenseDataSlice.reducer;
