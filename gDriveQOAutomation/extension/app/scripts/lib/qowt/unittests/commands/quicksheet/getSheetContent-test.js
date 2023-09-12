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
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/commands/quicksheet/getSheetContent',
  'qowtRoot/models/sheet',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/events/errors/contentRenderError',
  'qowtRoot/variants/configs/sheet'
], function(
    PubSub,
    GetSheetContentCmd,
    SheetModel,
    Workbook,
    ContentRenderError,
    SheetConfig) {

  'use strict';

  describe('GetSheetContent command', function() {

    describe('creation', function() {

      beforeEach(function() {

        SheetConfig = {
          kGRID_DEFAULT_ROWS: 2000,
          kGRID_DEFAULT_COLS: 150,
          kGRID_DEFAULT_ROW_HEIGHT: 45,
          kGRID_DEFAULT_COL_WIDTH: 180,
          kGRID_GRIDLINE_WIDTH: 1
        };

        Workbook.init();
      });

      afterEach(function() {
        SheetConfig = undefined;
        Workbook.reset();
      });

      it('should default to index 0 if no sheetIndex was given as argument ' +
          'and no SheetModel.activeSheetIndex', function() {
            SheetModel.activeSheetIndex = undefined;
            var cmd = GetSheetContentCmd.create();

            expect(cmd.name).toBe('GetSheetContent');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).toBeTruthy();
            expect(cmd.dcpData().name).toBe('gsc');
            expect(cmd.dcpData().si).toBe(0);
          });

      it('should default to SheetModel.activeSheetIndex if it exists and no ' +
          'sheetIndex was given as argument', function() {
            var _modelBackup = SheetModel.activeSheetIndex;
            var _mockActiveSheetIndex = 4;
            SheetModel.activeSheetIndex = _mockActiveSheetIndex;

            var cmd = GetSheetContentCmd.create();

            expect(cmd.name).toBe('GetSheetContent');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).toBeTruthy();
            expect(cmd.dcpData().name).toBe('gsc');
            expect(cmd.dcpData().si).toBe(_mockActiveSheetIndex);

            // reset model
            SheetModel.activeSheetIndex = _modelBackup;
          });

      it('should set sheet index if given as integer argument to creator',
          function() {
            var _requestedSheetIndex = 12;
            var cmd = GetSheetContentCmd.create(_requestedSheetIndex);

            expect(cmd.name).toBe('GetSheetContent');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).toBeTruthy();
            expect(cmd.dcpData().name).toBe('gsc');
            expect(cmd.dcpData().si).toBe(_requestedSheetIndex);
          });

      it('should use given sheet index over and above model active sheet ' +
          'index if set', function() {
            var _requestedSheetIndex = 9;
            var _modelBackup = SheetModel.activeSheetIndex;
            var _mockActiveSheetIndex = 7;
            SheetModel.activeSheetIndex = _mockActiveSheetIndex;

            var cmd = GetSheetContentCmd.create(_requestedSheetIndex);

            expect(cmd.name).toBe('GetSheetContent');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).toBeTruthy();
            expect(cmd.dcpData().name).toBe('gsc');
            expect(cmd.dcpData().si).toBe(_requestedSheetIndex);

            // reset model
            SheetModel.activeSheetIndex = _modelBackup;
          });

      it('should default to 0 if no fromRow was given as argument', function() {
        var cmd = GetSheetContentCmd.create();

        expect(cmd.name).toBe('GetSheetContent');
        expect(cmd.id()).toBeDefined();
        expect(cmd.isOptimistic()).toBeFalsy();
        expect(cmd.callsService()).toBeTruthy();
        expect(cmd.dcpData().name).toBe('gsc');
        expect(cmd.dcpData().r1).toBe(0);
      });

      it('should set "from" row if given as integer argument to creator',
         function() {
           var _requestedSheetIndex = 0;
           var _requestedFromRow = 8;
           var cmd = GetSheetContentCmd.create(_requestedSheetIndex,
               _requestedFromRow);

           expect(cmd.name).toBe('GetSheetContent');
           expect(cmd.id()).toBeDefined();
           expect(cmd.isOptimistic()).toBeFalsy();
           expect(cmd.callsService()).not.toBeFalsy();
           expect(cmd.dcpData().name).toBe('gsc');
           expect(cmd.dcpData().r1).toBe(_requestedFromRow);
         });

      it('should default to min(last non-empty row, ' +
          'SheetConfig.kGRID_INITIAL_ROW_CHUNK_SIZE) if no toRow was given ' +
          'as argument', function() {
            var _configBackupChunkSize = SheetConfig.
                kGRID_INITIAL_ROW_CHUNK_SIZE;
            var _configBackupMaxRow = SheetConfig.kGRID_INITIAL_ROW_CHUNK_SIZE;
            var _mockChunkSize = 30;
            SheetConfig.kGRID_INITIAL_ROW_CHUNK_SIZE = _mockChunkSize;
            SheetConfig.kGRID_DEFAULT_MAX_ROWS = 5000;
            SheetModel.numberOfNonEmptyRows = 57;

            var _requestedSheetIndex = 0;
            var _requestedFromRow = 8;
            var cmd = GetSheetContentCmd.create(_requestedSheetIndex,
                _requestedFromRow);

            expect(cmd.name).toBe('GetSheetContent');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).not.toBeFalsy();
            expect(cmd.dcpData().name).toBe('gsc');
            expect(cmd.dcpData().r2).toBe(_mockChunkSize);

            // reset config
            SheetConfig.kGRID_INITIAL_ROW_CHUNK_SIZE = _configBackupChunkSize;
            SheetConfig.kGRID_DEFAULT_MAX_ROWS = _configBackupMaxRow;
          });

      it('should set "to" row if given as integer argument to creator',
          function() {
            var _requestedSheetIndex = 0;
            var _requestedFromRow = 8;
            var _requestedToRow = 63;
            var cmd = GetSheetContentCmd.create(_requestedSheetIndex,
                _requestedFromRow, _requestedToRow);

            expect(cmd.name).toBe('GetSheetContent');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBeFalsy();
            expect(cmd.callsService()).not.toBeFalsy();
            expect(cmd.dcpData().name).toBe('gsc');
            expect(cmd.dcpData().r2).toBe(_requestedToRow);
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
            var cmd = GetSheetContentCmd.create();

            var res = {
              e: 'UNIT TEST - tesing failure responses'
            };

            subscriptions.push(PubSub.subscribe('qowt:error', eventHandler));

            var errorPolicy = {};
            cmd.onFailure(res, errorPolicy);

            expect(errorPolicy.eventDispatched).toBe(true);

            // we should have sent a 'qowt:error' signal
            expect(observedEvent).toBe('qowt:error');
            expect(observedEventDetail).toBeDefined();
            if (observedEventDetail) {
              expect(observedEventDetail.errorId).
                  toBe(ContentRenderError.create().errorId);
              expect(observedEventDetail.fatal).toBe(false);
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
            var cmd = GetSheetContentCmd.create();

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
