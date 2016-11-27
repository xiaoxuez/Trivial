import React, { Component } from 'react';
var tweenState = require('react-tween-state');
import TimerMixin from 'react-timer-mixin';
import {
  PanResponder,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  LayoutAnimation,
} from 'react-native';
var styles = require('./styles.js');
import * as Animatable from 'react-native-animatable';

class SwipeoutImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      uri: this.props.uri,
      selected: this.props.selected,
      height: 0,
    }
  }

  render() {
    var image = this.props;
    var styleSwipeoutImageBG = {alignItems: 'center',
                                justifyContent: 'center',
                                height: image.height,};
    var styleSwipeoutImageRoundBG = [styles.swipeoutImageRoundBG];
    styleSwipeoutImageRoundBG.push([{
      backgroundColor: this.props.selected ? 'red' : 'transparent',
    }])
    var styleSwipeoutImage = {
      height: 22,
      width: 22,
      overflow: 'hidden',
    };
    return (
        <View style={styleSwipeoutImageBG}>
        <View style={styleSwipeoutImageRoundBG}>
          <Image style={styleSwipeoutImage}
            source={this.state.uri} />
            </View>
        </View>
    )
  }
}

class SwipeoutBtn extends Component{
  constructor(props){
    super(props);
    this.state = {
      backgroundColor: null,
      color: null,
      component: null,
      underlayColor: null,
      height: 0,
      key: null,
      onPress: null,
      text: 'Click me',
      type: '',
      width: 0,
    }
  }

  componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>  true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>   true,
      onPanResponderGrant: this.props.onPress.bind(this),
      onResponderTerminationRequest: (evt) => false,
    });
  }
  render() {
    var btn = this.props

    var styleSwipeoutBtn = [styles.swipeoutBtn]

    //  apply "type" styles (delete || primary || secondary)
    if (btn.type === 'delete') styleSwipeoutBtn.push(styles.colorDelete)
    else if (btn.type === 'primary') styleSwipeoutBtn.push(styles.colorPrimary)
    else if (btn.type === 'secondary') styleSwipeoutBtn.push(styles.colorSecondary)

    //  apply background color
    if (btn.backgroundColor) styleSwipeoutBtn.push([{ backgroundColor: btn.backgroundColor }])

    styleSwipeoutBtn.push([{
      height: btn.height,
      width: btn.width,
    }])

    var styleSwipeoutBtnComponent = []

    //  set button dimensions
    styleSwipeoutBtnComponent.push([{
      height: btn.height,
      width: btn.width,
    }])

    var styleSwipeoutBtnText = [styles.swipeoutBtnText]

    //  apply text color
    if (btn.color) styleSwipeoutBtnText.push([{
      color: btn.color,
      fontSize: 30,
      fontWeight: '600',}])

      return  (
        <View
          {...this._panResponder.panHandlers}
          style={styles.swipeoutBtnTouchable}
          >
          <View style={styleSwipeoutBtn}>
            {btn.component ?
              <View style={styleSwipeoutBtnComponent}>{btn.component}</View>
              : <Text style={styleSwipeoutBtnText}>{btn.text}</Text>
          }
        </View>
      </View>
    )
  }
}

