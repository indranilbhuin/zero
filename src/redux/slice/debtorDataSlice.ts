import {createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import Debtor from '../../schemas/DebtorSchema';

const initialState = {
  debtorData: [],
};

const debtorDataSlice = createSlice({
  name: 'debtor',
  initialState,
  reducers: {
    setDebtorData: (state, action) => {
      console.log(action.payload);
      state.debtorData = action.payload;
    },
  },
});

export const selectDebtorData = (state: RootState) => state.debtor.debtorData;

export const selectActiveDebtors = createSelector(
  [selectDebtorData],
  debtorData =>
    debtorData.filter((debtor: Debtor) => debtor.debtorStatus === true),
);

export const {setDebtorData} = debtorDataSlice.actions;

export default debtorDataSlice.reducer;
