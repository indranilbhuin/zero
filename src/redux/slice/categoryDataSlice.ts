import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {CategoryData as Category, getAllCategoriesByUserId} from '../../watermelondb/services';
import {selectUserId} from './userIdSlice';

const categoriesAdapter = createEntityAdapter<Category>();

const initialState = categoriesAdapter.getInitialState({
  isLoading: false,
  error: null as string | null,
});

export const fetchCategories = createAsyncThunk('category/fetchAll', async (_, {getState, rejectWithValue}) => {
  try {
    const userId = selectUserId(getState() as RootState);
    const categories = await getAllCategoriesByUserId(userId);
    return categories;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
  }
});

const categoryDataSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    categoryAdded: categoriesAdapter.addOne,
    categoryUpdated: categoriesAdapter.updateOne,
    categoryRemoved: categoriesAdapter.removeOne,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        categoriesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

const categorySelectors = categoriesAdapter.getSelectors<RootState>(state => state.category);

export const selectCategoryData = categorySelectors.selectAll;
export const selectCategoryDataById = categorySelectors.selectById;
export const selectCategoryIds = categorySelectors.selectIds;
export const selectCategoryEntities = categorySelectors.selectEntities;

export const selectCategoryLoading = (state: RootState) => state.category.isLoading;
export const selectCategoryError = (state: RootState) => state.category.error;

export const selectActiveCategories = createSelector([selectCategoryData], categoryData =>
  categoryData.filter((category: Category) => category.categoryStatus === true),
);

export const {categoryAdded, categoryUpdated, categoryRemoved} = categoryDataSlice.actions;

export default categoryDataSlice.reducer;
