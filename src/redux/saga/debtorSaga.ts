import {call, put, select, takeEvery} from 'redux-saga/effects';
import {selectUserId} from '../slice/userIdSlice';
import {FETCH_ALL_DEBTOR_DATA} from '../actionTypes';
import {
  getAllDebtorsByUserId,
  getDebtorByDebtorId,
} from '../../services/DebtorService';
import {setDebtorData} from '../slice/debtorDataSlice';
import {
  getIndividualDebtorFaliure,
  getIndividualDebtorRequest,
  getIndividualDebtorSuccess,
} from '../slice/IndividualDebtorSlice';

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

function* fetchDebtorbyId(action: any): Generator<any, void, any> {
  try {
    const debtorId = action.payload;
    const debtor = yield call(getDebtorByDebtorId, debtorId);
    yield put(getIndividualDebtorSuccess(debtor));
  } catch (error) {
    yield put(getIndividualDebtorFaliure(error));
    console.error('Error fetching debtor:', error);
  }
}

export function* watchFetchAllDebtors() {
  yield takeEvery(FETCH_ALL_DEBTOR_DATA, fetchAllDebtors);
  yield takeEvery(getIndividualDebtorRequest.type, fetchDebtorbyId);
}
