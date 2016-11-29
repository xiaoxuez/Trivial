import React, {Component, PropTypes} from 'react';
import {
  Navigator,
  View,
  AsyncStorage,
} from 'react-native';

import {readInfoByKey, StorageKey} from './Model/Storage/StorageController';
import Mixpanel from 'react-native-mixpanel';
import PhantomMainView from './Component/Main/MainComponent';

import {connect} from 'react-redux';
import {createSQLite} from './Model/SQLite/SQLiteDatabase';
import {checkVersion} from './Model/Util/Check';
import NavigatorRootView from './Component/Main/NavigatorRootComponent';
import IndicatorView from './CustomUI/IndicatorComponent'

class RootView extends Component {

  componentWillMount() {
    checkVersion();
  }

  render() {
    var defaultName = 'PhantomMainView';
    var defaultComponent = PhantomMainView;
    const CustomPushRemoveGestures = Object.assign({}, Navigator.SceneConfigs.PushFromRight, {gestures: {}});
      return (
        <Navigator
          initialRoute={{name: defaultName, component: defaultComponent}}
          configureScene={(route, routeStack) => {
            return route.sceneConfig ? route.sceneConfig : CustomPushRemoveGestures;
          }}
          renderScene={(route, navigator) => {
            var Component = route.component;
            let indicator = null;
            let customTitle = null;
            let popSelf = function() {
              navigator && navigator.pop();
            }

            let pushPage = function(com, name, params) {
              navigator.push({
                name: name,
                component: com,
                params: params ? params : {},
              })
            }

            let setIndicator = function(state) {
              indicator && indicator.setShowing(state);
            }

            let setNavTitle = function(state) {
              customTitle && customTitle.setNavState(state);
            }

            if (route.params && route.params.hasOwnProperty('title')) {
              return(
                <NavigatorRootView
                  ref={(c) => customTitle = c}
                  title={route.params.title}
                  leftBarItemTitle={route.params.leftBarItemTitle ? route.params.leftBarItemTitle : null}
                  leftBarItemAction={route.params.leftBarItemAction ? route.params.leftBarItemAction  : popSelf}
                  rightBarItemTitle={route.params.rightBarItemTitle ? route.params.rightBarItemTitle : null}
                  rightBarItemAction={route.params.rightBarItemAction ? route.params.rightBarItemAction  : null}>
                  <Component {...route.params} navigator={navigator} popSelf={popSelf} pushPage={pushPage} setIndicator={setIndicator} setNavTitle={setNavTitle}/>
                  <IndicatorView ref={(c) => indicator = c} />
                </NavigatorRootView>
              )
            }

            return (
              <View style={{flex: 1}}>
                <Component {...route.params} navigator={navigator} popSelf={popSelf} pushPage={pushPage} setIndicator={setIndicator} />
                <IndicatorView ref={(c) => indicator = c}/>
              </View>
            )
          }
        } />
      )
    }
  }

  RootView.propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  function mapStateToProps(state) {
    return {
    };
  }

  export default connect(mapStateToProps)(RootView);
