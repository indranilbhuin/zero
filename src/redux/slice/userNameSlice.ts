import {createSlice} from '@reduxjs/toolkit';

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

export const selectUserName = (state: any) => state.userName.userName;

export const {setUserName} = userNameSlice.actions;

export default userNameSlice.reducer;
