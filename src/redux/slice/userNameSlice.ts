import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {fetchUserData} from './userIdSlice';

const initialState = {
  userName: '',
};

const userNameSlice = createSlice({
  name: 'userName',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.userName = action.payload.userName;
    });
  },
});

export const selectUserName = (state: RootState) => state.userName.userName;

export const {setUserName} = userNameSlice.actions;

export default userNameSlice.reducer;
