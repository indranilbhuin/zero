import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {DebtorData as DebtorDocType} from '../../watermelondb/services';

interface IndividualDebtorState {
  individualDebtorData: DebtorDocType | null;
  isLoading: boolean;
  error: unknown;
}

const initialState: IndividualDebtorState = {
  individualDebtorData: null,
  isLoading: false,
  error: null,
};

const individualDebtorSlice = createSlice({
  name: 'individualDebtor',
  initialState,
  reducers: {
    getIndividualDebtorRequest: (state, _debtorId: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    getIndividualDebtorSuccess: (
      state,
      action: PayloadAction<DebtorDocType | null>,
    ) => {
      console.log(action.payload);
      state.isLoading = false;
      state.error = null;
      state.individualDebtorData = action.payload;
    },
    getIndividualDebtorFaliure: (state, action: PayloadAction<unknown>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const selectIndividualDebtorData = (state: RootState) =>
  state.individualDebtor.individualDebtorData;
export const selectIndividualDebtorLoading = (state: RootState) =>
  state.individualDebtor.isLoading;
export const selectIndividualDebtorError = (state: RootState) =>
  state.individualDebtor.error;

export const {
  getIndividualDebtorRequest,
  getIndividualDebtorSuccess,
  getIndividualDebtorFaliure,
} = individualDebtorSlice.actions;

export default individualDebtorSlice.reducer;
