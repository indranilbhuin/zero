import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {DebtData as Debt, getAllDebtsByUserId} from '../../watermelondb/services';
import {selectUserId} from './userIdSlice';

export interface DebtWithDebtor extends Debt {
  debtor?: {type: string};
}

const allDebtsAdapter = createEntityAdapter<DebtWithDebtor>();

const initialState = allDebtsAdapter.getInitialState({
  isLoading: false,
  error: null as string | null,
});

export const fetchAllDebts = createAsyncThunk('allDebt/fetchAll', async (_, {getState, rejectWithValue}) => {
  try {
    const userId = selectUserId(getState() as RootState);
    const allDebts = await getAllDebtsByUserId(userId);
    return allDebts as DebtWithDebtor[];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch all debts');
  }
});

const allDebtDataSlice = createSlice({
  name: 'allDebt',
  initialState,
  reducers: {
    allDebtAdded: allDebtsAdapter.addOne,
    allDebtUpdated: allDebtsAdapter.updateOne,
    allDebtRemoved: allDebtsAdapter.removeOne,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllDebts.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllDebts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        allDebtsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchAllDebts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

const allDebtSelectors = allDebtsAdapter.getSelectors<RootState>(state => state.allDebt);

export const selectAllDebtData = allDebtSelectors.selectAll;
export const selectAllDebtDataById = allDebtSelectors.selectById;
export const selectAllDebtIds = allDebtSelectors.selectIds;
export const selectAllDebtEntities = allDebtSelectors.selectEntities;

export const selectAllDebtLoading = (state: RootState) => state.allDebt.isLoading;
export const selectAllDebtError = (state: RootState) => state.allDebt.error;

export const {allDebtAdded, allDebtUpdated, allDebtRemoved} = allDebtDataSlice.actions;

export default allDebtDataSlice.reducer;
