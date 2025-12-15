import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

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
});

export const selectUserName = (state: RootState) => state.userName.userName;

export const {setUserName} = userNameSlice.actions;

export default userNameSlice.reducer;
