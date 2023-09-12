// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the CopyCellRange command
 */

define([
  'qowtRoot/commands/quicksheet/copyCellRange',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/events/errors/sheetCopyError'],
function(
    CopyCellRange,
    SheetModel,
    PubSub,
    SheetCopyError) {

  'use strict';

  describe('CopyCellRange command', function() {
    beforeEach(function() {
      SheetModel.activeSheetIndex = 1;
    });

    afterEach(function() {
      SheetModel.activeSheetIndex = undefined;
    });

    describe('creation', function() {

      it('constructor should create a command if a valid parameters ' +
          'are specified', function() {
            var selection = {
             anchor: {
                    rowIdx: 1,
                    colIdx: 1
             },
             topLeft: {
                    rowIdx: 1,
                    colIdx: 1
             },
             bottomRight: {
                    rowIdx: 4,
                    colIdx: 18
             }
            };
            var cmd = CopyCellRange.create(selection);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('CopyCellRange');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(false);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.onSuccess).toBeDefined();
            expect(cmd.dcpData().name).toBe('ccr');
            expect(cmd.dcpData().r1).toBe(selection.topLeft.rowIdx);
            expect(cmd.dcpData().c1).toBe(selection.topLeft.colIdx);
            expect(cmd.dcpData().r2).toBe(selection.bottomRight.rowIdx);
            expect(cmd.dcpData().c2).toBe(selection.bottomRight.colIdx);
            expect(cmd.dcpData().si).toBe(1);
            expect(cmd.dcpData().cut).not.toBeDefined();
         });

      it('onFailure() method should publish an appropriate qowt:error signal',
          function() {
            var selection = {
             anchor: {
               rowIdx: 1,
               colIdx: 1
             },
             topLeft: {
               rowIdx: 1,
               colIdx: 1
             },
             bottomRight: {
               rowIdx: 4,
               colIdx: 18
             }
            };
            spyOn(PubSub, 'publish');
            var cmd = CopyCellRange.create(selection);
            var response = {e: 'blah'};
            var errorPolicy = {eventDispatched: undefined};
            var rsp = SheetCopyError.create();
            rsp.fatal = false;
            cmd.onFailure(response, errorPolicy);
            expect(PubSub.publish).toHaveBeenCalled();
            expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:error');
            expect(PubSub.publish.mostRecentCall.args[1].errorId).
                toEqual(rsp.errorId);
            expect(PubSub.publish.mostRecentCall.args[1].fatal).
                toEqual(rsp.fatal);
            expect(errorPolicy.eventDispatched).toBe(true);
         });
    });
  });
});

