
/**
 * @fileoverview suite wrapper for all config tests
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'configs',

    suites: [
      'unitTestRoot/configs/configs-test',
      'unitTestRoot/configs/buttonConfigs/wordStyleButton-test',
      'unitTestRoot/configs/buttonConfigs/drawing/addShapeButton-test',
      'unitTestRoot/configs/buttonConfigs/drawing/insertTextBoxButton-test',
      'unitTestRoot/configs/buttonConfigs/fontSizeButton-test',
      'unitTestRoot/configs/buttonConfigs/fontFaceButton-test',
      'unitTestRoot/configs/buttonConfigs/documentButtons/fontFaceButton-test',
      'unitTestRoot/configs/buttonConfigs/textColorButton-test',
      'unitTestRoot/configs/buttonConfigs/documentButtons/textColorButton-test',
      'unitTestRoot/configs/buttonConfigs/sheetButtons/textColorButton-test',
      'unitTestRoot/configs/buttonConfigs/sheetButtons/' +
          'backgroundColorButton-test',
      'unitTestRoot/configs/buttonConfigs/wrapTextButton-test',
      'unitTestRoot/configs/buttonConfigs/sheetButtons/wrapTextButton-test'
    ]
  };

  return _api;
});

