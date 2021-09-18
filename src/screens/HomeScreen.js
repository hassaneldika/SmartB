/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable consistent-this */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
import * as React from 'react';
import {Button,Platform,StyleSheet,ImageBackground,BackHandler,Image,Text,TextInput,View,TouchableOpacity,Alert} from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Logo from '../assets/Logo.svg';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this._onVerifyPressButton = this._onVerifyPressButton.bind(this);
    this._onLoginPressButton = this._onLoginPressButton.bind(this);
    this._editPhoneNr = this._editPhoneNr.bind(this);
    this._renderIOSVerifyButton = this._renderIOSVerifyButton.bind(this);
    this.state = {
      buttonIsClicked: false,
      ph_text: '',
      txt2: '',
      showCode: false,
      enablePh: true,
      userPinCode:'',
    };
    AsyncStorage.getItem('userdata').then(udata => {
      const jdata = JSON.parse(udata);
      const nav = this.props.navigation;
      if (jdata && jdata.pincode != undefined) {
        console.log('Already logged in ...');
        nav.navigate('Detail');
      }
    });
  }
    
  _onPressButton_FAKE() {
    this.setState((state, props) => ({
      showCode: true,
      enablePh: true,
    }));
  }

  _onLoginPressButton() {
    // curl -d '{"phoneNumber":"2066188318"}' https://mobile-punch.connectedbarrelapi.com/register
    this.setState({
      buttonIsClicked: true,
      //showCode:true
    });
    let self = this;
    var cleanedPh = ('' + this.state.ph_text).replace(/\D/g, '');
    if (this.state.enablePh) {
      fetch(Config.API_URL + '/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: cleanedPh,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          //        AsyncStorage.setItem('userdata', JSON.stringify(responseJson) );
          //        this.props.navigation.navigate('Detail') ;
          console.log(responseJson);
          if (responseJson.error == undefined) {
            this.setState((state, props) => ({
              buttonIsClicked: false,
              showCode: true,
              enablePh: true,
            }));
          } else {
            alert('Login failed! \nPlease check your phone number.');
            this.setState((state, props) => ({
              buttonIsClicked: false,
              showCode: true,
              enablePh: true,
            }));
          }
        })
        .catch(error => {
          self.setState({
            buttonIsClicked: false,
          });
          console.error('ERROR:' + error);
        });
    }
  }

  _onVerifyPressButton() {
    if (this.state.userPinCode.length < 6)
      {Alert.alert('Pincode Error','Please fill all 6 cells with the correct combination');}
    else
      {console.log(this.state.userPinCode);}
    // curl -H "Authorization: Bearer 13731031" "https://mobile-punch.connectedbarrelapi.com/projects/2066188318"
    let self = this;
    self.setState({
      buttonIsClicked: true,
    });
    var cleanedPh = ('' + this.state.ph_text).replace(/\D/g, '');
    var pincode = '' + this.state.txt2;
    var url = Config.API_URL + '/projects/' + cleanedPh;
    var opts = {
      method: 'GET',
      headers: {
        accept: '*/*',
        Authorization: 'Bearer ' + pincode,
      },
    };
    //    console.log("url:"+JSON.stringify(url));
    //    console.log("opts:"+JSON.stringify(opts));
    fetch(url, opts)
      .then(response => response.json())
      .then(responseJson => {
        responseJson.phone_number = cleanedPh;
        responseJson.pincode = pincode;
        var nav = this.props.navigation;
        if (responseJson.projects != undefined) {
          AsyncStorage.setItem('userdata', JSON.stringify(responseJson)).then(
            r => {
              self.setState({
                buttonIsClicked: false,
              });
              console.log(
                'Fetch ' + url + ' : ' + JSON.stringify(responseJson),
              );
              nav.navigate('Detail');
            },
          );
        } else {
          console.log('ERROR RETURN: ' + JSON.stringify(responseJson));
          this.setState((state, props) => ({
            buttonIsClicked: false,
            showCode: false,
            enablePh: true,
          }));
        }
      })
      .catch(error => {
        self.setState({
          buttonIsClicked: false,
        });
        console.error(error);
      });
  }


  _editPhoneNr(text) {
    this.setState({text});
  }

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  _handleChangeText = text => {
    var cleaned = ('' + text).replace(/\D/g, '');
    if (cleaned.length == 10) {
      cleaned = this.formatPhoneNumber(cleaned);
    }
    this.setState({ph_text: cleaned});
  };

  goBack = ()=>{
    if (this.state.showCode == true)
      {this.setState({showCode:false});}
    else
      {BackHandler.exitApp();}
  }


  componentDidMount() {
    this.handler = BackHandler.addEventListener('hardwareBackPress', () => {this.goBack(); return true;});
}

