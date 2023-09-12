// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for setCellWrapText command
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */
define([
  'qowtRoot/commands/quicksheet/setCellWrapText',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellWrapText, CellFormatTestUtils) {

  'use strict';

  describe('SetCellWrapText command', function() {
    CellFormatTestUtils.getTestSuite(
        [true, false],
        {
          name: 'SetCellWrapText',
          factory: SetCellWrapText
        });
  });
});
