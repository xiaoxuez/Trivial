import {StyleSheet, Platform} from 'react-native';
import Colors from '../themes/Colors.js';
import Fonts from '../themes/Fonts.js';

const NavigationStyle = StyleSheet.create({
  titleWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  navTitle: {
    color: Colors.snow,
    fontSize: Fonts.size.regular,
    fontFamily: Fonts.bold,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  navSubtitle: {
    color: Colors.snow,
    fontSize: Fonts.size.small,
    fontFamily: Fonts.base,
    alignSelf: 'center'
  },
  navButtonText: {
    color: Colors.snow,
    fontFamily: Fonts.bold,
  },
  navButtonLeft: {
    margin: 0
  },
  navButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  navigationBar: {
    marginTop: 0,
    ...Platform.select({
      ios: {
        backgroundColor: Colors.ocean,
      },
      android: {
        backgroundColor: Colors.deepBlue,
      },
    }),
    padding: 0,
    height: 44,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default NavigationStyle
