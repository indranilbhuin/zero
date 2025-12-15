import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  theme: null,
};

const themePreferenceSlice = createSlice({
  name: 'themePreference',
  initialState,
  reducers: {
    setThemePreference: (state, action) => {
      console.log('in slice', action.payload);
      state.theme = action.payload;
    },
  },
});

export const selectThemePreference = (state: RootState) =>
  state.themePreference.theme;

export const {setThemePreference} = themePreferenceSlice.actions;

export default themePreferenceSlice.reducer;