var Swipeout = React.createClass({
  mixins: [tweenState.Mixin, TimerMixin],

  getDefaultProps: function() {
    return {
      onOpen: function(sectionID, rowID) {console.log('onOpen: '+sectionID+" "+rowID)},
      rowID: -1,
      sectionID: -1,
      disableLeft: false,
      disableRight: false,
    }
   },
   getInitialState: function() {
     return {
       autoClose: this.props.autoClose || false,
       btnWidth: 0,
       btnsLeftWidth: 0,
       btnsRightWidth: 0,
       contentHeight: 0,
       contentPos: 0,
       contentWidth: 0,
       openedRight: false,
       swiping: false,
       tweenDuration: 160,
       timeStart: null,
       highlight: 0,
     }
   },
   componentWillMount: function() {
     this.parentScrollEnabled = true;
     this._panResponder = PanResponder.create({
       onMoveShouldSetPanResponderCapture: (event, gestureState) =>  (Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 2),
       onPanResponderGrant: this._handlePanResponderGrant,
       onPanResponderMove: this._handlePanResponderMove,
       onPanResponderRelease: this._handlePanResponderEnd,
       onPanResponderTerminate: this._handlePanResponderEnd,
       onShouldBlockNativeResponder: (event, gestureState) => true,
     });
   },
   componentWillReceiveProps: function(nextProps) {
    if (nextProps.close) this._close()
   },
   _handlePanResponderGrant: function(e: Object, gestureState: Object) {
     this.props.onOpen(this.props.sectionID, this.props.rowID)
     this.refs.swipeoutContent.measure((ox, oy, width, height) => {
       this.setState({
         btnWidth: 44,
         btnsLeftWidth: this.props.left ? 44*this.props.left.length : 0,
         btnsRightWidth: this.props.right ? 44*this.props.right.length : 0,
         swiping: true,
         timeStart: (new Date()).getTime(),
         highlight: 0,
       })
     })
   },
   _handlePanResponderMove: function(e: Object, gestureState: Object) {

     var posX = gestureState.dx
     var posY = gestureState.dy
     if (this.parentScrollEnabled) {
      // disable scrolling on the listView parent
      this.parentScrollEnabled = false;
      this.props.setScrollEnabled && this.props.setScrollEnabled(false);
     }
     var btnWidth = this.state.btnWidth;
     var leftWidth = this.state.btnsLeftWidth
     var rightWidth = this.state.btnsRightWidth
     if (this.state.openedRight) var posX = gestureState.dx - rightWidth
     else if (this.state.openedLeft) var posX = gestureState.dx + leftWidth

     var selectedIndex = parseInt(posX / 1.0 / btnWidth - 0.3);
     selectedIndex = !this.props.disableLeft && selectedIndex >=  this.props.left.length ? this.props.left.length : selectedIndex;
     if (this.state.highlight != selectedIndex) {
       this.setState({
         highlight: selectedIndex,
       })
     }

     //  prevent scroll if moveX is true
     var moveX = Math.abs(posX) > Math.abs(posY)
     if (this.props.scroll) {
       if (moveX) this.props.scroll(false)
       else this.props.scroll(true)
     }
     if (this.state.swiping) {
       //  move content to reveal swipeout
       if (posX < 0 && !this.props.disableRight && this.props.right) this.setState({ contentPos: Math.min(posX, 0) })
       else if (posX > 0 && !this.props.disableLeft && this.props.left) this.setState({ contentPos: Math.max(posX, 0) })
     }
   },

   _handlePanResponderEnd: function(e: Object, gestureState: Object) {
     if (!this.parentScrollEnabled) {
       this.parentScrollEnabled = true;
       this.props.setScrollEnabled && this.props.setScrollEnabled(true);
     }
     var posX = gestureState.dx
     var contentPos = this.state.contentPos
     var contentWidth = this.state.contentWidth
     var btnWidth = this.state.btnWidth
     var btnsLeftWidth = this.state.btnsLeftWidth
     var btnsRightWidth = this.state.btnsRightWidth

     if (posX >= 0 && !this.props.disableLeft && this.props.left) {
       var selectedIndex = parseInt(posX / 1.0 / btnWidth - 0.3);
       selectedIndex = selectedIndex >= this.props.left.length ? this.props.left.length : selectedIndex;
       if ((selectedIndex - 1) >= 0) {
        //右滑反馈需要的时候在对应控件中写上open方法即可
        // this.refs._child.open(selectedIndex);
        console.log('selectedIndex = '+ selectedIndex);
       }
       this._close();
     } else {
       //  minimum threshold to open swipeout
       var openX = contentWidth*0.33

       //  should open swipeout
       var openRight = posX < -openX || posX < -btnsRightWidth/2

       //  account for open swipeouts
       if (this.state.openedRight) var openRight = posX-openX < -openX

       //  reveal swipeout on quick swipe
       var timeDiff = (new Date()).getTime() - this.state.timeStart < 200
       if (timeDiff) {
         var openRight = posX < -openX/10 && !this.state.openedLeft
       }

       if (this.state.swiping) {
         if (openRight && contentPos < 0 && posX < 0) {
           // open swipeout right
           this._tweenContent('contentPos', -btnsRightWidth)
           this.setState({ contentPos: -btnsRightWidth, openedLeft: false, openedRight: true })
           this.props.onRowOpen && this.props.onRowOpen();
         } else {
           // close swipeout
           this.props.onRowClose && this.props.onRowClose();
           this._tweenContent('contentPos', 0)
           this.setState({ contentPos: 0, openedLeft: false, openedRight: false })
         }
       }
     }
     //  Allow scroll
     if (this.props.scroll) this.props.scroll(true)
   },
   _tweenContent: function(state, endValue) {
     this.tweenState(state, {
       easing: tweenState.easingTypes.easeInOutQuad,
       duration: endValue === 0 ? this.state.tweenDuration*1.5 : this.state.tweenDuration,
       endValue: endValue
     })
   },
   _rubberBandEasing: function(value, limit) {
     if (value < 0 && value < limit) return limit - Math.pow(limit - value, 0.85);
     else if (value > 0 && value > limit) return limit + Math.pow(value - limit, 0.85);
     return value;
   },
   _autoClose: function(btn) {
     let onPress = btn.onPress
     if (onPress){
       onPress();
     }
     if (this.state.autoClose) this._close()
   },
   _close: function() {
    this._tweenContent('contentPos', 0)
    this.setState({
      openedRight: false,
      openedLeft: false,
    })
   },
   render: function() {
     var contentWidth = this.state.contentWidth
     var posX = this.getTweeningValue('contentPos')

     var styleSwipeout = [styles.swipeout]
     if (this.props.backgroundColor) {
       styleSwipeout.push([{ backgroundColor: this.props.backgroundColor }])
     }

     var limit = -this.state.btnsRightWidth
     if (posX > 0) var limit = this.state.btnsLeftWidth

     var styleLeftPos = StyleSheet.create({
       left: {
         left: 0,
         overflow: 'hidden',
         width: Math.min(limit*(posX/limit), limit),
       }
     })
     var styleRightPos = StyleSheet.create({
       right: {
         left: Math.abs(contentWidth + Math.max(limit, posX)),
         right: 0,
       }
     })
     var styleContentPos = StyleSheet.create({
       content: {
         left: this._rubberBandEasing(posX, limit),
       }
     })

     var styleContent = [styles.swipeoutContent]
     styleContent.push(styleContentPos.content)

     var styleRight = [styles.swipeoutBtns]
     styleRight.push(styleRightPos.right)

     var styleLeft = [styles.swipeoutBtns]
     styleLeft.push(styleLeftPos.left)

     var isRightVisible = posX < 0;
     var isLeftVisible = posX > 0;
     return (
     <View style={{backgroundColor: '#000000', flex: 1, flexDirection: 'row'}}>
     {this.props.fShakeAnimation == true ? <Image style={{position: 'absolute', top: 90, left: 0, width: 85, height: 40}} source={{uri: 'http://7xv8d1.com1.z0.glb.clouddn.com/timeflows_operation_left_array_bg.png'}} /> : <View />}
         <Animatable.View
         style={styleSwipeout}
         animation={this.props.fShakeAnimation == true ? 'shake' : ''}
         easing='ease-out'
         iterationCount='infinite'
         >
           <View
             ref="swipeoutContent"
             style={styleContent}
             onLayout={this._onLayout}
             {...this._panResponder.panHandlers}>
             {this.renderVisibleContent()}
           </View>
         </Animatable.View>

       { this._renderButtons(this.props.right, isRightVisible, styleRight) }
       { this._renderImages(this.props.left, isLeftVisible, styleLeft) }
    </View>
  )},
     _onLayout: function(event) {
       var { width, height } = event.nativeEvent.layout;
       this.setState({
         contentWidth: width,
         contentHeight: height
       });
     },

     _renderColorView: function() {
       return (
         <View style={{
             top: 0,
             bottom: 0,
             position: 'absolute',
             flexDirection: 'column',
             backgroundColor: 'red',
             justifyContent: 'center'}}>
             <View style={{flexDirection: 'row',
               justifyContent: 'space-between',
               height: 120,
               backgroundColor: 'black'}}>
               <View style={{width: 50, height: 50, backgroundColor: 'powderblue'}} />
               <View style={{width: 50, height: 50, backgroundColor: 'skyblue'}} />
               <View style={{width: 50, height: 50, backgroundColor: 'steelblue'}} />
             </View>
           </View>
         );
       },

     _renderImages: function(Images, isVisible, style) {
       if (Images && isVisible) {
         return( <View style={style}>
             { Images.map(this._renderImage) }
         </View>);
       } else {
         return (
           <View/>
         );
       }
     },

     _renderImage: function(img, index, selected) {
       var selected = this.state.highlight
       return (
         <SwipeoutImage
           key={index}
           type={img.type}
           selected={(index + 1) == selected}
           uri={img.uri}
           height={this.state.contentHeight}
           />
       )
     },

     _renderButtons: function(buttons, isVisible, style) {
       if (buttons && isVisible) {
         return( <View style={style}>
           { buttons.map(this._renderButton) }
         </View>);
       } else {
         return (
           <View/>
         );
       }
     },

     _renderButton: function(btn, i) {
       return (
         <SwipeoutBtn
           backgroundColor={btn.backgroundColor}
           color={btn.color}
           component={btn.component}
           height={this.state.contentHeight}
           key={i}
           onPress={() => this._autoClose(btn)}
           text={btn.text}
           type={btn.type}
           underlayColor={btn.underlayColor}
           width={this.state.btnWidth}/>
       )
     },
    renderVisibleContent() {
    //  handle touchables
       return React.cloneElement(
         this.props.children,
         {
           ...this.props.children.props,
           ref: '_child',
         }
       );
     },
   })

   module.exports = Swipeout
