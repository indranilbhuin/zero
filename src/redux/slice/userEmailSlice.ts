import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {fetchUserData} from './userIdSlice';

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
  extraReducers: builder => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.userEmail = action.payload.userEmail;
    });
  },
});

export const selectUserEmail = (state: RootState) => state.userEmail.userEmail;

export const {setUserEmail} = userEmailSlice.actions;

export default userEmailSlice.reducer;
