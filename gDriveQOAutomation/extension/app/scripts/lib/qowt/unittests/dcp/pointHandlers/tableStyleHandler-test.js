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
  'qowtRoot/dcp/pointHandlers/tableStyleHandler',
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager'
], function(TableStyleHandler, TableStyleManager) {

  'use strict';

  describe('TableStyle handler Test', function() {
    var v;

    var _tableStyleHandler = TableStyleHandler;

    beforeEach(function() {
      v = {
            'el': {
              'etp': 'tbStyl'
            }
          };
      spyOn(TableStyleManager, 'cacheTableStyles');
    });

    describe(' verifying visit', function() {

      it('should not cache table styles when and Table style JSON is undefined',
          function() {
            v = undefined;
            _tableStyleHandler.visit(v);
            expect(TableStyleManager.cacheTableStyles).not.toHaveBeenCalled();
          });

      it('should not cache table styles when element in Table style JSON is ' +
          'undefined ', function() {
            v.el = undefined;
            _tableStyleHandler.visit(v);
            expect(TableStyleManager.cacheTableStyles).not.toHaveBeenCalled();
          });

      it('should not cache table styles when element-type in Table style ' +
          'JSON is undefined ', function() {
            v.el.etp = undefined;
            _tableStyleHandler.visit(v);
            expect(TableStyleManager.cacheTableStyles).not.toHaveBeenCalled();
          });

      it('should not cache table styles when element-type in Table style ' +
          'JSON is not tbStyl', function() {
            v.el.etp = 'xxx';
            _tableStyleHandler.visit(v);
            expect(TableStyleManager.cacheTableStyles).not.toHaveBeenCalled();
          });

      it("should cache table styles if element type is 'tbStyl' ", function() {
        _tableStyleHandler.visit(v);
        expect(TableStyleManager.cacheTableStyles).toHaveBeenCalled();
      });

    });
  });
});
