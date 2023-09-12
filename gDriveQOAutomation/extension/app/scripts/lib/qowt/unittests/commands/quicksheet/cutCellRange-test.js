// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the CutCellRange command
 */

define([
  'qowtRoot/commands/quicksheet/cutCellRange',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/events/errors/sheetCutError',
  'qowtRoot/controls/grid/paneManager'],
function(
    CutCellRange,
    SheetModel,
    PubSub,
    SheetCutError,
    PaneManager) {

  'use strict';

  describe('CutCellRange command', function() {
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
               rowIdx: 13,
               colIdx: 84
             }
            };
            var cmd = CutCellRange.create(selection);
            expect(cmd).toBeDefined();
            expect(cmd.name).toBe('CutCellRange');
            expect(cmd.id()).toBeDefined();
            expect(cmd.isOptimistic()).toBe(true);
            expect(cmd.callsService()).toBe(true);
            expect(cmd.onFailure).toBeDefined();
            expect(cmd.onSuccess).toBeDefined();
            expect(cmd.doOptimistic).toBeDefined();
            expect(cmd.doRevert).toBeDefined();
            expect(cmd.dcpData().name).toBe('ccr');
            expect(cmd.dcpData().r1).toBe(selection.topLeft.rowIdx);
            expect(cmd.dcpData().c1).toBe(selection.topLeft.colIdx);
            expect(cmd.dcpData().r2).toBe(selection.bottomRight.rowIdx);
            expect(cmd.dcpData().c2).toBe(selection.bottomRight.colIdx);
            expect(cmd.dcpData().si).toBe(1);
            expect(cmd.dcpData().cut).toBe(true);
         });

      it('doOptimistic() method should highlight the selected range of cells',
         function() {
           var selection = {
             anchor: {
               rowIdx: 14,
               colIdx: 31
             },
             topLeft: {
               rowIdx: 14,
               colIdx: 31
             },
             bottomRight: {
               rowIdx: 78,
               colIdx: 98
             }
           };
           spyOn(PaneManager, 'highlightCells');
           var cmd = CutCellRange.create(selection);
           cmd.doOptimistic();
           var highlights = [];
           highlights.push({
             rowIdx: selection.topLeft.rowIdx,
             colIdx: selection.topLeft.colIdx
           });
           highlights[0].rangeEnd = {
             rowIdx: selection.bottomRight.rowIdx,
             colIdx: selection.bottomRight.colIdx
           };
           expect(PaneManager.highlightCells).toHaveBeenCalledWith(highlights);
         });

      it('doRevert() method should highlight the selected range of cells',
         function() {
           var selection = {
             anchor: {
               rowIdx: 14,
               colIdx: 31
             },
             topLeft: {
               rowIdx: 14,
               colIdx: 31
             },
             bottomRight: {
               rowIdx: 78,
               colIdx: 98
             }
           };
           spyOn(PaneManager, 'unhighlightCells');
           var cmd = CutCellRange.create(selection);
           cmd.doRevert();
           expect(PaneManager.unhighlightCells).toHaveBeenCalled();
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
           var cmd = CutCellRange.create(selection);
           var response = {e: 'blah'};
           var errorPolicy = {eventDispatched: undefined};
           var rsp = SheetCutError.create();
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
