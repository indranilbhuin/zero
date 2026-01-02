import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {setNavigationRef} from './src/utils/navigationUtils';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import MainStack from './src/navigation/MainStack';
import {LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/context/ThemeContext';

const App = () => {
  LogBox.ignoreAllLogs();

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <NavigationContainer ref={setNavigationRef}>
            <MainStack />
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
