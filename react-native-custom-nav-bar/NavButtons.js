import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import styles from './styles/NavigationStyle'

//导航标题Button绘制
export default {

  //返回键
  backButton (onPressFunction) {
    return (
      <TouchableOpacity onPress={onPressFunction} style={styles.navButton}>
          <Text style={styles.navButtonText}>返回</Text>
      </TouchableOpacity>
    )
  },

  customButton(onPressFunction, item){
    return(
     <TouchableOpacity onPress={onPressFunction} style={styles.navButton}>
       {getCustomButton(item)}
     </TouchableOpacity>
    )
  },
}

var getCustomButton = function(item) {
  if (typeof(item) === 'function') {
    return item();
  } else {
    return (
      <Text style={styles.navButtonText}>{item}</Text>
    )
  }
}
