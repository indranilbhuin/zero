import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../rootReducer';
import {getAllUsers} from '../../watermelondb/services';

interface UserState {
  userId: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userId: '',
  isLoading: false,
  error: null,
};

interface UserData {
  userId: string;
  userName: string;
  userEmail: string;
}

export const fetchUserData = createAsyncThunk<UserData, void, {rejectValue: string}>(
  'user/fetchData',
  async (_, {rejectWithValue}) => {
    try {
      const users = await getAllUsers();
      const user = users[0];
      return {
        userId: String(user?.id ?? ''),
        userName: user?.username ?? '',
        userEmail: user?.email ?? '',
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user data');
    }
  },
);

const userIdSlice = createSlice({
  name: 'userId',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.userId = action.payload.userId;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const selectUserId = (state: RootState) => state.userId.userId;
export const selectUserLoading = (state: RootState) => state.userId.isLoading;
export const selectUserError = (state: RootState) => state.userId.error;

export const {setUserId} = userIdSlice.actions;

export default userIdSlice.reducer;
