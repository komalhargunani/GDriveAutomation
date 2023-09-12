// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/quicksheet/setCellFontSize',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellFontSize, CellFormatTestUtils) {

  'use strict';

  describe('SetCellFontSize command', function() {
    CellFormatTestUtils.getTestSuite(
        [12, 24, 36],
        {
          name: 'SetCellFontSize',
          factory: SetCellFontSize
        });
  });
});

