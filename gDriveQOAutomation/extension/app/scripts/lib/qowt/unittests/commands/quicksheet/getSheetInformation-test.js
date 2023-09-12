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
  'qowtRoot/commands/quicksheet/getSheetInformation',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/sheet',
  'qowtRoot/events/errors/sheetLoadError'
], function(
    GetSheetInformation,
    PubSub,
    SheetModel,
    SheetLoadError) {

  'use strict';

  describe('GetSheetInformation command', function() {

    describe('creation', function() {
      it('creator without arguments should create valid cmd for sheet index 0',
          function() {
            var _modelBackup = SheetModel.activeSheetIndex;
            SheetModel.activeSheetIndex = undefined;
            var cmd = GetSheetInformation.create();

            expect(cmd.name).toBe('GetSheetInformation');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).not.toBeFalsy();
            expect(cmd.dcpData().name).toBe('gsi');
            expect(cmd.dcpData().si).toBe(0);

            SheetModel.activeSheetIndex = _modelBackup;
          });

      it('should default to SheetModel.activeSheetIndex if no sheetIndex was ' +
          'given as argument', function() {
            var _modelBackup = SheetModel.activeSheetIndex;
            var _mockActiveSheetIndex = 7;
            SheetModel.activeSheetIndex = _mockActiveSheetIndex;

            var cmd = GetSheetInformation.create();

            expect(cmd.name).toBe('GetSheetInformation');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).not.toBeFalsy();
            expect(cmd.dcpData().name).toBe('gsi');
            expect(cmd.dcpData().si).toBe(_mockActiveSheetIndex);

            // reset model
            SheetModel.activeSheetIndex = _modelBackup;
          });

      it('should set sheet index if given as integer argument to creator',
          function() {
            var _requestedSheetIndex = 9;
            var cmd = GetSheetInformation.create(_requestedSheetIndex);
            expect(cmd.name).toBe('GetSheetInformation');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).not.toBeFalsy();
            expect(cmd.dcpData().name).toBe('gsi');
            expect(cmd.dcpData().si).toBe(_requestedSheetIndex);
          });

      it('should use given sheet index over and above model active sheet ' +
          'index if set', function() {
            var _requestedSheetIndex = 9;
            var _modelBackup = SheetModel.activeSheetIndex;
            var _mockActiveSheetIndex = 7;
            SheetModel.activeSheetIndex = _mockActiveSheetIndex;

            var cmd = GetSheetInformation.create(_requestedSheetIndex);

            expect(cmd.name).toBe('GetSheetInformation');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).not.toBeFalsy();
            expect(cmd.dcpData().name).toBe('gsi');
            expect(cmd.dcpData().si).toBe(_requestedSheetIndex);

            // reset model
            SheetModel.activeSheetIndex = _modelBackup;
          });

      // insert next tests here
      it('should throw if argument is not an integer', function() {
        expect(function() {
          GetSheetInformation.create('sheetName');
        }).toThrow();
      });

    });


    describe('command responses handling', function() {

      var observedEvent;
      var observedEventDetail;
      var eventHandler;
      var subscriptions;

      beforeEach(function() {
        subscriptions = [];
        eventHandler = function(event, detail) {
          observedEvent = event;
          observedEventDetail = detail;
        };
      });

      afterEach(function() {
        if (subscriptions && subscriptions.length > 0) {
          for (var ix = 0; ix < subscriptions.length; ix++) {
            PubSub.unsubscribe(subscriptions[ix]);
          }
        }
        observedEvent = undefined;
        observedEventDetail = undefined;
      });

      it('should dispatch qowt:error notification in case of a failure',
         function() {
           var cmd = GetSheetInformation.create();

           var res = {
             e: 'UNIT TEST - tesing failure responses'
           };

           var dummyDiv = document.createElement('div');
           document.body.appendChild(dummyDiv);


           subscriptions.push(PubSub.subscribe('qowt:error', eventHandler));

           var errorPolicy = {};
           cmd.onFailure(res, errorPolicy);

           expect(errorPolicy.eventDispatched).toBe(true);

           // we should have sent a 'qowt:error' signal
           expect(observedEvent).toBe('qowt:error');
           expect(observedEventDetail).toBeDefined();
           if (observedEventDetail) {
             expect(observedEventDetail.errorId).
                 toBe(SheetLoadError.create().errorId);
           }

           // make sure we do not leave any listeners kicking around
           if (subscriptions && subscriptions.length > 0) {
             for (var ix = 0; ix < subscriptions.length; ix++) {
               PubSub.unsubscribe(subscriptions[ix]);
             }
           }
           observedEvent = undefined;
           observedEventDetail = undefined;

           errorPolicy = {};
           cmd.onFailure(res, errorPolicy);

           expect(errorPolicy.eventDispatched).toBe(true);

           expect(observedEvent).not.toBeDefined();
           expect(observedEventDetail).not.toBeDefined();
         });

      it('should log an error to the error console in case of a failure',
          function() {
            var cmd = GetSheetInformation.create();

            var res = {
              e: 'UNIT TEST - tesing failure responses'
            };
            spyOn(console, 'error').andCallThrough();

            cmd.onFailure(res);
            expect(console.error).wasCalled();
          });
    });
  });
});
