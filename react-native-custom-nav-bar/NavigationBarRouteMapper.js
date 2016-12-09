import React from 'react'
import { Text, View } from 'react-native'
import NavButtons from './NavButtons'
// Stylesheet
import styles from './styles/NavigationStyle'

export default {
  CreateButton (button, navigator) {
    let handle = () => {};
    if (button.handle) {
      handle = button.handle;
    }
    switch (button.action) {
      case 'BACK':
        return NavButtons.backButton(this.BackButton.bind(this, navigator))
      case 'CUSTOM':
        return NavButtons.customButton(handle, button.express)
      default:
        return (<View />)
    }
  },

  BackButton (navigator) {
    if (navigator.state.activeGesture === null && navigator.state.pendingGestureProgress === null) {
      navigator.pop()
    }
  },

  // drives
  LeftButton (route, navigator, index, navState) {
    if (navState.leftButton) {
      return navState.leftButton
    } else if (route.leftButton) {
      return this.CreateButton(route.leftButton, navigator, route)
    }
    return null
  },

  RightButton (route, navigator, index, navState) {
    if (navState.rightButton) {
      if (navState.rightButton.custom) {
        return navState.rightButton
      }
      return this.CreateButton(navState.rightButton, navigator)
    } else if (route.rightButton) {
      return this.CreateButton(route.rightButton, navigator)
    }
  },

  renderSubtitle (sub, routeSub) {
    if (sub) {
      return (
        <View>
          <Text allowFontScaling={false} style={styles.navSubtitle}>
            {sub || routeSub}
          </Text>
        </View>
      )
    } else {
      return (<View />)
    }
  },

  Title (route, navigator, index, navState) {
    return (
      <View style={styles.titleWrapper}>
        <Text allowFontScaling={false} style={styles.navTitle}>
          {navState.title || route.title}
        </Text>
        {this.renderSubtitle(navState.subtitle, route.subtitle)}
      </View>
    )
  }
}
