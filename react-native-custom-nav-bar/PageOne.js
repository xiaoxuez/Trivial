import React, {Component} from 'react';
import {
  View,
  AppRegistry,
  Navigator,
} from 'react-native';

export default class extends Component {

  componentWillMount() {
    const {navigator} = this.props;
    if (navigator) {
      navigator.setState({
        rightButton: {
          action: 'CUSTOM',
          express: '自定义',
        },
      })
    }
  }
  
  render() {
    return(
      <View>
      </View>
    )
  }
}
