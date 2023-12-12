import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  expenseData: [],
  isLoading: false,
  error: null,
};

const everydayExpenseDataSlice = createSlice({
  name: 'everydayExpense',
  initialState,
  reducers: {
    getEverydayExpenseRequest: (state, _id) => {
      state.isLoading = true;
      state.error = null;
    },
    getEverydayExpenseSuccess: (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.error = null;
      state.expenseData = action.payload;
    },
    getEverydayExpenseFaliure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const selectEverydayExpenseData = (state: RootState) =>
  state.everydayExpense.expenseData;
export const selectEverydayExpenseLoading = (state: RootState) =>
  state.everydayExpense.isLoading;
export const selectEverydayExpenseError = (state: RootState) =>
  state.everydayExpense.error;

export const {
  getEverydayExpenseRequest,
  getEverydayExpenseSuccess,
  getEverydayExpenseFaliure,
} = everydayExpenseDataSlice.actions;

export default everydayExpenseDataSlice.reducer;
