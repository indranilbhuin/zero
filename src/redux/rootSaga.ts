import {all} from 'redux-saga/effects';
import {watchFetchAllUsers} from './saga/userSaga';
import {watchFetchCurrency} from './saga/currencySaga';
import {watchFetchAllCategories} from './saga/categorySaga';
import {watchFetchAllExpenses} from './saga/expenseSaga';

function* rootSaga() {
  yield all([
    watchFetchAllUsers(),
    watchFetchCurrency(),
    watchFetchAllCategories(),
    watchFetchAllExpenses(),
  ]);
}

export default rootSaga;
