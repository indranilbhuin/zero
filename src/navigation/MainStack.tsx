import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useMemo, useState} from 'react';
import AsyncStorageService from '../utils/asyncStorageService';
import {selectIsOnboarded, setIsOnboarded} from '../redux/slice/isOnboardedSlice';
import HomeStack from './HomeStack';
import OnboardingStack from './OnboardingStack';
import {useTheme} from '../context/ThemeContext';
import CustomLoader from '../components/atoms/CustomLoader';

const MainStack = () => {
  const dispatch = useDispatch();
  const {colors, isLoading: isThemeLoading} = useTheme();
  const isOnboarded = useSelector(selectIsOnboarded);
  const [isLoading, setIsLoading] = useState(true);

  const [stack, setStack] = useState<React.ReactNode>(null);

  useEffect(() => {
    const getIsOnboarded = async () => {
      try {
        const value = await AsyncStorageService.getItem('isOnboarded');
        const parsedValue = value ? JSON.parse(value) : false;
        if (parsedValue) {
          dispatch(setIsOnboarded(true));
        } else {
          dispatch(setIsOnboarded(false));
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

  if (isLoading || isThemeLoading) {
    return <CustomLoader colors={colors} />;
  }

  return memoizedStack;
};

export default MainStack;
