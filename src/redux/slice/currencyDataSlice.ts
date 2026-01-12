import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {getCurrencyByUserId} from '../../watermelondb/services';
import {selectUserId} from './userIdSlice';

interface CurrencyState {
  currencyId: string;
  currencyName: string;
  currencyCode: string;
  currencySymbol: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: CurrencyState = {
  currencyId: '',
  currencyName: '',
  currencyCode: '',
  currencySymbol: '',
  isLoading: false,
  error: null,
};

export const fetchCurrency = createAsyncThunk('currency/fetch', async (_, {getState, rejectWithValue}) => {
  try {
    const userId = selectUserId(getState() as RootState);
    const currency = await getCurrencyByUserId(userId);
    if (currency) {
      return {
        currencyId: String(currency.id),
        currencyName: currency.name,
        currencySymbol: currency.symbol,
        currencyCode: currency.code,
      };
    }
    return null;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch currency');
  }
});

const currencyDataSlice = createSlice({
  name: 'currencyData',
  initialState,
  reducers: {
    setCurrencyData: (state, action) => {
      state.currencyId = action.payload.currencyId;
      state.currencyName = action.payload.currencyName;
      state.currencyCode = action.payload.currencyCode;
      state.currencySymbol = action.payload.currencySymbol;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCurrency.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        if (action.payload) {
          state.currencyId = action.payload.currencyId;
          state.currencyName = action.payload.currencyName;
          state.currencySymbol = action.payload.currencySymbol;
          state.currencyCode = action.payload.currencyCode;
        }
      })
      .addCase(fetchCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectCurrencyId = (state: RootState) => state.currencyData.currencyId;
export const selectCurrencyName = (state: RootState) => state.currencyData.currencyName;
export const selectCurrencyCode = (state: RootState) => state.currencyData.currencyCode;
export const selectCurrencySymbol = (state: RootState) => state.currencyData.currencySymbol;
export const selectCurrencyLoading = (state: RootState) => state.currencyData.isLoading;
export const selectCurrencyError = (state: RootState) => state.currencyData.error;

export const {setCurrencyData} = currencyDataSlice.actions;

export default currencyDataSlice.reducer;
