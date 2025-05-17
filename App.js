import { StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import StackNavigation from './src/navigation/StackNavigation';
// import branch from 'react-native-branch';
import { OneSignal, LogLevel } from 'react-native-onesignal';

const App = () => {
  const branchUnsubscribeRef = useRef(null);

  // Initialize OneSignal
  useEffect(() => {
    // Enable verbose logging for debugging (remove in production)
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('8012e134-dea0-412b-bb0f-777db59c3cfd');
    OneSignal.Notifications.requestPermission(true);

  }, []);

  // Initialize Branch and set up listeners
  // useEffect(() => {
  //   const subscribeToBranch = async () => {
  //     try {
  
  //       // Subscribe to Branch deep link events
  //       const unsubscribe = branch.subscribe(({ error, params, uri }) => {
  //         console.log("work",unsubscribe)
  //         if (error) {
  //           console.error('Branch subscribe error:', error);
  //         } else if (params && params['+clicked_branch_link']) {
  //           // Handle deep link opening
  //           console.log('App opened from Branch link');
  //           console.log('Deep link URL:', params.$canonical_url);
  //           console.log('Deep link params:', params);
  //         } else {
  //           // No Branch link clicked
  //           console.log('Opened app without Branch link');
  //         }
  //       });

  //       // Save the unsubscribe reference to clean up later
  //       branchUnsubscribeRef.current = unsubscribe;
  //     } catch (e) {
  //       console.error('Branch setup error:', e);
  //     }
  //   };

  //   subscribeToBranch();

  //   return () => {
  //     // Cleanup when app is unmounted or effect is cleaned up
  //     if (branchUnsubscribeRef.current) {
  //       branchUnsubscribeRef.current();
  //     }
  //   };
  // }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
