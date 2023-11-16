import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  userEmail: '',
};

const userEmailSlice = createSlice({
  name: 'userEmail',
  initialState,
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
  },
});

export const selectUserEmail = (state: RootState) => state.userEmail.userEmail;

export const {setUserEmail} = userEmailSlice.actions;

export default userEmailSlice.reducer;
