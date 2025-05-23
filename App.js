import { StyleSheet, Platform, Alert, Linking, StatusBar } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import StackNavigation from './src/navigation/StackNavigation';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import InAppUpdates, { IAUUpdateKind } from 'react-native-in-app-updates';
import VersionCheck from 'react-native-version-check';

const App = () => {
  const branchUnsubscribeRef = useRef(null);

  // Initialize OneSignal
  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('8012e134-dea0-412b-bb0f-777db59c3cfd');
    OneSignal.Notifications.requestPermission(true);
  }, []);

  // In-App Update logic
  useEffect(() => {
    console.log("app.jsx")
    // if (Platform.OS === 'android') {
    //   const inAppUpdates = new InAppUpdates(true); // true enables debug logs
    //   inAppUpdates.checkNeedsUpdate().then(result => {
    //     if (result.shouldUpdate) {
    //       inAppUpdates.startUpdate({ updateType: IAUUpdateKind.FLEXIBLE });
    //     }
    //   });
    // } else
    if (Platform.OS === 'ios') {
      VersionCheck.needUpdate().then(res => {
        if (res?.isNeeded) {
      console.log('iOS Update Available');
      Alert.alert('Update', 'Update available');
    }

        if (res?.isNeeded) {
          Alert.alert(
            'Update Available',
            'A new version of the app is available. Please update now.',
            [
              { text: 'Update', onPress: () => Linking.openURL(res.storeUrl) },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }
      });
    }
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <StackNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
