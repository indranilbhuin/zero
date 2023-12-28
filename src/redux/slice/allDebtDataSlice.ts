import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  allDebtData: [],
  isLoading: false,
  error: null,
};

const allDebtDataSlice = createSlice({
  name: 'allDebt',
  initialState,
  reducers: {
    getAllDebtRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    getAllDebtSuccess: (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.error = null;
      state.allDebtData = action.payload;
    },
    getAllDebtFaliure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const selectAllDebtData = (state: RootState) =>
  state.allDebt.allDebtData;
export const selectAllDebtLoading = (state: RootState) =>
  state.allDebt.isLoading;
export const selectAllDebtError = (state: RootState) => state.allDebt.error;

export const {getAllDebtRequest, getAllDebtSuccess, getAllDebtFaliure} =
  allDebtDataSlice.actions;

export default allDebtDataSlice.reducer;
