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
          showing: true,
          action: 'CUSTOM',
          express: '自定义',
        },
      })
    }
  }

  componentWillUnmount() {
    this.props.navigator && this.props.navigator.setState({
      rightButton: {
        showing: false,
      },
    })
  }

  render() {
    return(
      <View>
      </View>
    )
  }
}
