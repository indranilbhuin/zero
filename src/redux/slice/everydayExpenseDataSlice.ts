import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {ExpenseWithCategory, getAllExpensesByDate, getAllExpensesByCategoryAndMonth} from '../../watermelondb/services';
import {selectUserId} from './userIdSlice';

const everydayExpensesAdapter = createEntityAdapter<ExpenseWithCategory>();

const initialState = everydayExpensesAdapter.getInitialState({
  isLoading: false,
  error: null as string | null,
});

export const fetchEverydayExpenses = createAsyncThunk(
  'everydayExpense/fetchByDate',
  async (date: string, {getState, rejectWithValue}) => {
    try {
      const userId = selectUserId(getState() as RootState);
      const expenses = await getAllExpensesByDate(userId, date);
      return expenses;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch everyday expenses');
    }
  },
);

export const fetchExpensesByCategory = createAsyncThunk(
  'everydayExpense/fetchByCategory',
  async ({categoryId, yearMonth}: {categoryId: string; yearMonth: string}, {getState, rejectWithValue}) => {
    try {
      const userId = selectUserId(getState() as RootState);
      const expenses = await getAllExpensesByCategoryAndMonth(userId, categoryId, yearMonth);
      return expenses;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch category expenses');
    }
  },
);

const everydayExpenseDataSlice = createSlice({
  name: 'everydayExpense',
  initialState,
  reducers: {
    everydayExpenseAdded: everydayExpensesAdapter.addOne,
    everydayExpenseUpdated: everydayExpensesAdapter.updateOne,
    everydayExpenseRemoved: everydayExpensesAdapter.removeOne,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEverydayExpenses.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEverydayExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        everydayExpensesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchEverydayExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchExpensesByCategory.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpensesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        everydayExpensesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchExpensesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

const everydayExpenseSelectors = everydayExpensesAdapter.getSelectors<RootState>(state => state.everydayExpense);

export const selectEverydayExpenseData = everydayExpenseSelectors.selectAll;
export const selectEverydayExpenseDataById = everydayExpenseSelectors.selectById;
export const selectEverydayExpenseIds = everydayExpenseSelectors.selectIds;
export const selectEverydayExpenseEntities = everydayExpenseSelectors.selectEntities;

export const selectEverydayExpenseLoading = (state: RootState) => state.everydayExpense.isLoading;
export const selectEverydayExpenseError = (state: RootState) => state.everydayExpense.error;

export const {everydayExpenseAdded, everydayExpenseUpdated, everydayExpenseRemoved} = everydayExpenseDataSlice.actions;

export default everydayExpenseDataSlice.reducer;
