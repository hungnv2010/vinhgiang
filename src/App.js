/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import type {Node} from 'react';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context/src/SafeAreaContext';
import FlashMessage from 'react-native-flash-message';
import {AuthProvider} from './context';
import AppNavigator from './AppNavigator';

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={'light-content'}/>
        <AuthProvider>
          <AppNavigator/>
        </AuthProvider>
      </SafeAreaProvider>
      <FlashMessage position={'top'}/>
    </NavigationContainer>
  );
};

export default App;
