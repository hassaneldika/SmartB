/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable consistent-this */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
import Alertfunction from './CustomAlert';
import ResponsiveFontSize from './ResponsiveFontsize';
import Geolocation from 'react-native-geolocation-service';
import Config from 'react-native-config';
import * as React from 'react';
import { Text, Image, StyleSheet, Alert, View, Button, TouchableOpacity, Platform, Dimensions, TextInput, ScrollView } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { seed } from '../../src/utils/uuidSeed';
import CollapsibleList from 'react-native-collapsible-list';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Header from './Header';
import mapStyle from './mapStyle';
import { GetKey, SetKey } from '../core/async-storage/AsyncData';
import { getUserProjects } from '../core/api/Api';
import {getDistance} from 'geolib';

const Screenwidth = Dimensions.get('window').width;
const Screenheight = Dimensions.get('window').height;

export default class DetailScreen extends React.Component {
  // userdata =   {"phone_number":"2066188318","projects":[{"_id":"5a8b310123638d467c0c0878","name":"Project Test","address":"1228 West Ave","city":"Miami Beach","state":"FL","zip":"33139","device_id":"mg5a8b310123638d467c0c0878"},{"_id":"5b6883416c021e64537ef166","name":"SmartBarrel HQ","address":"7390 NE 4th CT","city":"Miami","state":"FL","zip":"33138","device_id":"mg5b6883416c021e64537ef166"}],"user":{"first_name":"Claes","last_name":"Nygren","dbid":1373}}

