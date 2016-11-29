import React, {Component, PropTypes} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

var {height} = Dimensions.get('window');

class NavigatorRootView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      rightBarItemAction: null,
      rightBarItemTitle: null,
    }
  }

  setNavState(state) {
    this.setState(state);
  }



  render() {
    let renderNavigatorBarItem = function(barTitle, target) {
      let barTitleColor = barTitle ? '#FFFFFF' : '#1E1E2C';
      return (
        <TouchableHighlight
          onPress={() => {
            target ? target() : null;
          }}
          underlayColor='transparent'
          disabled={!barTitle}
          style={styles.navigator_bar_item_container}>
          <Text style={[styles.navigator_bar_text_container, {color: barTitleColor}]}>
            {barTitle ? barTitle : ''}
          </Text>
        </TouchableHighlight>
      )
    }

    let renderNavigatorTitle = function(title) {
      return (
        <View style={styles.navigator_title_container}>
          {this.props.renderMiddleTitle ? this.props.renderMiddleTitle() : (
            <Text style={styles.navigator_bar_text_container}>
              {title}
            </Text>
          )}
        </View>
      )
    }
    let title = this.state.title ? this.state.title : this.props.title;
    let rightBarItemAction = this.state.rightBarItemAction ? this.state.rightBarItemAction : this.props.rightBarItemAction;
    let rightBarItemTitle = this.state.rightBarItemTitle ? this.state.rightBarItemTitle : this.props.rightBarItemTitle;
    return (
      <View style={styles.container} {...this.props}>
        <View style={styles.state_container} />
        {this.props.renderCutomTitle ? (
            <View style={{height: 44,backgroundColor: '#1E1E2C',}}>
              {this.props.renderCutomTitle()}
            </View>
          ) : (
            <View style={styles.navigator_bar_container}>
              {renderNavigatorBarItem(this.props.leftBarItemTitle, this.props.leftBarItemAction)}
              {renderNavigatorTitle.bind(this, title)()}
              {renderNavigatorBarItem(rightBarItemTitle, rightBarItemAction)}
            </View>
          )
        }
        <View style={{flex: 1, backgroundColor: 'white', overflow: 'hidden'}}>
          {this.props.children}
        </View>
      </View>
    )
  }
} export default NavigatorRootView;

NavigatorRootView.propTypes = {
  title: PropTypes.string.isRequired,
  fHiddenTabBar: PropTypes.bool.isRequired,
};

NavigatorRootView.defaultProps = {
  title: 'Unkown',
  fHiddenTabBar: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  state_container: {
    height: 20,
    backgroundColor: '#1E1E2C',
  },
  navigator_bar_container: {
    height: 44,
    backgroundColor: '#1E1E2C',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navigator_bar_item_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigator_title_container: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigator_bar_text_container: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
  },
})
