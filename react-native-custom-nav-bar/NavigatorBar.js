import React from 'react'
import { Navigator } from 'react-native'
import NavigationBarRouteMapper from './NavigationBarRouteMapper'
import NavigationStyles from './styles/NavigationBarStyles';

// Stylesheet
import styles from './styles/NavigationStyle'
//custom NavigationBar
var merge = require('merge');
export default {
  render (barStyle) {
    return (
      <Navigator.NavigationBar
        navigationStyles={NavigationStyles}
        routeMapper={NavigationBarRouteMapper}
        style={[styles.navigationBar, barStyle]}
      />
    )
  }
}
