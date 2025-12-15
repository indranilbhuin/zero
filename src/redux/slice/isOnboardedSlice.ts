import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  isOnboarded: false,
};

const isOnboardedSlice = createSlice({
  name: 'userOnboarding',
  initialState,
  reducers: {
    setIsOnboarded: (state, action) => {
      console.log(action.payload);
      state.isOnboarded = action.payload;
    },
  },
});

export const selectIsOnboarded = (state: RootState) =>
  state.userOnboarding.isOnboarded;

export const {setIsOnboarded} = isOnboardedSlice.actions;

export default isOnboardedSlice.reducer;
