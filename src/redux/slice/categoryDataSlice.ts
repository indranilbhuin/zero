import {createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import Category from '../../schemas/CategorySchema';

const initialState = {
  categoryData: [],
};

const categoryDataSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryData: (state, action) => {
      console.log("hhhh", action.payload);
      state.categoryData = action.payload;
    },
  },
});

export const selectCategoryData = (state: RootState) =>
  state.category.categoryData || [];

export const selectActiveCategories = createSelector(
  [selectCategoryData],
  categoryData =>
    categoryData.filter(
      (category: Category) => category.categoryStatus === true,
    ),
);

export const {setCategoryData} = categoryDataSlice.actions;

export default categoryDataSlice.reducer;
