import {call, put, select, takeLatest} from 'redux-saga/effects';
import {setCurrencyData} from '../slice/currencyDataSlice';
import {FETCH_CURRENCY_DATA} from '../actionTypes';
import {selectUserId} from '../slice/userIdSlice';
import {getCurrencyByUserId} from '../../watermelondb/services';

function* fetchCurrency(): Generator<any, void, any> {
  try {
    const userId = yield select(selectUserId);
    const currency = yield call(getCurrencyByUserId, userId);
    if (currency) {
      const currencyData = {
        currencyId: String(currency.id),
        currencyName: currency.name,
        currencySymbol: currency.symbol,
        currencyCode: currency.code,
      };
      yield put(setCurrencyData(currencyData));
    }
  } catch (error) {
    console.error('Error fetching currency:', error);
  }
}

export function* watchFetchCurrency() {
  yield takeLatest(FETCH_CURRENCY_DATA, fetchCurrency);
}
