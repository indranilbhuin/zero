import React from 'react';
import SplashScreen from '../screens/SplashScreen';
import PersonalizeScreen from '../screens/PersonalizeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import ChooseCurrencyScreen from '../screens/ChooseCurrencyScreen';

const screenOptions = {
  headerShown: false,
};

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="PersonalizeScreen" component={PersonalizeScreen} />
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        <Stack.Screen name="ChooseCurrencyScreen" component={ChooseCurrencyScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </>
  );
};

export default HomeStack;
