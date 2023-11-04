import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userId: '',
  userName: '',
  userEmail: '',
};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      console.log(action.payload);
      state.userId = action.payload.userId;
      state.userName = action.payload.username;
      state.userEmail = action.payload.email;
    },
  },
});

export const {setUserData} = userDataSlice.actions;

export default userDataSlice.reducer;
