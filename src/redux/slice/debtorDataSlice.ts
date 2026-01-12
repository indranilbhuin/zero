import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {DebtorData as Debtor, getAllDebtorsByUserId} from '../../watermelondb/services';
import {selectUserId} from './userIdSlice';

const debtorsAdapter = createEntityAdapter<Debtor>();

const initialState = debtorsAdapter.getInitialState({
  isLoading: false,
  error: null as string | null,
});

export const fetchDebtors = createAsyncThunk('debtor/fetchAll', async (_, {getState, rejectWithValue}) => {
  try {
    const userId = selectUserId(getState() as RootState);
    const debtors = await getAllDebtorsByUserId(userId);
    return debtors;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch debtors');
  }
});

const debtorDataSlice = createSlice({
  name: 'debtor',
  initialState,
  reducers: {
    debtorAdded: debtorsAdapter.addOne,
    debtorUpdated: debtorsAdapter.updateOne,
    debtorRemoved: debtorsAdapter.removeOne,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDebtors.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDebtors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        debtorsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchDebtors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

const debtorSelectors = debtorsAdapter.getSelectors<RootState>(state => state.debtor);

export const selectDebtorData = debtorSelectors.selectAll;
export const selectDebtorDataById = debtorSelectors.selectById;
export const selectDebtorIds = debtorSelectors.selectIds;
export const selectDebtorEntities = debtorSelectors.selectEntities;

export const selectDebtorLoading = (state: RootState) => state.debtor.isLoading;
export const selectDebtorError = (state: RootState) => state.debtor.error;

export const selectActiveDebtors = createSelector([selectDebtorData], debtorData =>
  debtorData.filter((debtor: Debtor) => debtor.debtorStatus === true),
);

export const {debtorAdded, debtorUpdated, debtorRemoved} = debtorDataSlice.actions;

export default debtorDataSlice.reducer;
