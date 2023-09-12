
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all utils tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'utils',

    suites: [
      'unitTestRoot/utils/mockKeyboard/keyCodes-test',
      'unitTestRoot/utils/mockKeyboard/events-test',
      'unitTestRoot/utils/mockKeyboard/keys-test',
      'unitTestRoot/utils/mockKeyboard/text-test',
      'unitTestRoot/utils/mockKeyboard/keyboard-test',
      'unitTestRoot/utils/mockKeyboard/mockKeyboard-system-test',
      'unitTestRoot/utils/charts/barChartBuilder-test',
      'unitTestRoot/utils/charts/chartRenderer-test',
      'unitTestRoot/utils/charts/chartUtils-test',
      'unitTestRoot/utils/charts/columnChartBuilder-test',
      'unitTestRoot/utils/charts/lineChartBuilder-test',
      'unitTestRoot/utils/charts/percentStackedChartBuilder-test',
      'unitTestRoot/utils/charts/pieChartBuilder-test',
      'unitTestRoot/utils/charts/scatterChartBuilder-test',
      'unitTestRoot/utils/converter/colNum2colNameBidi-test',
      'unitTestRoot/utils/converter/num2alpha-test',
      'unitTestRoot/utils/converter/num2roman-test',
      'unitTestRoot/utils/converter/rgb2hex-test',
      'unitTestRoot/utils/converter/rgb2percentageRgbBidi-test',
      'unitTestRoot/utils/converter/twip2pt-test',
      'unitTestRoot/utils/converter/eighthpt2pt-test',
      'unitTestRoot/utils/converter/pt2em-test',
      'unitTestRoot/utils/dataStructures/stackFactory-test',
      'unitTestRoot/utils/cssManager-test',
      'unitTestRoot/utils/cssCache-test',
      'unitTestRoot/utils/dateFormatter-test',
      'unitTestRoot/utils/domListener-test',
      'unitTestRoot/utils/domTextSelection-test',
      'unitTestRoot/utils/domTreeBranch-test',
      'unitTestRoot/utils/domUtils-test',
      'unitTestRoot/utils/errorUtils-test',
      'unitTestRoot/utils/fieldManager-test',
      'unitTestRoot/utils/filters/paragraphStyleNameFilter-test',
      'unitTestRoot/utils/fontManager-test',
      'unitTestRoot/utils/formulaUtils-test',
      'unitTestRoot/utils/framework-test',
      'unitTestRoot/utils/functionUtils-test',
      'unitTestRoot/utils/idGenerator-test',
      'unitTestRoot/utils/listFormatManager-test',
      'unitTestRoot/utils/listFormatManager-utils-test',
      'unitTestRoot/utils/nodeTagger-test',
      'unitTestRoot/utils/pathUtils-test',
      'unitTestRoot/utils/promiseUtils-test',
      'unitTestRoot/utils/search-test',
      'unitTestRoot/utils/stringUtils-test',
      'unitTestRoot/utils/style/styleResolver-test',
      'unitTestRoot/utils/userFeedback-test'
    ]
  };

  return _api;
});
