import {call, put, takeLatest} from 'redux-saga/effects';
import {getAllData} from '../../services/GetService';
import {
  getAllDataFaliure,
  getAllDataRequest,
  getAllDataSuccess,
} from '../slice/allDataSlice';

function* fetchAllData(): Generator<any, void, any> {
  try {
    const allData = yield call(getAllData);
    console.log("helll",allData);
    yield put(getAllDataSuccess(allData));
  } catch (error) {
    yield put(getAllDataFaliure(error));
    console.error('Error fetching all data:', error);
  }
}

export function* watchFetchAllData() {
  yield takeLatest(getAllDataRequest, fetchAllData);
}
