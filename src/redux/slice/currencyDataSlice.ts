import {createSlice} from '@reduxjs/toolkit';

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

export const {setCurrencyData} = currencyDataSlice.actions;

export default currencyDataSlice.reducer;
