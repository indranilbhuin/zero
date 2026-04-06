import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {setNavigationRef} from './src/utils/navigationUtils';
import {Provider} from 'react-redux';
import store, {persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import MainStack from './src/navigation/MainStack';
import {LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider} from './src/context/ThemeContext';
import {DialogProvider} from './src/context/DialogContext';
import {SheetProvider} from 'react-native-actions-sheet';
import ErrorBoundary from './src/components/atoms/ErrorBoundary';
import {initBackend} from './src/backend';
import './src/sheets/sheets';
import './src/utils/globalErrorHandler';

const App = () => {
  LogBox.ignoreAllLogs();

  useEffect(() => {
    initBackend();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeProvider>
                <DialogProvider>
                  <SheetProvider>
                    <NavigationContainer ref={setNavigationRef}>
                      <MainStack />
                    </NavigationContainer>
                  </SheetProvider>
                </DialogProvider>
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;
