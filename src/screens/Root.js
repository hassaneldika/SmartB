/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../../src/screens/HomeScreen';
import DetailScreen from '../../src/screens/DetailScreen';
import {NavigationContainer} from '@react-navigation/native';
import PunchScreen from '../../src/screens/Punch';
import HeaderLeft from './HeaderLeft';

const Stack = createStackNavigator();

const HomeNavigator = props => {
  return (

    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown: true}}>
      <Stack.Screen name="Home" navigation={props.navigation} component={HomeScreen}  options={{headerShown:false}} />
      <Stack.Screen name="Detail" navigation={props.navigation} component={DetailScreen} options={{
        headerLeft: () => <HeaderLeft/>,
        headerTitle:'',
        headerStyle:{backgroundColor:'#E0DEDD'},
        }} />
      <Stack.Screen name="Punch" navigation={props.navigation} component={PunchScreen}   options={{
        headerLeft: () => <HeaderLeft/>,
        headerTitle:'',
        headerStyle:{backgroundColor:'#E0DEDD'},
        }} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default HomeNavigator;
