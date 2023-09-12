/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/widgets/grid/sheetHeader'
], function(SheetHeader) {

  'use strict';

  describe('A workbook sheet header', function() {
    beforeEach(function() {
      SheetHeader.init();
    });

    it('should be in an initialised state after construction', function() {
      expect(SheetHeader).toBeDefined();
    });

    it('should throw error if sheetHeader.init() called multiple times',
        function() {
          expect(SheetHeader.init).toThrow('sheetHeader.init() called' +
              ' multiple times.');
        });
  });

});

