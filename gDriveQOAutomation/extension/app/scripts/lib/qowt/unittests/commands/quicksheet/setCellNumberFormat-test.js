// Copyright 2013 Google Inc. All Rights Reserved.

define([
  'qowtRoot/commands/quicksheet/setCellNumberFormat',
  'qowtRoot/unittests/commands/quicksheet/cellFormatTestUtils'
], function(SetCellNumberFormat, CellFormatTestUtils) {

  'use strict';

  describe('SetCellNumberFormat command', function() {
    CellFormatTestUtils.getTestSuite(
        ['[$-409]d\\-mmm;@', 'm/d/yy\\ h:mm;@', 'm/d/yyyy;@', '0.0E+00',
          '0.000%', 'General'],
        {
          name: 'SetCellNumberFormat',
          factory: SetCellNumberFormat
        });
  });
});


