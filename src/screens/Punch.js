/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Logo from '../assets/Logo.svg';
import Check from '../assets/check.png';
import { GetKey } from '../core/async-storage/AsyncData';
import { v4 as uuidv4 } from 'uuid';
import { onPunch } from '../core/api/Api';

const Punch = ({ route, navigation }) => {
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

  const { params } = route;

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
        <Text allowFontScaling={false} style={styles.accepetedText}>
          Your {punched ? 'punch' : 'transfer'} has been received at
        </Text>
        <Text allowFontScaling={false} style={styles.acceptedDate}>
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

  const _doThePost = in_out_transfer => {
    GetKey('token').then(res => {
      if (res) {
        const token = JSON.parse(res);
        console.log(token)
        const uuid = uuidv4();
        const ts = Math.floor(Date.now() / 1000);
        var punch = {
          punch: {
            duration: {
              initiated: 0,
              userInput: 0,
              lookup: 0,
              pictures: 0,
              finished: 0,
            },
            location: params.userLocation,
            phoneNumber: token?.phone_number,
            currentProject: params?.name,
            entryType: 'app',
            employee: {
              dbid: token?.user?.dbid,
              first_name: token?.user?.first_name,
              last_name: token?.user?.last_name,
            },
            punch_time: ts,
            uuid: uuid,
          },
          deviceId: params?.device_id,
          timestamp: ts,
        };

        if (in_out_transfer === 'clockIn') {
          punch.punch.clockIn = true;
        }
        if (in_out_transfer === 'clockOut') {
          punch.punch.clockOut = true;
        }
        if (in_out_transfer === 'transfer') {
          punch.punch.clockOut = true;
          const flags = { transfer: true };
          punch.punch.flags = flags;
        }

        onPunch(token?.pincode, punch)
          .then(responseJson => {
            console.log(responseJson);
            if (responseJson.success === true) {
              setClicked(false);
              console.log('Success:' + JSON.stringify(responseJson));
              var iot_txt = 'You have Transfered';
              if (in_out_transfer === 'clockIn') {
                iot_txt = 'You have checked IN';
              }
              if (in_out_transfer === 'clockOut') {
                iot_txt = 'You have checked OUT';
              }
              Alert.alert(
                iot_txt,
                'at ' + params.name,
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                  ,
                ],
                { cancelable: false },
              );
              onGoBack()
              //          alert("OK!");
            } else {
              setClicked(false);
              //          console.log("ERROR:"+JSON.stringify(responseJson));
              Alert.alert(
                'Punch FAIL!',
                'Please try to login again.',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                  ,
                ],
                { cancelable: false },
              );
            }
          })
          .catch(error => {
            setClicked(false);
            console.error('ERROR:' + error);
          });
      }
    });
  };

  const onPunchPress = () => {
    if (clicked) {
      _doThePost('clockIn');
    } else {
      _doThePost('clockOut');
    }
    setClicked(prev => !prev);
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => { }, [isTransfer, isEnabled, punched, clicked]);
  return (
    <View style={{ flex: 1, backgroundColor: '#E0DEDD' }}>
      <View>
        <Text allowFontScaling={false} style={styles.title}>
          Punch
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            hitSlop={{ bottom: 10, top: 10, right: 10, left: 10 }}
            style={styles.projectTitleContainer}
            onPress={onGoBack}>
            <Icon
              name="left"
              style={{ marginRight: 20, color: '#334F64' }}
              size={24}
              onPress={() => console.log(123)}
            />
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.projectTitle}>
            {params.name}
          </Text>
        </View>
        <View>
          <Text allowFontScaling={false} style={styles.projectLocation}>
            {params.address}
          </Text>
        </View>
      </View>
      <View style={{ backgroundColor: '#E0DEDD', flexGrow: 1 }}>
        <View style={styles.punchContainer}>
          {clicked ? (
            renderAccepted()
          ) : (
            <>
              <View style={styles.punchOptions}>
                <Text allowFontScaling={false} style={styles.punchOptionsTitle}>
                  Transfer Shift
                </Text>
                <Switch
                  style={{ marginLeft: 20, transform: [{ scale: 1.4 }] }}
                  trackColor={{ false: '#767577', true: '#0096FF' }}
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
                    onPunchPress();
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={styles.circleButtonText}>
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
    fontSize: 21,
    display: 'flex',
  },
  punchContainer: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9,
    borderRadius: 40,
    margin: 10,
    backgroundColor: '#fff',
  },
  punchOptions: {
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
  },
  circleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F05E31',
  },
  circleButton2: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#0096FF',
  },
  circleButtonText: {
    fontWeight: 'bold',
    color: '#FFF',
    fontSize: 40,
  },
  acceptedContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
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
  logoFooter: {},
});

export default Punch;
