
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview suite wrapper for all tools tests
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  var _api = {
    name: 'drawing',

    suites: [
      'unitTestRoot/drawing/color/colorEffect-test',
      'unitTestRoot/drawing/color/colorUtility-test',
      'unitTestRoot/drawing/color/presetColorMap-test',
      'unitTestRoot/drawing/geometry/arrowPathGenerator-test',
      'unitTestRoot/drawing/geometry/canvasPainter-test',
      'unitTestRoot/drawing/geometry/formula-test',
      'unitTestRoot/drawing/geometry/geometryGuideEvaluator-test',
      'unitTestRoot/drawing/geometry/presetMap-test',
      'unitTestRoot/drawing/geometry/geometryManager-test',
      'unitTestRoot/drawing/theme/themeManager-test',
      'unitTestRoot/drawing/theme/themeLineStyleManager-test',
      'unitTestRoot/drawing/theme/themeFillStyleManager-test',
      'unitTestRoot/drawing/theme/themeEffectStyleManager-test',
      'unitTestRoot/drawing/theme/themeStyleRefManager-test',
      'unitTestRoot/drawing/styles/tableStyles/tableStyleClassFactory-test',
      'unitTestRoot/drawing/styles/tableStyles/tableCellStyleHelper-test',
      'unitTestRoot/drawing/styles/tableStyles/tableStyleManager-test',
      'unitTestRoot/drawing/styles/tableStyles/tableCellBorderDefinitions-test',
      'unitTestRoot/drawing/styles/tableStyles/tableStyleDefinitions-test'

    ]
  };

  return _api;
});

