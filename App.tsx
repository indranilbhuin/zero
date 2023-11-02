import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {setNavigationRef} from './src/utils/navigationUtils';
import HomeStack from './src/navigation/HomeStack';

const App = () => {
  return (
    <NavigationContainer ref={setNavigationRef}>
      <HomeStack />
    </NavigationContainer>
  );
};

export default App;
