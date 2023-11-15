import {all} from 'redux-saga/effects';
import {watchFetchAllUsers} from './saga/userSaga';
import {watchFetchCurrency} from './saga/currencySaga';

function* rootSaga() {
  yield all([watchFetchAllUsers(), watchFetchCurrency()]);
}

export default rootSaga;
