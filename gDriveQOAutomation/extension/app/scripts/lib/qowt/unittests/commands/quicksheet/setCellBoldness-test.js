// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/quicksheet/setCellBoldness',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellBoldness, CellFormatTestUtils) {

  'use strict';

  describe('SetCellBoldness command', function() {
    CellFormatTestUtils.getTestSuite(
        [true, false],
        {
          name: 'SetCellBoldness',
          factory: SetCellBoldness
        });
  });
});

