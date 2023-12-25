import {resetAllData} from './slice/allDataSlice';
import {resetAllDebt} from './slice/allDebtDataSlice';
import {resetCategoryData} from './slice/categoryDataSlice';
import {resetCurrencyData} from './slice/currencyDataSlice';
import {resetDebtData} from './slice/debtDataSlice';
import {resetDebtorData} from './slice/debtorDataSlice';
import {resetEverydayData} from './slice/everydayExpenseDataSlice';
import {resetExpenseData} from './slice/expenseDataSlice';
import {resetUserEmail} from './slice/userEmailSlice';
import {resetUserId} from './slice/userIdSlice';
import {resetUserName} from './slice/userNameSlice';

export const resetAllSlices = () => (dispatch, getState) => {
  const state = getState();
  dispatch(resetAllData(state.allData));
  dispatch(resetAllDebt(state.allDebt));
  dispatch(resetCategoryData(state.category));
  dispatch(resetCurrencyData(state.currencyData));
  dispatch(resetDebtData(state.debt));
  dispatch(resetDebtorData(state.debtor));
  dispatch(resetEverydayData(state.everydayExpense));
  dispatch(resetExpenseData(state.expense));
  dispatch(resetUserEmail(state.userEmail));
  dispatch(resetUserName(state.userEmail));
  dispatch(resetUserId(state.userId));
};
