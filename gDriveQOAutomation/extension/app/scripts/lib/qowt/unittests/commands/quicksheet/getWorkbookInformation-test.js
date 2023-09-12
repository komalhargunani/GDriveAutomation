/// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview test for 'gwi'- GetWorkbookInformation command.
 *
 * @author anchals@google.com (Anchal Sharma)
 */

define([
  'qowtRoot/commands/quicksheet/getWorkbookInformation',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/sheet'
], function(
    GetWorkbookInformation,
    PubSub,
    SheetModel) {

  'use strict';
  describe('GetWorkbookInformation command', function() {

    describe('creation', function() {
      it('creator without arguments should create valid cmd for workbook',
         function() {
           var _modelBackup = SheetModel.activeSheetIndex;
           SheetModel.activeSheetIndex = undefined;
           var cmd = GetWorkbookInformation.create();

           expect(cmd.name).toBe('GetWorkbookInformation');
           expect(cmd.id()).toBeDefined();
           expect(cmd.isOptimistic()).toBeFalsy();
           expect(cmd.callsService()).not.toBeFalsy();
           expect(cmd.dcpData().name).toBe('gwi');
           SheetModel.activeSheetIndex = _modelBackup;
         });

    });

    describe('command responses handling', function() {

      var subscriptions;

      beforeEach(function() {
        subscriptions = [];
      });

      afterEach(function() {
        if (subscriptions && subscriptions.length > 0) {
          for (var ix = 0; ix < subscriptions.length; ix++) {
            PubSub.unsubscribe(subscriptions[ix]);
          }
        }
      });

      it('should log an error to the error console and ignore error is true ' +
          'in case of a failure', function() {
            var cmd = GetWorkbookInformation.create();

            var res = {
              e: 'UNIT TEST - tesing failure responses'
            };
            spyOn(console, 'error').andCallThrough();

            var errorPolicy = {};
            cmd.onFailure(res, errorPolicy);
            expect(errorPolicy.ignoreError).toBe(true);
            expect(console.error).wasCalled();
          });
    });
  });
});
