import React, {Component} from 'react';
import {
  View,
  AppRegistry,
  Navigator,
  StyleSheet,
  Text,
} from 'react-native';
import PageOne from './PageOne';
import NavigationBar from './NavigatorBar.js';


class App extends Component {
  render() {
    let defaultName = 'HomePage';
    let defaultComponent = HomePage;
    const CustomPushRemoveGestures = Object.assign({}, Navigator.SceneConfigs.PushFromRight, {gestures: {}});
    return(
      <Navigator
        initialRoute={{ title:defaultName, name: defaultName,component: defaultComponent }}
        configureScene={(route,_navigator) => {
          return route.sceneConfig ? route.sceneConfig : CustomPushRemoveGestures;
        }}
        renderScene={(route, navigator) => {
          let Component  = route.component;
          _navigator = navigator 
          return <Component {...route.params} navigator={navigator} />
        }}
        navigationBar={NavigationBar.render()}
        sceneStyle ={styles.sub_navi_page}
      />
    )
  }
}

class HomePage extends Component {
  render() {
    return(
      <View style={{flex: 1, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center',}}>
        <Text onPress={this.onPress.bind(this)}>
          打开下一页
        </Text>
      </View>
    )
  }

  onPress() {
    const {navigator} = this.props;
    if(navigator) {
      navigator.push({
        title:'PageOne',
        name: 'PageOne',
        component: PageOne,
        rightButton: {
          action: 'CUSTOM',
          express: 'sb'
        },
        leftButton: {
          action: 'BACK'
        },
      })
    }
  }
}

var styles = StyleSheet.create({
  sub_navi_page:{
    marginTop: 15,
  },
})

AppRegistry.registerComponent('iOSDemo', () => App);
