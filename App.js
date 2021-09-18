/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {StatusBar, StyleSheet, View, Text} from 'react-native';
import Router from './src/screens/Root';
import RNBootSplash from 'react-native-bootsplash';

const App: () => React$Node = () => {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await RNBootSplash.hide({fade: true});
      console.log('Bootsplash has been hidden successfully');
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor='#E0DEDD'/>

      <Router />
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
