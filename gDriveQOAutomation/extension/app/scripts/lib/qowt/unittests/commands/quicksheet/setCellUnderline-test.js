// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/quicksheet/setCellUnderline',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellUnderline, CellFormatTestUtils) {

  'use strict';

  describe('SetCellUnderline command', function() {
    CellFormatTestUtils.getTestSuite(
        [true, false],
        {
          name: 'SetCellUnderline',
          factory: SetCellUnderline
        });
  });
});

