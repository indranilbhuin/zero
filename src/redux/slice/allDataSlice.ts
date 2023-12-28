import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

const allDataSlice = createSlice({
  name: 'allData',
  initialState,
  reducers: {
    getAllDataRequest: state => {
      state.isLoading = true;
      state.error = null;
    },
    getAllDataSuccess: (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.error = null;
      state.data = action.payload;
    },
    getAllDataFaliure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const selectAllData = (state: RootState) => state.allData.data;
export const selectAllDataLoading = (state: RootState) =>
  state.allData.isLoading;
export const selectAllDataError = (state: RootState) => state.allData.error;

export const {getAllDataRequest, getAllDataSuccess, getAllDataFaliure} =
  allDataSlice.actions;

export default allDataSlice.reducer;
