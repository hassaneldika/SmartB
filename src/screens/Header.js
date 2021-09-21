/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';

const Screenwidth = Dimensions.get('window').width;
const Screenheight = Dimensions.get('window').height;

const Header = ({title}) => {
  return (
    <View style={styles.header}>
      <Entypo
        name={'menu'}
        size={30}
        color="#F05E31"
        style={{marginTop: 7, marginLeft: 10}}
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
    flex: 1,
    marginRight: Screenwidth * 0.14,
    marginTop: 20,
    fontSize: 20,
    paddingVertical: 10,
    color: '#707070',
    paddingLeft: 5,
  },
});

export default Header;
