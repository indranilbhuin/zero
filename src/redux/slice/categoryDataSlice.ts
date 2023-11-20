import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  categoryData: [],
};

const categoryDataSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryData: (state, action) => {
      console.log(action.payload);
      state.categoryData = action.payload;
    },
  },
});

export const selectCategoryData = (state: RootState) =>
  state.category.categoryData;

export const {setCategoryData} = categoryDataSlice.actions;

export default categoryDataSlice.reducer;
