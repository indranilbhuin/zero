import {call, put, select, takeEvery} from 'redux-saga/effects';
import {selectUserId} from '../slice/userIdSlice';
import {getAllExpensesByUserId} from '../../services/ExpenseService';
import {
  getExpenseFaliure,
  getExpenseRequest,
  getExpenseSuccess,
} from '../slice/expenseDataSlice';

function* fetchAllExpenses(): Generator<any, void, any> {
  try {
    const userId = yield select(selectUserId);
    const expenses = yield call(getAllExpensesByUserId, userId);
    yield put(getExpenseSuccess(expenses));
    console.log('in expenses', expenses);
    console.log(expenses);
  } catch (error) {
    yield put(getExpenseFaliure(error));
    console.error('Error fetching categories:', error);
  }
}

export function* watchFetchAllExpenses() {
  yield takeEvery(getExpenseRequest.type, fetchAllExpenses);
}
