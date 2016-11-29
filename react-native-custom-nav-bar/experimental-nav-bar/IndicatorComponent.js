import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';

class IndicatorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showing : false,
      text: '',
    }
  }
  setShowing(state) {
    this.setState(state);
  }
  render() {
    if (this.state.showing || this.props.showing) {
      return(
        <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: '#0000',}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
              size="large"
              color="#FFF8" />
            <Text style={{color: '#FFFFFF'}}>
              {this.state.text}
            </Text>
           </View>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }
}export default IndicatorView;
