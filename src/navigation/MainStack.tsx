import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useMemo, useState} from 'react';
import AsyncStorageService from '../utils/asyncStorageService';
import {setIsOnboarded} from '../redux/slice/isOnboardedSlice';
import HomeStack from './HomeStack';
import OnboardingStack from './OnboardingStack';

const MainStack = () => {
  const dispatch = useDispatch();
  const isOnboarded = useSelector(
    (state: {userOnboarding: {isOnboarded: boolean}}) =>
      state.userOnboarding.isOnboarded,
  );

  const [stack, setStack] = useState(null);

  console.log('isOnboarded', isOnboarded);

  useEffect(() => {
    const getIsOnboarded = async () => {
      try {
        const value = await AsyncStorageService.getItem('isOnboarded');
        const isOnboarded = JSON.parse(value);
        console.log(
          'this is the value of isOnboarded',
          typeof isOnboarded,
          isOnboarded,
          value,
        );
        if (value) {
          dispatch(setIsOnboarded(true));
          console.log('Fetched isOnboarded from AsyncStorage');
        }
      } catch (error) {
        console.error('Error getting isOnboarded:', error);
      }
    };

    getIsOnboarded();
  }, [isOnboarded, dispatch]);

  useEffect(() => {
    const newStack = isOnboarded ? <HomeStack /> : <OnboardingStack />;
    setStack(newStack);
  }, [isOnboarded]);

  const memoizedStack = useMemo(() => stack, [stack]);

  return memoizedStack;
};

export default MainStack;
