import {call, put, select, takeEvery} from 'redux-saga/effects';
import {selectUserId} from '../slice/userIdSlice';
import {
  getDebtFaliure,
  getDebtRequest,
  getDebtSuccess,
} from '../slice/debtDataSlice';
import {
  getAllDebtsByUserId,
  getAllDebtsByUserIdAndDebtorId,
} from '../../services/DebtService';
import {
  getAllDebtFaliure,
  getAllDebtRequest,
  getAllDebtSuccess,
} from '../slice/allDebtDataSlice';

function* fetchAllDebtsbyDebtor(action: any): Generator<any, void, any> {
  try {
    const userId = yield select(selectUserId);
    const debtorId = action.payload;
    const debts = yield call(getAllDebtsByUserIdAndDebtorId, userId, debtorId);
    console.log('in debts', debts);
    yield put(getDebtSuccess(debts));
  } catch (error) {
    yield put(getDebtFaliure(error));
    console.error('Error fetching debts:', error);
  }
}

function* fetchAllDebts(): Generator<any, void, any> {
  try {
    const userId = yield select(selectUserId);
    const allDebts = yield call(getAllDebtsByUserId, userId);
    yield put(getAllDebtSuccess(allDebts));
    console.log('in all debts', allDebts);
  } catch (error) {
    yield put(getAllDebtFaliure(error));
    console.error('Error fetching all debts:', error);
  }
}

export function* watchFetchAllDebts() {
  yield takeEvery(getDebtRequest.type, fetchAllDebtsbyDebtor);
  yield takeEvery(getAllDebtRequest.type, fetchAllDebts);
}
