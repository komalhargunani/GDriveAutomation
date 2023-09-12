// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test suite for the Cell Formatting action handler.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/sheet',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/tools/toolManager'
], function(
    PubSub,
    SheetModel,
    Workbook,
    SheetSelectionManager
    /* ToolManager required for subscriptions */) {

  'use strict';

  describe('Cell Formatting action handler', function() {

    var _cellSelection = {
      anchor: {rowIdx: 18, colIdx: 3},
      topLeft: {rowIdx: 18, colIdx: 3},
      bottomRight: {rowIdx: 18, colIdx: 3},
      contentType: 'sheetCell'
    };
    var _textEditorSelection = {
      contentType: 'sheetText'
    };
    SheetModel.activeSheetIndex = 2;

    beforeEach(function() {
      Workbook.init();
      SheetSelectionManager.init();
    });

    afterEach(function() {
      Workbook.reset();
    });

    it('should publish a doAction signal for a cell when a requestAction ' +
        '"bold" is triggered', function() {
          PubSub.publish('qowt:sheet:requestFocus', _cellSelection);
          var actionData = {
            action: 'bold'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
        });

    it('should publish a doAction signal for a cell when a requestAction ' +
        '"italic" is triggered', function() {
          PubSub.publish('qowt:sheet:requestFocus', _cellSelection);
          var actionData = {
            action: 'italic'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
        });

    it('should publish a doAction signal for a cell when a requestAction ' +
        '"underline" is triggered', function() {
          PubSub.publish('qowt:sheet:requestFocus', _cellSelection);
          var actionData = {
            action: 'underline'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
        });

    it('should publish a doAction signal when a requestAction "numberFormat" ' +
        'is triggered', function() {
          PubSub.publish('qowt:sheet:requestFocus', _cellSelection);
          var actionData = {
            action: 'numberFormat'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
        });

    it('should not publish a doAction signal for a cell when the selection is' +
        ' not valid', function() {
          var cellSel = {};
          PubSub.publish('qowt:sheet:requestFocus', cellSel);
          var actionData = {
            action: 'bold'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          expect(PubSub.publish.mostRecentCall.args[0]).not.toBe(
              'qowt:doAction');
        });

    it('should publish a doAction signal for the floating editor when a ' +
        'formatting requestAction is triggered', function() {
          PubSub.publish('qowt:sheet:requestFocus', _textEditorSelection);
          var actionData = {
            action: 'bold'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');

          actionData = {
            action: 'backgroundColor'
          };
          PubSub.publish('qowt:requestAction', actionData);

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
        });

  });

});
