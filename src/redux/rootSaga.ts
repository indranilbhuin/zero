import {all} from 'redux-saga/effects';
import {watchFetchAllUsers} from './saga/userSaga';
import {watchFetchCurrency} from './saga/currencySaga';
import {watchFetchAllCategories} from './saga/categorySaga';
import {watchFetchAllExpenses} from './saga/expenseSaga';
import {watchFetchAllDebtors} from './saga/debtorSaga';
import {watchFetchAllDebts} from './saga/debtSaga';

function* rootSaga() {
  yield all([
    watchFetchAllUsers(),
    watchFetchCurrency(),
    watchFetchAllCategories(),
    watchFetchAllExpenses(),
    watchFetchAllDebtors(),
    watchFetchAllDebts(),
  ]);
}

export default rootSaga;
