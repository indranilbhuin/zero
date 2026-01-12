import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {ExpenseWithCategory, getAllExpensesByUserIdWithCategory} from '../../watermelondb/services';
import {selectUserId} from './userIdSlice';

const expensesAdapter = createEntityAdapter<ExpenseWithCategory>();

const initialState = expensesAdapter.getInitialState({
  isLoading: false,
  error: null as string | null,
});

export const fetchExpenses = createAsyncThunk('expense/fetchAll', async (_, {getState, rejectWithValue}) => {
  try {
    const userId = selectUserId(getState() as RootState);
    const expenses = await getAllExpensesByUserIdWithCategory(userId);
    return expenses;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch expenses');
  }
});

const expenseDataSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    expenseAdded: expensesAdapter.addOne,
    expenseUpdated: expensesAdapter.updateOne,
    expenseRemoved: expensesAdapter.removeOne,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchExpenses.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        expensesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

const expenseSelectors = expensesAdapter.getSelectors<RootState>(state => state.expense);

export const selectExpenseData = expenseSelectors.selectAll;
export const selectExpenseDataById = expenseSelectors.selectById;
export const selectExpenseIds = expenseSelectors.selectIds;
export const selectExpenseEntities = expenseSelectors.selectEntities;
export const selectExpenseTotal = expenseSelectors.selectTotal;

export const selectExpenseLoading = (state: RootState) => state.expense.isLoading;
export const selectExpenseError = (state: RootState) => state.expense.error;

export const {expenseAdded, expenseUpdated, expenseRemoved} = expenseDataSlice.actions;

export default expenseDataSlice.reducer;
