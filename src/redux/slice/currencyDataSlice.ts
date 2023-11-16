import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  currencyId: '',
  currencyName: '',
  currencyCode: '',
  currencySymbol: '',
};

const currencyDataSlice = createSlice({
  name: 'currencyData',
  initialState,
  reducers: {
    setCurrencyData: (state, action) => {
      console.log(action.payload);
      state.currencyId = action.payload.currencyId;
      state.currencyName = action.payload.currencyName;
      state.currencyCode = action.payload.currencyCode;
      state.currencySymbol = action.payload.currencySymbol;
    },
  },
});

export const selectCurrencyId = (state: RootState) =>
  state.currencyData.currencyId;
export const selectCurrencyName = (state: RootState) =>
  state.currencyData.currencyName;
export const selectCurrencyCode = (state: RootState) =>
  state.currencyData.currencyCode;
export const selectCurrencySymbol = (state: RootState) =>
  state.currencyData.currencySymbol;

export const {setCurrencyData} = currencyDataSlice.actions;

export default currencyDataSlice.reducer;
