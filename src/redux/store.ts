import {configureStore} from '@reduxjs/toolkit';
import userDataReducer from './slice/userDataSlice'; 

const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});

export default store;
