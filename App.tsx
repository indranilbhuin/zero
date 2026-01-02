import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {setNavigationRef} from './src/utils/navigationUtils';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import MainStack from './src/navigation/MainStack';
import {LogBox, View, Text, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {executeRealmToWatermelonMigration} from './src/watermelondb';

const App = () => {
  LogBox.ignoreAllLogs();
  const [isMigrating, setIsMigrating] = useState(true);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  useEffect(() => {
    const runMigration = async () => {
      try {
        console.log('Checking for Realm to WatermelonDB migration...');
        await executeRealmToWatermelonMigration();
        setIsMigrating(false);
      } catch (error) {
        console.error('Migration error:', error);
        setMigrationError(String(error));
        setIsMigrating(false);
      }
    };

    runMigration();
  }, []);

  // Show loading screen during migration
  if (isMigrating) {
    return (
      <SafeAreaProvider>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F0F'}}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={{color: '#FFFFFF', marginTop: 16, fontFamily: 'FiraCode-Regular'}}>
            Initializing...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Show error screen if migration failed
  if (migrationError) {
    return (
      <SafeAreaProvider>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F0F', padding: 20}}>
          <Text style={{color: '#FF5252', fontSize: 18, fontFamily: 'FiraCode-Bold'}}>
            Error
          </Text>
          <Text style={{color: '#FFFFFF', marginTop: 8, textAlign: 'center', fontFamily: 'FiraCode-Regular'}}>
            {migrationError}
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer ref={setNavigationRef}>
          <MainStack />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
