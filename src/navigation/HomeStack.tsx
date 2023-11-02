import React from 'react';
import SplashScreen from '../screens/SplashScreen';
import PersonalizeScreen from '../screens/PersonalizeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
      </Stack.Navigator>
    </>
  );
};

export default HomeStack;
