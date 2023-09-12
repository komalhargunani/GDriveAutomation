// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/quicksheet/setCellVerticalAlignment',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellVerticalAlignment, CellFormatTestUtils) {

  'use strict';

  describe('SetCellVerticalAlignment command', function() {

    CellFormatTestUtils.getTestSuite(
        ['t', 'b', 'c'],
        {
          name: 'SetCellVerticalAlignment',
          factory: SetCellVerticalAlignment
        });
  });
});

