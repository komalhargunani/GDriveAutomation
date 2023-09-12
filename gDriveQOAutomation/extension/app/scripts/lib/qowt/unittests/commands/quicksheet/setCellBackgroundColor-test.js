// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test for the SetCellBackgroundColor command.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/commands/quicksheet/setCellBackgroundColor',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(
    SetCellBackgroundColor,
    CellFormatTestUtils) {

  'use strict';

  describe('SetCellBackgroundColor command', function() {
    CellFormatTestUtils.getTestSuite(
        ['000000', '434343', '666666', 'E6B8AF', 'F4CCCC', 'NONE'],
        {
          name: 'SetCellBackgroundColor',
          factory: SetCellBackgroundColor
        });
  });
});
