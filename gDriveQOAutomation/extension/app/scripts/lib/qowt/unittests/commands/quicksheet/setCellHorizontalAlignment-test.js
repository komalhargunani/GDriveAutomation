// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/quicksheet/setCellHorizontalAlignment',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellHorizontalAlignment, CellFormatTestUtils) {

  'use strict';

  describe('SetCellHorizontalAlignment command', function() {

    CellFormatTestUtils.getTestSuite(
        ['l', 'r', 'c'],
        {
          name: 'SetCellHorizontalAlignment',
          factory: SetCellHorizontalAlignment
        });
  });
});



