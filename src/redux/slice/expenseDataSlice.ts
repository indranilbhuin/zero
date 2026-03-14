import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {ExpenseWithCategory, getAllExpensesByUserIdWithCategory, getAllExpensesByMonth} from '../../watermelondb/services';
import {selectUserId} from './userIdSlice';

const expensesAdapter = createEntityAdapter<ExpenseWithCategory>();

const initialState = expensesAdapter.getInitialState({
  isLoading: false,
  error: null as string | null,
  cachedYearMonth: null as string | null,
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

export const fetchExpensesByMonth = createAsyncThunk(
  'expense/fetchByMonth',
  async (yearMonth: string, {getState, rejectWithValue}) => {
    const state = getState() as RootState;
    if (state.expense.cachedYearMonth === yearMonth) {
      return null;
    }
    try {
      const userId = selectUserId(state);
      const expenses = await getAllExpensesByMonth(userId, yearMonth);
      return {expenses, yearMonth};
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch expenses');
    }
  },
);

const expenseDataSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    expenseAdded: expensesAdapter.addOne,
    expenseUpdated: expensesAdapter.updateOne,
    expenseRemoved: expensesAdapter.removeOne,
    invalidateExpenseCache: state => {
      state.cachedYearMonth = null;
    },
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
        state.cachedYearMonth = null;
        expensesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExpensesByMonth.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByMonth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload !== null) {
          state.cachedYearMonth = action.payload.yearMonth;
          expensesAdapter.setAll(state, action.payload.expenses);
        }
      })
      .addCase(fetchExpensesByMonth.rejected, (state, action) => {
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
export const selectCachedYearMonth = (state: RootState) => state.expense.cachedYearMonth;

export const {expenseAdded, expenseUpdated, expenseRemoved, invalidateExpenseCache} = expenseDataSlice.actions;

export default expenseDataSlice.reducer;
