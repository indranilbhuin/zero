import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';

const initialState = {
  userId: '',
};

const userIdSlice = createSlice({
  name: 'userId',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const selectUserId = (state: RootState) => state.userId.userId;

export const {setUserId} = userIdSlice.actions;

export default userIdSlice.reducer;
