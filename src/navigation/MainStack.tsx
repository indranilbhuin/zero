import {useSelector} from 'react-redux';
import React from 'react';
import {selectIsOnboarded} from '../redux/slice/isOnboardedSlice';
import HomeStack from './HomeStack';
import OnboardingStack from './OnboardingStack';

const MainStack = () => {
  const isOnboarded = useSelector(selectIsOnboarded);
  return isOnboarded ? <HomeStack /> : <OnboardingStack />;
};

export default MainStack;
