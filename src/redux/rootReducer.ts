import {combineReducers} from 'redux';
import userOnboardingReducer from './slice/isOnboardedSlice';
import currencyDataReducer from './slice/currencyDataSlice';
import themePreferenceReducer from './slice/themePreferenceSlice';
import userNameReducer from './slice/userNameSlice';
import userEmailReducer from './slice/userEmailSlice';
import userIdReducer from './slice/userIdSlice';
import categoryReducer from './slice/categoryDataSlice';
import expenseReducer from './slice/expenseDataSlice';
import debtorReducer from './slice/debtorDataSlice';
import debtReducer from './slice/debtDataSlice';
import allDebtReducer from './slice/allDebtDataSlice';
import everydayExpenseReducer from './slice/everydayExpenseDataSlice';
import allDataReducer from './slice/allDataSlice';
import individualDebtorReducer from './slice/IndividualDebtorSlice';

const rootReducer = combineReducers({
  userOnboarding: userOnboardingReducer,
  currencyData: currencyDataReducer,
  themePreference: themePreferenceReducer,
  userName: userNameReducer,
  userEmail: userEmailReducer,
  userId: userIdReducer,
  category: categoryReducer,
  expense: expenseReducer,
  debtor: debtorReducer,
  debt: debtReducer,
  allDebt: allDebtReducer,
  everydayExpense: everydayExpenseReducer,
  allData: allDataReducer,
  individualDebtor: individualDebtorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
