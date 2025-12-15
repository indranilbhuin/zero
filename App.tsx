import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {setNavigationRef} from './src/utils/navigationUtils';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import MainStack from './src/navigation/MainStack';
import {LogBox, SafeAreaView} from 'react-native';

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <NavigationContainer ref={setNavigationRef}>
        <SafeAreaView style={{flex: 1}}>
          <MainStack />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
