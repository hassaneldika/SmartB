/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Dimensions, Switch, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Header from './Header';
import Icon from 'react-native-vector-icons/AntDesign';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Logo from '../assets/Logo.svg';
import Check from '../assets/check.png';

const Screenwidth = Dimensions.get('window').width;
const Screenheight = Dimensions.get('window').height;

const Punch = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [punched, setPunched] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);
  const [date, setDate] = useState({
    hour: 0,
    minute: '',
    day: 0,
    month: 0,
    typeHour: 'AM',
  });

  const calculateTime = () => {
    var currentdate = new Date();
    let day = currentdate.getDate();
    let month = currentdate.getMonth() + 1;
    let typeHour = 'AM';
    let hour = currentdate.getHours();
    console.log(hour);
    typeH = hour > 11 ? 'PM' : 'AM';
    let hours = hour > 12 ? hour - 12 : hour;
    const minutes = currentdate.getMinutes();
    setDate({
      hour: hours,
      minute: minutes,
      day: day,
      month: month,
      typeHour: typeH,
    });
    console.log(typeof hours);
    setClicked(clicked ? false : true);
  };

  const renderAccepted = () => {
    return (
      <View style={styles.acceptedContainer}>
        <Text style={styles.accepetedText}>
          Your {punched ? 'punch' : 'transfer'} has been received at
        </Text>
        <Text style={styles.acceptedDate}>
          {date.day}/{date.month < 10 ? '0' + date.month : date.month}{' '}
          {date.hour < 10 ? '0' + '' + date.hour : date.hour}:
          {date.minute < 10 ? '0' + '' + date.minute : date.minute}{' '}
          {date.typeHour}
        </Text>
        <View style={styles.iconContainer}>
          <Image source={Check} />
        </View>
      </View>
    );
  };

  useEffect(() => {}, [isTransfer, isEnabled, punched, clicked]);
  return (
    <View>
      <Header />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Punch</Text>
        <View style={styles.projectTitleContainer}>
          <Icon
            name="left"
            style={{position: 'relative', right: 40, color: '#334F64'}}
            size={30}
            onPress={() => console.log(123)}
          />
          <Text style={styles.projectTitle}>Luxury Tower 22</Text>
        </View>
        <View>
          <Text style={styles.projectLocation}>
            3194 Biscayne Blvd. Miami Fl,33138
          </Text>
        </View>
      </View>
      <View style={{height: Screenheight * 0.7, backgroundColor: '#E0DEDD'}}>
        <View style={styles.punchContainer}>
          {clicked ? (
            renderAccepted()
          ) : (
            <>
              <View style={styles.punchOptions}>
                <Text style={styles.punchOptionsTitle}>Transfer Shift</Text>
                <Switch
                  style={{width: 100, transform: [{scale: 1.4}]}}
                  trackColor={{false: '#767577', true: '#0096FF'}}
                  thumbColor="#f4f3f4"
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={e => setIsEnabled(!isEnabled)}
                  value={isEnabled}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={isEnabled ? styles.circleButton2 : styles.circleButton}
                  onPress={() => {
                    calculateTime();
                  }}>
                  <Text style={styles.circleButtonText}>
                    {isEnabled ? 'Transfer' : 'Punch'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <Logo width={100} height={10} style={styles.logoFooter} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    height: Screenheight * 0.2,
    backgroundColor: '#E0DEDD',
    paddingBottom: 20,
  },
  title: {
    color: '#A6A6A6',
    textAlign: 'center',
    fontSize: 20,
  },
  projectTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectTitle: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#334F64',
  },
  projectLocation: {
    textAlign: 'center',
    color: '#707070',
    paddingHorizontal: 100,
    fontSize: 21,
    display: 'flex',
  },
  punchContainer: {
    zIndex: 9,
    height: Screenheight * 0.67,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    marginHorizontal: 10,
    backgroundColor: '#FFF',
  },
  punchOptions: {
    paddingTop: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  punchOptionsTitle: {
    fontSize: 20,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 100,
  },
  circleButton: {
    width: 280,
    height: 280,
    borderRadius: 280 / 2,
    backgroundColor: '#F05E31',
  },
  circleButton2: {
    width: 280,
    height: 280,
    borderRadius: 280 / 2,
    backgroundColor: '#0096FF',
  },
  circleButtonText: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 50,
    paddingLeft: 50,
    paddingTop: 80,
  },
  acceptedContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    marginVertical: 30,
  },
  accepetedText: {
    color: '#334F64',
    fontSize: 20,
  },
  acceptedDate: {
    color: '#334F64',
    fontSize: 36,
  },
  iconContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  logoFooter: {
    position: 'absolute',
    bottom: Screenwidth * 0.05,
    left: Screenwidth * 0.35,
  },
});

export default Punch;
