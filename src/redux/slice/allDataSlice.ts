import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {ExportData, getAllData} from '../../watermelondb/services';

interface AllDataState {
  data: ExportData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AllDataState = {
  data: null,
  isLoading: false,
  error: null,
};

export const fetchAllData = createAsyncThunk('allData/fetchAll', async (_, {rejectWithValue}) => {
  try {
    const allData = await getAllData();
    return allData;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch all data');
  }
});

const allDataSlice = createSlice({
  name: 'allData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(fetchAllData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectAllData = (state: RootState) => state.allData.data;
export const selectAllDataLoading = (state: RootState) => state.allData.isLoading;
export const selectAllDataError = (state: RootState) => state.allData.error;

export default allDataSlice.reducer;
