// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit tests for the error utils module
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/utils/errorUtils'
], function(
    ErrorUtils) {

  'use strict';

  describe('Error utils', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('should strip the stack to something sensible', function() {

var trace = "QOWTException: boom\n" +
  "\tat _api.visit (/scripts/lib/qowt/dcp/imageHandler.js:59:7)\n" +
  "\tat _handleDCPElement (/scripts/lib/qowt/dcp/dcpManager.js:294:33)\n" +
  "\tat _doProcessDCPResponse (/scripts/lib/qowt/dcp/dcpManager.js:189:13)\n" +
  "\tat <anonymous> (/scripts/lib/qowt/dcp/dcpManager.js:137:32)\n";

      var expected = "QOWTException: boom;" +
        "_api.visit:imageHandler.js:59:7;" +
        "_handleDCPElement:dcpManager.js:294:33;" +
        "_doProcessDCPResponse:dcpManager.js:189:13;" +
        "<anonymous>:dcpManager.js:137:32;";

      expect(ErrorUtils.stripStack({stack: trace})).toEqual(expected);
    });

    it('should correctly extract the error info from a DCP response',
       function() {
         var response = {
           e: 'foo',
           e_info: {
             category: 'bar'
           }
         };
         var errorInfo = ErrorUtils.errorInfo(response);
         expect(errorInfo).toEqual('foo; Category: bar');
       });

    it('should correctly extract the error code from an error info string',
       function() {
         var errorInfo = 'foo; Category: bar; Baz: boo';
         var errorCode = ErrorUtils.errorCode(errorInfo);
         expect(errorCode).toEqual('foo');
       });

    it('should correctly extract the category from an error info string',
       function() {
         var errorInfo = 'foo; Category: bar; Baz: boo';
         var category = ErrorUtils.category(errorInfo);
         expect(category).toEqual('bar');
       });
  });

  return {};
});
