// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test suite for the Cut/Copy/Paste action handler
 * of Quicksheet.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/toolManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/tools/sheet/actionHandlers/cutCopyPaste'
], function(
    ToolManager,
    PubSub,
    Workbook,
    SheetSelectionManager) {

  'use strict';

  describe('Cut/copy/paste action handler', function() {

    var cellSelection = {
      anchor: {rowIdx: 18, colIdx: 3},
      topLeft: {rowIdx: 18, colIdx: 3},
      bottomRight: {rowIdx: 18, colIdx: 3},
      contentType: 'sheetCell'
    };
    var textEditorSelection = {
      contentType: 'sheetText'
    };

    beforeEach(function() {
      Workbook.init();
      SheetSelectionManager.init();
    });

    afterEach(function() {
      Workbook.reset();
    });

    it('should publish a "qowt:doAction" signal to "cut" a cell when a ' +
        '"qowt:requestAction" signal for "cut" is published and the ' +
        'Sheet Cell Tool is active', function() {

          // activate the Sheet Cell Tool
          PubSub.publish('qowt:sheet:requestFocus', cellSelection);
          expect(ToolManager.activeTool).toBe('sheetCell');

          var actionData = {
            action: 'cut'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          var eventData = {
            'action': 'cut',
            'context': {
              contentType: 'sheetCell'
            }
          };
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1]).toEqual(eventData);
        });

    it('should publish a "qowt:doAction" signal to "copy" a cell when a ' +
        '"qowt:requestAction" signal for "copy" is published and the ' +
        'Sheet Cell Tool is active', function() {

          // activate the Sheet Cell Tool
          PubSub.publish('qowt:sheet:requestFocus', cellSelection);
          expect(ToolManager.activeTool).toBe('sheetCell');

          var actionData = {
            action: 'copy'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          var eventData = {
            'action': 'copy',
            'context': {
              contentType: 'sheetCell'
            }
          };
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1]).toEqual(eventData);
        });

    it('should publish a "qowt:doAction" signal to "paste" a cell when a ' +
        '"qowt:requestAction" signal for "paste" is published and the ' +
        'Sheet Cell Tool is active', function() {

          // activate the Sheet Cell Tool
          PubSub.publish('qowt:sheet:requestFocus', cellSelection);
          expect(ToolManager.activeTool).toBe('sheetCell');

          var actionData = {
            action: 'paste'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          var eventData = {
            'action': 'paste',
            'context': {
              contentType: 'sheetCell'
            }
          };
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1]).toEqual(eventData);
        });

    it('should publish a "qowt:doAction" signal to "cut" text from the ' +
        ' floating editor when a "qowt:requestAction" signal for "cut" is ' +
        'published and the Sheet Text Tool is active', function() {

          // activate the Sheet Text Tool
          PubSub.publish('qowt:sheet:requestFocus', textEditorSelection);
          expect(ToolManager.activeTool).toBe('sheetText');

          var actionData = {
            action: 'cut'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          var eventData = {
            'action': 'cut',
            'context': {
              contentType: 'sheetText'
            }
          };
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1]).toEqual(eventData);
        });

    it('should publish a "qowt:doAction" signal to "copy" text from the ' +
        ' floating editor when a "qowt:requestAction" signal for "copy" is ' +
        'published and the Sheet Text Tool is active', function() {

          // activate the Sheet Text Tool
          PubSub.publish('qowt:sheet:requestFocus', textEditorSelection);
          expect(ToolManager.activeTool).toBe('sheetText');

          var actionData = {
            action: 'copy'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          var eventData = {
            'action': 'copy',
            'context': {
              contentType: 'sheetText'
            }
          };
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1]).toEqual(eventData);
        });

    it('should publish a "qowt:doAction" signal to "paste" text into the ' +
        ' floating editor when a "qowt:requestAction" signal for "paste" is ' +
        'published and the Sheet Text Tool is active', function() {

          // activate the Sheet Text Tool
          PubSub.publish('qowt:sheet:requestFocus', textEditorSelection);
          expect(ToolManager.activeTool).toBe('sheetText');

          var actionData = {
            action: 'paste'
          };
          spyOn(PubSub, 'publish').andCallThrough();
          PubSub.publish('qowt:requestAction', actionData);

          var eventData = {
            'action': 'paste',
            'context': {
              contentType: 'sheetText'
            }
          };
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1]).toEqual(eventData);
        });

  });

});
