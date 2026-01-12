import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {DebtData as Debt, getAllDebtsByUserIdAndDebtorId} from '../../watermelondb/services';
import {selectUserId} from './userIdSlice';

const debtsAdapter = createEntityAdapter<Debt>();

const initialState = debtsAdapter.getInitialState({
  isLoading: false,
  error: null as string | null,
});

export const fetchDebtsByDebtor = createAsyncThunk(
  'debt/fetchByDebtor',
  async (debtorId: string, {getState, rejectWithValue}) => {
    try {
      const userId = selectUserId(getState() as RootState);
      const debts = await getAllDebtsByUserIdAndDebtorId(userId, debtorId);
      return debts;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch debts');
    }
  },
);

const debtDataSlice = createSlice({
  name: 'debt',
  initialState,
  reducers: {
    debtAdded: debtsAdapter.addOne,
    debtUpdated: debtsAdapter.updateOne,
    debtRemoved: debtsAdapter.removeOne,
    clearDebts: state => {
      debtsAdapter.removeAll(state);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDebtsByDebtor.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDebtsByDebtor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        debtsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchDebtsByDebtor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

const debtSelectors = debtsAdapter.getSelectors<RootState>(state => state.debt);

export const selectDebtData = debtSelectors.selectAll;
export const selectDebtDataById = debtSelectors.selectById;
export const selectDebtIds = debtSelectors.selectIds;
export const selectDebtEntities = debtSelectors.selectEntities;

export const selectDebtLoading = (state: RootState) => state.debt.isLoading;
export const selectDebtError = (state: RootState) => state.debt.error;

export const {debtAdded, debtUpdated, debtRemoved, clearDebts} = debtDataSlice.actions;

export default debtDataSlice.reducer;
