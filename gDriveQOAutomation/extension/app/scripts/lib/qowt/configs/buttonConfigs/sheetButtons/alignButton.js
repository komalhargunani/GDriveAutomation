// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview  Return a dropdown button configuration.
 *
 * @param returns {object} A button configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {boolean} config.label True for a textual dropdown,
 *                False for a graphical dropdown.
 * @param returns {string} config.action The widgets requested action.
 * @param returns {object} config.items An array containing all the
 *                button configurations.
 * @param returns {object} subscribe Optional set of signals with callbacks that
 *                give button behaviours.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/configs/buttonConfigs/sheetButtons/alignHorizontalLeftButton',
  'qowtRoot/configs/buttonConfigs/sheetButtons/alignHorizontalCenterButton',
  'qowtRoot/configs/buttonConfigs/sheetButtons/alignHorizontalRightButton',
  'qowtRoot/configs/buttonConfigs/sheetButtons/alignVerticalTopButton',
  'qowtRoot/configs/buttonConfigs/sheetButtons/alignVerticalCenterButton',
  'qowtRoot/configs/buttonConfigs/sheetButtons/alignVerticalBottomButton'
], function(
    AlignHorizontalLeftButtonConfig,
    AlignHorizontalCenterButtonConfig,
    AlignHorizontalRightButtonConfig,
    AlignVerticalTopButtonConfig,
    AlignVerticalCenterButtonConfig,
    AlignVerticalBottomButtonConfig) {

  'use strict';

  return {
    type: 'dropdown',
    action: 'cellAlign',
    items: [
      AlignHorizontalLeftButtonConfig,
      AlignHorizontalCenterButtonConfig,
      AlignHorizontalRightButtonConfig,
      AlignVerticalTopButtonConfig,
      AlignVerticalCenterButtonConfig,
      AlignVerticalBottomButtonConfig
    ]
  };
});