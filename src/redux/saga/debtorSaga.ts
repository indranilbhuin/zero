import {call, put, select, takeEvery} from 'redux-saga/effects';
import {selectUserId} from '../slice/userIdSlice';
import {FETCH_ALL_DEBTOR_DATA} from '../actionTypes';
import {getAllDebtorsByUserId} from '../../services/DebtorService';
import {setDebtorData} from '../slice/debtorDataSlice';

function* fetchAllDebtors(): Generator<any, void, any> {
  try {
    console.log('in debtors');
    const userId = yield select(selectUserId);
    const debtors = yield call(getAllDebtorsByUserId, userId);
    yield put(setDebtorData(debtors));
    console.log(debtors);
  } catch (error) {
    console.error('Error fetching debtors:', error);
  }
}

export function* watchFetchAllDebtors() {
  yield takeEvery(FETCH_ALL_DEBTOR_DATA, fetchAllDebtors);
}