componentWillUnmount() {
    this.handler.remove();
    BackHandler.addEventListener('hardwareBackPress', () => {return false;});
}


  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.logoBackGround}
          source={require('../../src/assets/Background.png')}>
          <Logo width={250} height={40} />
          <View>
          {!this.state.showCode ? this._renderMainStuff() : (<View style={{marginBottom:12}}>
          {this._renderCodeStuff()}
          {this._renderCodeBtn()}
          <TouchableOpacity onPress={this._resendCode} style={styles.resendContainer}>
            <Text style={{color:'#334F64',fontSize: 16}}>Resend verification code</Text>  
          </TouchableOpacity></View>)}
          </View>
          {!this.state.showCode ?          
          <Text style={styles.TextBottom}>
            By signing up, you agree to our Terms of Service and acknowledge that our Privacy Police applies to you.
           </Text> : <Text style={styles.TextBottom} />}
        </ImageBackground>    
      </View>
    );
  }
  
 

 _renderMainStuff() {
    if (!this.state.showCode) {
      return (
        <>
        <TextInput
          returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
          style={styles.phonenr}
          keyboardType={'phone-pad'}
          placeholder="Enter your phone number"
          onChangeText={this._handleChangeText}
          value={this.state.ph_text}
          editable={this.state.enablePh}
        />
        <TouchableOpacity
      style={
        styles.loginIosButton
      }
      onPress={this._onLoginPressButton}
      underlayColor="#fff">
      <Text 
        style={
        styles.loginIosText}
        >

        SIGN IN
      </Text>
    </TouchableOpacity>
    </>
      );
    } else {
      return null;
    }
  }

 _renderCodeStuff() {
    if (this.state.showCode) {
      return (
      <View
      style={{marginTop:40}}>
        <SmoothPinCodeInput
          value={this.state.userPinCode}
          onTextChange={code => this.setState({ userPinCode:code })}
          cellStyle={{borderWidth:0,backgroundColor:'#E0DEDD'}}
          codeLength={6}
          />
      </View>
       
      );
    } else {
      return null;
    }
  }

  _renderCodeBtn() {
    if (this.state.showCode) {
      if (Platform.OS === 'ios') {
        return this._renderIOSVerifyButton();
      } else {
        return (
            <TouchableOpacity
            style={styles.loginIosButton}
              onPress={this._onVerifyPressButton}
              color="#F05A22"
            >
            <Text style={styles.loginIosText}>VERIFY</Text>
            </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  }

  _resendCode(){
    console.log('Send code by fetching an api from the backend side');
  }

  _renderIOSVerifyButton() {
    return (
      <TouchableOpacity
      style={ styles.loginIosButton
      }
        onPress={this._onVerifyPressButton}
        underlayColor="#fff">
        <Text
          style={
            styles.loginIosDisabledText
          }>
          VERIFY
        </Text>
      </TouchableOpacity>
    );
  }                                    
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  logoBackGround: {
    flex: 1,
    paddingVertical:80,
    alignItems: 'center',
    width: '100%',
  },
  TextBottom: {
    color: '#334F64',
    position:'absolute',
    paddingHorizontal:10,
    bottom:15,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 7,
  },
  loginIosButton: {
    backgroundColor: '#F05E31',
    color: '#F05E31',
    height: 50,
    marginTop: 30,
    borderRadius: 25,
  },
  phonenr: {
    alignItems: 'center',
    textAlign: 'center',
    color: '#333333',
    backgroundColor: '#E0DEDD',
    width: 300,
    marginTop: 40,
  },
  loginIosText: {
    color: '#FFFFFF',
    margin: 10,
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  loginIosDisabledButton: {
    backgroundColor: '#EEEEEE',
  },
  loginIosDisabledText: {
    color: '#AAAAAA',
    margin: 7,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  resendContainer:{
    display:'flex',
    alignItems:'center',
    paddingTop:20,
    
    
   
  },
 
});
