import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {setNavigationRef} from './src/utils/navigationUtils';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import OnboardingStack from './src/navigation/OnboardingStack';
import MainStack from './src/navigation/MainStack';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer ref={setNavigationRef}>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
