// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/quicksheet/setCellFontFace',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils',
  'qowtRoot/models/sheet'
], function(SetCellFontFace, CellFormatTestUtils, SheetModel) {

  'use strict';

  describe('SetCellFontFace command', function() {
    var _fontNames = ['arial', 'comic sans'];

    var _reverseMap = {};
    for (var i = 0; i < _fontNames.length; i++) {
      _reverseMap[_fontNames[i]] = i;
    }

    beforeEach(function() {
      SheetModel.fontNames = _fontNames;
    });
    CellFormatTestUtils.getTestSuite(
        _fontNames,
        {
          name: 'SetCellFontFace',
          factory: SetCellFontFace
        });
  });
});

