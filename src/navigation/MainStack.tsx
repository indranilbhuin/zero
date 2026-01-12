import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import StorageService from '../utils/asyncStorageService';
import {selectIsOnboarded, setIsOnboarded} from '../redux/slice/isOnboardedSlice';
import {useTheme} from '../context/ThemeContext';
import CustomLoader from '../components/atoms/CustomLoader';
import HomeStack from './HomeStack';
import OnboardingStack from './OnboardingStack';

const MainStack = () => {
  const dispatch = useDispatch();
  const {colors, isLoading: isThemeLoading} = useTheme();
  const isOnboarded = useSelector(selectIsOnboarded);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const value = StorageService.getItemSync('isOnboarded');
    const parsedValue = value ? JSON.parse(value) : false;
    dispatch(setIsOnboarded(parsedValue));
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading || isThemeLoading) {
    return <CustomLoader colors={colors} />;
  }

  return isOnboarded ? <HomeStack /> : <OnboardingStack />;
};

export default MainStack;
