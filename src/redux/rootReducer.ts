import {combineReducers} from 'redux';
import userOnboardingReducer from './slice/isOnboardedSlice';
import currencyDataReducer from './slice/currencyDataSlice';
import themePreferenceReducer from './slice/themePreferenceSlice';
import userNameReducer from './slice/userNameSlice';
import userEmailReducer from './slice/userEmailSlice';
import userIdReducer from './slice/userIdSlice';
import categoryReducer from './slice/categoryDataSlice';

const rootReducer = combineReducers({
  userOnboarding: userOnboardingReducer,
  currencyData: currencyDataReducer,
  themePreference: themePreferenceReducer,
  userName: userNameReducer,
  userEmail: userEmailReducer,
  userId: userIdReducer,
  category: categoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
