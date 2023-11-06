import {createSlice} from '@reduxjs/toolkit';

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

export const {setIsOnboarded} = isOnboardedSlice.actions;

export default isOnboardedSlice.reducer;
