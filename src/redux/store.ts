import {configureStore} from '@reduxjs/toolkit';
import userDataReducer from './slice/userDataSlice';
import userOnboardingReducer from './slice/isOnboardedSlice';
import currencyDataReducer from './slice/currencyDataSlice'

const store = configureStore({
  reducer: {
    userData: userDataReducer,
    userOnboarding: userOnboardingReducer,
    currencyData: currencyDataReducer
  },
});

export default store;
