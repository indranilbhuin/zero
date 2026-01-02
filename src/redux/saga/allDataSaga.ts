import {call, put, takeLatest} from 'redux-saga/effects';
import {getAllData} from '../../watermelondb/services';
import {
  getAllDataFaliure,
  getAllDataRequest,
  getAllDataSuccess,
} from '../slice/allDataSlice';

function* fetchAllData(): Generator<any, void, any> {
  try {
    const allData = yield call(getAllData);
    console.log('All data:', allData);
    yield put(getAllDataSuccess(allData));
  } catch (error) {
    yield put(getAllDataFaliure(error));
    console.error('Error fetching all data:', error);
  }
}

export function* watchFetchAllData() {
  yield takeLatest(getAllDataRequest, fetchAllData);
}
