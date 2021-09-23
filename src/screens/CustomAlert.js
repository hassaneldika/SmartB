/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {StyleSheet,Platform,View,Text,Dimensions,ScrollView} from 'react-native';
import ResponsiveFontSize from '../../src/screens/ResponsiveFontsize';
import PropTypes from 'prop-types';

// import Dialog from “react-native-dialog”;
import Dialog, {DialogTitle,DialogContent,DialogFooter,DialogButton,SlideAnimation,ScaleAnimation} from 'react-native-popup-dialog';

const screenHeight = Math.round(Dimensions.get('window').height);
const Screenwidth = Dimensions.get('window').width;
const Screenheight = Dimensions.get('window').height;

class Alertfunction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      okPress: false,
    };
  }
  render() {
    this.showDialog();
    return (
      <Dialog
        onTouchOutside={() => {
          this.setState({dialogVisible: true});
        }}
        width={0.9}
        visible={this.state.dialogVisible}
        width={parseInt(ResponsiveFontSize(200))}
        dialogAnimation={new ScaleAnimation()}
        onDismiss={() => {
          if (this.props.onDismissAction != null) {
            this.props.onDismissAction();
          }
        }}
        onHardwareBackPress={() => {
          console.log('onHardwareBackPress');
          this.setState({dialogVisible: true});
          return true;
        }}
        dialogTitle={
          <DialogTitle
            title={this.props.Title}
            align="center"
            textStyle={{fontSize: parseInt(ResponsiveFontSize(14))}}
            style={this.props.headerClass}
            hasTitleBar={false}
          />
        }
        footer={
          <DialogFooter>
            {this.props.CancelButtonAction != null ? (
              <DialogButton
                text="CANCEL"
                bordered
                textStyle={{
                  color: 'black',
                  fontSize: parseInt(ResponsiveFontSize(14)),
                }}
                onPress={() => this.props.CancelButtonAction()}
              />
            ) : (
              <Text allowFontScaling={false} />
            )}
            {this.props.OkButtonAction != null ? (
              <DialogButton
                text="OK"
                bordered
                textStyle={{
                  color: 'black',
                  fontSize: parseInt(ResponsiveFontSize(14)),
                }}
                onPress={() => this.props.OkButtonAction()}
                key="button-2"
              />
            ) : (
              <Text allowFontScaling={false} />
            )}
          </DialogFooter>
        }>
        <DialogContent style={styles.ModalContainer}>
          <View>
            <ScrollView>
              <Text allowFontScaling={false} style={this.props.bodyClass}>{this.props.Body} </Text>
            </ScrollView>
          </View>
        </DialogContent>
      </Dialog>
    );
  }
}

export default Alertfunction;

Alertfunction.propTypes = {
  Title: PropTypes.string,
  Body: PropTypes.string,
  Visible: PropTypes.bool,
  Type: PropTypes.string,
  OkButtonAction: PropTypes.func,
  CancelButtonAction: PropTypes.func,
  onDismissAction: PropTypes.func,
  headerClass: PropTypes.object,
  bodyClass: PropTypes.object,
  btnClass: PropTypes.object,
};

Alertfunction.defaultProps = {
  Title: ' ',
  Type: ' ',
  Body: ' ',
  Visible: false,
  headerClass: null,
  bodyClass: null,
  btnClass: null,
  onDismissAction: null,
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ModalContainer: {},
  landScapModalContainer: {
    height: parseInt(ResponsiveFontSize(50)),
  },
});
