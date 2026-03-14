import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import StorageService from '../../utils/asyncStorageService';

const storedValue = StorageService.getItemSync('isOnboarded');

const initialState = {
  isOnboarded: storedValue ? JSON.parse(storedValue) : false,
};

const isOnboardedSlice = createSlice({
  name: 'userOnboarding',
  initialState,
  reducers: {
    setIsOnboarded: (state, action) => {
      state.isOnboarded = action.payload;
    },
  },
});

export const selectIsOnboarded = (state: RootState) =>
  state.userOnboarding.isOnboarded;

export const {setIsOnboarded} = isOnboardedSlice.actions;

export default isOnboardedSlice.reducer;
