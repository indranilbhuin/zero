import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {setNavigationRef} from './src/utils/navigationUtils';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import MainStack from './src/navigation/MainStack';
import {LogBox} from 'react-native';

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <NavigationContainer ref={setNavigationRef}>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
