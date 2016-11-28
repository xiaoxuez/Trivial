'use strict';
import React, {} from 'react';
import {
  Dimensions,
  Platform,
} from 'react-native';

var SCREEN_WIDTH = Dimensions.get('window').width;
var NAV_BAR_HEIGHT = 44;
var STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
var NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

var buildStyleInterpolator = require('buildStyleInterpolator');
var merge = require('merge');

var BASE_STYLES = {
  Title: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    left: 0,
    right: 0,
    justifyContent: 'center',
    height: NAV_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  LeftButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    left: 0,
    overflow: 'hidden',
    justifyContent: 'center',
    opacity: 1,
    height: NAV_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
  RightButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    right: 0,
    overflow: 'hidden',
    opacity: 1,
    justifyContent: 'center',
    height: NAV_BAR_HEIGHT,
    backgroundColor: 'transparent',
  },
};

var Stages = {
  Left: {
    Title: Object.assign({}, BASE_STYLES.Title, { left: -SCREEN_WIDTH / 2, opacity: 0 }),
    LeftButton: Object.assign({}, BASE_STYLES.LeftButton, { left: -SCREEN_WIDTH / 3, opacity: 0 }),
    RightButton: Object.assign({}, BASE_STYLES.RightButton, { opacity: 0 }),
  },
  Center: {
    Title: Object.assign({}, BASE_STYLES.Title, { left: 0, opacity: 1 }),
    LeftButton: Object.assign({}, BASE_STYLES.LeftButton, { left: 0, opacity: 1 }),
    RightButton: Object.assign({}, BASE_STYLES.RightButton, { opacity: 1 }),
  },
  Right: {
    Title: Object.assign({}, BASE_STYLES.Title, { left: SCREEN_WIDTH / 2, opacity: 0 }),
    LeftButton: Object.assign({}, BASE_STYLES.LeftButton, { left: 0, opacity: 0 }),
    RightButton: Object.assign({}, BASE_STYLES.RightButton, { opacity: 0 }),
  },
};

var opacityRatio = 100;

function buildSceneInterpolators(startStyles, endStyles) {
  return {
    Title: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.Title.opacity,
        to: endStyles.Title.opacity,
        min: 0,
        max: 1,
      },
      left: {
        type: 'linear',
        from: startStyles.Title.left,
        to: endStyles.Title.left,
        min: 0,
        max: 1,
        extrapolate: true,
      },
    }),
    LeftButton: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.LeftButton.opacity,
        to: endStyles.LeftButton.opacity,
        min: 0,
        max: 1,
        round: opacityRatio,
      },
      left: {
        type: 'linear',
        from: startStyles.LeftButton.left,
        to: endStyles.LeftButton.left,
        min: 0,
        max: 1,
      },
    }),
    RightButton: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.RightButton.opacity,
        to: endStyles.RightButton.opacity,
        min: 0,
        max: 1,
        round: opacityRatio,
      },
      left: {
        type: 'linear',
        from: startStyles.RightButton.left,
        to: endStyles.RightButton.left,
        min: 0,
        max: 1,
        extrapolate: true,
      },
    }),
  };
}

var Interpolators = {
  // Animating *into* the center stage from the right
  RightToCenter: buildSceneInterpolators(Stages.Right, Stages.Center),
  // Animating out of the center stage, to the left
  CenterToLeft: buildSceneInterpolators(Stages.Center, Stages.Left),
  // Both stages (animating *past* the center stage)
  RightToLeft: buildSceneInterpolators(Stages.Right, Stages.Left),
};


module.exports = {
  General: {
    NavBarHeight: NAV_BAR_HEIGHT,
    StatusBarHeight: STATUS_BAR_HEIGHT,
    TotalNavHeight: NAV_HEIGHT,
  },
  Interpolators,
  Stages,
};