  constructor(props) {
    super(props);
    this.state = {
      drop_down_data: [{ id: 'abc123', name: 'Please Select Project' }],
      showButtons: false,
      personal: {
        latitude: 0,
        longitude: 0,
        error: null,
      },
      /* 
      for getting user location on the map
      showsUserLocation
     latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421, 
        latitude: 39.7485498,
        longitude: -105.0077106,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },*/
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      Camera: {
        center: {
          latitude: 37.78825,
          longitude: -122.4324,
        },
        pitch: 1,
        heading: 1,

        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: 1,

        // Only when using Google Maps.
        zoom: 0,
      },
      currentProject: '',
      searchFilter: '',
      userLocation: {
        latitude: 39.74955,
        longitude: -105.00782,
      },
      searchFilterData: [
        {
          title: 'Luxury Tower 22',
          distance: '230m',
          latitude: 39.749551,
          longitude: -105.007821,
        },
        {
          title: 'City Center Plaza',
          distance: '7km',
          latitude: 25.784171,
          longitude: -80.1900783,
        },
        {
          title: 'High View Condos',
          distance: '800m',
          latitude: 47.6218475,
          longitude: -122.355551,
        },
        {
          title: 'Luxury Tower 22',
          distance: '230m',
          latitude: 26.342651,
          longitude: -80.102679,
        },
        {
          title: 'City Center Plaza',
          distance: '7km',
          latitude: 40.74114433130455,
          longitude: -73.98983001708984,
        },
        {
          title: 'High View Condos',
          distance: '800m',
          latitude: 25.9578662,
          longitude: -80.2387705,
        },
        {
          title: 'Luxury Tower 22',
          distance: '230m',
          latitude: 25.8575306,
          longitude: -80.1846444,
        },
        {
          title: 'City Center Plaza',
          distance: '7km',
          latitude: 29.766354679441097,
          longitude: -95.37149063255436,
        },
        {
          title: 'Luxury Tower 22',
          distance: '230m',
          latitude: 25.8431163,
          longitude: -80.1883261,
        },
        {
          title: 'City Center Plaza',
          distance: '7km',
          latitude: 26.7056206,
          longitude: -80.0364297,
        },
        {
          title: 'High View Condos',
          distance: '800m',

          latitude: 6.2383958,
          longitude: -75.5604476,
        },
      ],
      projects: [],
      checkedIn: false,
      currentDeviceId: '',
      location: {
        latitude: 0.0,
        longitude: 0.0,
      },
      doDebug: true,
      buttonIsClicked: false,
      AlertBox: [
        {
          alertVisiblity: true,
          Title: 'Default Name',
          Body: 'Default Body',
          //////////////////////////// AlertBox hard coded properties, only overide when we needed
          btnCancelEvent: null,
          btnOnDismissEvent: null,
          btnOkEvent: this.OkClick,
          headerClass:
            Screenwidth > Screenheight
              ? styles.landscapAlertheaderClass
              : styles.AlertheaderClass,
          bodyClass:
            Screenwidth > Screenheight
              ? styles.LandscapAlertbodyClass
              : styles.AlertbodyClass,
          btnClass: styles.AlertbtnClass,
        },
      ],
    };
    //    navigator.geolocation.requestAuthorization();
    /*     AsyncStorage.getItem('token').then(udata => {
      const jdata = JSON.parse(udata);
      if (this.state.doDebug) {console.log(udata);}
      this.setState({
        profilePicture: jdata.user.profilePicture,
        drop_down_data: jdata.projects,
        first_name: jdata.user.first_name,
        last_name: jdata.user.last_name,
        phone_number: jdata.phone_number,
        pincode: jdata.pincode,
        dbid: jdata.user.dbid,
      }); */
    /* 
      this.findCoordinates();
    }); */
  }

  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
  };

  /*   componentDidUpdate(prevState){
    if(this.state.searchFilter != prevState.searchFilter){
      console.log("test")
      var response = this.state.projects.filter((data)=>{ return data.title.toLowerCase().includes(this.state.searchFilter.toLowerCase())})
      this.setState({
        searchFilterData:response
        })
      }
  }
 */

  componentDidMount() {
    GetKey('token').then(res => {
      if (res) {
        const { phone_number, pincode } = JSON.parse(res);
        getUserProjects(phone_number, pincode).then(responseJson => {
          if (responseJson?.projects) {
            this.setState({ projects: responseJson?.projects });
          }
        }).catch(e => { });
      }
    });
    /*     var data = this.state.projects.filter((data)=>data.title.toLowerCase().includes(this.state.searchFilter.toLowerCase()))
    this.setState({
      searchFilterData:data
    }) */
    /*     navigator.geolocation.getCurrentPosition(
      position =>{ this.setState({personel:{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,
        error:null,
      }}
      ), error => console.log(error)},
      {enableHighAccuracy:true, timeout:20000, maximumAge:2000}
      ) */
    let self = this;
    Geolocation.getCurrentPosition(
      position => {
        this.setState({initialPosition:{...position.coords, latitudeDelta: 0.0922,longitudeDelta: 0.0421}  });
      },
      error => {
        if (self.state.doDebug)
          {console.log('test');}
          //Alert.alert('GPS Error', 'Make sure location is enabled.');
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position);
      //      this.setState({lastPosition});
    });
  }

  findCoordinates = () => {
    let self = this;
    Geolocation.getCurrentPosition(
      position => {
        var loc = {
          latitude: 0.0,
          longitude: 0.0,
        };
        if (position.coords != undefined) {
          loc.latitude = position.coords.latitude;
          loc.longitude = position.coords.longitude;
          if (self.state.doDebug) {
            console.log('LOC:' + JSON.stringify(position));
          }
        } else {
          Alert.alert('GPS Error', 'Make sure location is enabled.');
          //console.log("ERROR:"+JSON.stringify(position));
        }
        this.setState((state, props) => ({
          location: loc,
        }));
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };
  /*
    '{"punch": {"duration": {"initiated": 0,"userInput": 0,"lookup": 0,"pictures":0,"finished":0},"phoneNumber": "2066188318","entryType": "app","employee": {"dbid": 1373,"first_name": "Claes","last_name": "Nygren"},"punch_time":1585676063,"uuid":"00000000243c803f-1585599784773-c15c2182-0110-4400-929f-d84e29538783"},"deviceId": "00000000243c803b","timestamp":1585676063}'
  */

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

  goToPunch(item){
    GetKey('token').then(res=>console.log(JSON.parse(res)));
    const {initialPosition} = this.state;
    const obj = {...item,userLocation:initialPosition};
    this.props.navigation.navigate('Punch',obj);
  }

  render() {
    let self = this;

    let optionItems = this.state.drop_down_data.map(proj => {
      return { value: proj.device_id, label: proj.name };
    });
    let worker = this.state.first_name + ' ' + this.state.last_name;
    let phoneNr = this.formatPhoneNumber(this.state.phone_number);

    return (
      <View style={{ flex: 1 }}>
        <Header title="Select a project" />
        <View style={{ height: Screenheight / 3 }}>
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_GOOGLE}
            initialRegion={this.state.initialPosition}
            customMapStyle={mapStyle}
            camera={this.state.camera}
            zoomEnabled={true}
            showsUserLocation={true}
            showsMyLocationButton={true}
            minZoomLevel={0}>
            <Marker
              coordinate={{
                latitude: this.state.userLocation.latitude,
                longitude: this.state.userLocation.longitude,
              }}
            />
            {this.state.projects.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                onPress={() => console.log('123')}
              />
            ))}
          </MapView>
        </View>
        <View style={styles.searchContainer}>
          <Icon name="search1" size={22} color="#A6A6A6" style={styles.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a project"
            keyboardType={'number-pad'}
            onChangeText={e => this.setState({ searchFilter: e })}
          />
        </View>
        <ScrollView>
        {this.state.projects
            .filter(i =>
              i.name
                .toLowerCase()
                .includes(this.state.searchFilter.toLowerCase()),
            ).sort((a,b) => getDistance({ latitude: 37.421998333333335, longitude:-122.08400000000002  },{ latitude: a.latitude, longitude: a.longitude }) > getDistance({ latitude: 37.421998333333335, longitude:-122.08400000000002  },{ latitude: b.latitude, longitude: b.longitude }) ? 1 : -1)
            .map((item, index) => (
              <CollapsibleList
                key={index}
                wrapperStyle={styles.cardInfo}
                buttonPosition="top"
                numberOfVisibleItems={0}
                buttonContent={
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.title}>{item?.name}</Text>
                      <View
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text style={{ fontSize: 10, color: '#707070' }}>
                          Distance
                        </Text>
                        <Text style={{fontSize: 16, color: '#707070'}}>
                          {(getDistance(
                              { latitude: 37.421998333333335, longitude:-122.08400000000002  },
                              { latitude: item.latitude, longitude: item.longitude }
                            ) / 1600) < 3 ? (getDistance(
                              { latitude: 37.421998333333335, longitude:-122.08400000000002  },
                              { latitude: item.latitude, longitude: item.longitude }
                            ) / 1600).toFixed(1) : (getDistance(
                              { latitude: 37.421998333333335, longitude:-122.08400000000002  },
                              { latitude: item.latitude, longitude: item.longitude }
                            ) / 1600).toFixed(0)}mi
                        </Text>
                      </View>
                    </View>
                  </View>
                }>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                  onPress={()=>this.goToPunch(item)}
                    style={styles.loginIosButton}
                    underlayColor="#fff">
                    <Text style={styles.loginIosText}>Punch</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.loginIosButton}
                    underlayColor="#fff">
                    <Text style={styles.loginIosText}>Work Summary</Text>
                  </TouchableOpacity>
                </View>
              </CollapsibleList>
            ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#E0DEDD',
    display: 'flex',
    flexDirection: 'row',
  },
  infoContainer: {
    borderWidth: 0.4,
    borderColor: '#ffb733',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    width: Screenwidth,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#DBDBDB',
    borderRadius: 10,
    zIndex: 20,
    flex: 1,
    color: 'black',
    marginHorizontal: Screenwidth * 0.02,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cardInfo: {
    backgroundColor: '#FFF',
    display: 'flex',
    padding: Screenwidth * 0.03,
    marginHorizontal: Screenwidth * 0.02,
    marginVertical: 5,
    borderRadius: 10,
  },
  searchContainer: {
    marginVertical: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    position: 'absolute',
    marginTop: 15,
    left: Screenwidth * 0.05,
    zIndex: 99,
  },
  loginIosText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  loginIosButton: {
    textAlign: 'center',
    backgroundColor: '#F05E31',
    color: '#F05E31',
    height: 50,
    paddingHorizontal: Screenwidth * 0.1,
    marginHorizontal: Screenwidth * 0.01,
    borderRadius: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#334F64',
  },
  buttonContainer: {
    marginHorizontal: Screenwidth * 0.02,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
});
