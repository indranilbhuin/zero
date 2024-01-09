import {call, put, select, takeEvery} from 'redux-saga/effects';
import {selectUserId} from '../slice/userIdSlice';
import {
  getAllExpensesByDate,
  getAllExpensesByUserId,
} from '../../services/ExpenseService';
import {
  getExpenseFaliure,
  getExpenseRequest,
  getExpenseSuccess,
} from '../slice/expenseDataSlice';
import {
  getEverydayExpenseFaliure,
  getEverydayExpenseRequest,
  getEverydayExpenseSuccess,
} from '../slice/everydayExpenseDataSlice';

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

function* fetchAllExpensesByDate(action: any): Generator<any, void, any> {
  try {
    const userId = yield select(selectUserId);
    const expenses = yield call(getAllExpensesByDate, userId, action.payload);
    yield put(getEverydayExpenseSuccess(expenses));
    console.log('in everyday expenses', expenses);
    console.log(expenses);
  } catch (error) {
    yield put(getEverydayExpenseFaliure(error));
    console.error('Error fetching everyday categories:', error);
  }
}

export function* watchFetchAllExpenses() {
  yield takeEvery(getExpenseRequest.type, fetchAllExpenses);
  yield takeEvery(getEverydayExpenseRequest.type, fetchAllExpensesByDate);
}
