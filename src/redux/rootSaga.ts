import {all} from 'redux-saga/effects';
import {watchFetchAllUsers} from './saga/userSaga';
import {watchFetchCurrency} from './saga/currencySaga';
import { watchFetchAllCategories } from './saga/categorySaga';

function* rootSaga() {
  yield all([
    watchFetchAllUsers(),
    watchFetchCurrency(),
    watchFetchAllCategories(),
  ]);
}

export default rootSaga;
