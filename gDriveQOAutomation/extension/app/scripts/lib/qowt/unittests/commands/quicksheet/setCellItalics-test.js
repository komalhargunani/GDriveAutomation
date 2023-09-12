// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/quicksheet/setCellItalics',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellItalics, CellFormatTestUtils) {

  'use strict';

  describe('SetCellItalics command', function() {
    CellFormatTestUtils.getTestSuite(
        [true, false],
        {
          name: 'SetCellItalics',
          factory: SetCellItalics
        });
  });
});
