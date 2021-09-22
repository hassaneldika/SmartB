/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const Header = ({title}) => {
  return (
    <View style={styles.header}>
      <Entypo
        name={'menu'}
        size={30}
        color="#F05E31"
        style={{marginLeft: 10}}
      />
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E0DEDD',
    display: 'flex',
    flexDirection: 'row',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#707070',
  },
});

export default Header;
