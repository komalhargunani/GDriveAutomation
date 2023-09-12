// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test for the SetCellTextColor command.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/commands/quicksheet/setCellTextColor',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellTextColor, CellFormatTestUtils) {

  'use strict';

  describe('SetCellTextColor command', function() {
    CellFormatTestUtils.getTestSuite(
        ['000000', '434343', '666666', 'E6B8AF', 'F4CCCC', 'NONE'],
        {
          name: 'SetCellTextColor',
          factory: SetCellTextColor
        });
  });
});
