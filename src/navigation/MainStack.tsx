import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useMemo, useState} from 'react';
import AsyncStorageService from '../utils/asyncStorageService';
import {
  selectIsOnboarded,
  setIsOnboarded,
} from '../redux/slice/isOnboardedSlice';
import HomeStack from './HomeStack';
import OnboardingStack from './OnboardingStack';
import useThemeColors from '../hooks/useThemeColors';
import CustomLoader from '../components/atoms/CustomLoader';

const MainStack = () => {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const isOnboarded = useSelector(selectIsOnboarded);
  const [isLoading, setIsLoading] = useState(true);

  const [stack, setStack] = useState<React.ReactNode>(null);

  console.log('isOnboarded', isOnboarded);

  useEffect(() => {
    const getIsOnboarded = async () => {
      try {
        const value = await AsyncStorageService.getItem('isOnboarded');
        const parsedValue = value ? JSON.parse(value) : false;
        console.log(
          'this is the value of isOnboarded',
          typeof parsedValue,
          parsedValue,
          value,
        );
        if (parsedValue) {
          dispatch(setIsOnboarded(true));
          console.log('Fetched isOnboarded from AsyncStorage');
        } else {
          dispatch(setIsOnboarded(false));
          console.log('Fetched isOnboarded from AsyncStorage');
        }
      } catch (error) {
        console.error('Error getting isOnboarded:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getIsOnboarded();
  }, [isOnboarded, dispatch]);

  useEffect(() => {
    const newStack = isOnboarded ? <HomeStack /> : <OnboardingStack />;
    setStack(newStack);
  }, [isOnboarded]);

  const memoizedStack = useMemo(() => stack, [stack]);

  return isLoading ? <CustomLoader colors={colors} /> : memoizedStack;
};

export default MainStack;
