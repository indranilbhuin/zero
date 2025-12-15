import {call, put, takeLatest} from 'redux-saga/effects';
import {getAllUsers} from '../../services/UserService';
import {setUserId} from '../slice/userIdSlice';
import {setUserName} from '../slice/userNameSlice';
import {setUserEmail} from '../slice/userEmailSlice';
import {FETCH_ALL_USER_DATA} from '../actionTypes';

function* fetchAllUserData(): Generator<any, void, any> {
  try {
    const users = yield call(getAllUsers);
    const userId = String(users[0]?._id);
    const username = users[0]?.username;
    const email = users[0]?.email;

    yield put(setUserId(userId));
    yield put(setUserName(username));
    yield put(setUserEmail(email));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

export function* watchFetchAllUsers() {
  yield takeLatest(FETCH_ALL_USER_DATA, fetchAllUserData);
}
