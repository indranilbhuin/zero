import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {DebtorData as DebtorDocType, getDebtorByDebtorId} from '../../watermelondb/services';

interface IndividualDebtorState {
  individualDebtorData: DebtorDocType | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IndividualDebtorState = {
  individualDebtorData: null,
  isLoading: false,
  error: null,
};

export const fetchIndividualDebtor = createAsyncThunk(
  'individualDebtor/fetchById',
  async (debtorId: string, {rejectWithValue}) => {
    try {
      const debtor = await getDebtorByDebtorId(debtorId);
      return debtor;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch debtor');
    }
  },
);

const individualDebtorSlice = createSlice({
  name: 'individualDebtor',
  initialState,
  reducers: {
    clearIndividualDebtor: state => {
      state.individualDebtorData = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchIndividualDebtor.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIndividualDebtor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.individualDebtorData = action.payload;
      })
      .addCase(fetchIndividualDebtor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectIndividualDebtorData = (state: RootState) => state.individualDebtor.individualDebtorData;
export const selectIndividualDebtorLoading = (state: RootState) => state.individualDebtor.isLoading;
export const selectIndividualDebtorError = (state: RootState) => state.individualDebtor.error;

export const {clearIndividualDebtor} = individualDebtorSlice.actions;

export default individualDebtorSlice.reducer;
