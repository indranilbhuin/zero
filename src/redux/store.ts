import {configureStore} from '@reduxjs/toolkit';
import userDataReducer from './slice/userDataSlice';
import userOnboardingReducer from './slice/isOnboardedSlice';

const store = configureStore({
  reducer: {
    userData: userDataReducer,
    userOnboarding: userOnboardingReducer,
  },
});

export default store;
