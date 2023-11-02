import React from 'react';
import SplashScreen from './src/screens/SplashScreen';
import {NavigationContainer} from '@react-navigation/native';
import {setNavigationRef} from './src/utils/navigationUtils';
import { useColorScheme } from 'react-native';

const AppWrapper = () => {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer ref={setNavigationRef}>
      <SplashScreen />
      {/* Other app screens/components */}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <NavigationContainer ref={setNavigationRef}>
      <SplashScreen />
    </NavigationContainer>
  );
};

export default App;
