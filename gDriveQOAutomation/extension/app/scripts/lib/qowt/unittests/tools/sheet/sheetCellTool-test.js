/*
 * Test suite for the Sheet Cell Tool
 */
define([
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/tools/toolManager',
  'qowtRoot/tools/sheet/sheetCellTool',
  'qowtRoot/utils/domListener',
  'qowtRoot/features/pack',
  'qowtRoot/models/sheet',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/controls/grid/workbook'
], function(
    PaneManager,
    PubSub,
    ToolsManager,
    SheetCellTool,
    DomListener,
    FeaturePack,
    SheetModel,
    SheetSelectionManager,
    Workbook) {

  'use strict';

  describe('The sheet cell tool', function() {

    var _kSheetCellToolName = 'sheetCell';
    var _kArrowLeftKeyCode = 37;
    var _kArrowUpKeyCode = 38;
    var _kArrowRightKeyCode = 39;
    var _kArrowDownKeyCode = 40;
    var _kEnterKeyCode = 13;
    var _kTabKeyCode = 9;
    var _kBackspaceKeyCode = 8;
    var _kDeleteKeyCode = 46;
    var _kCharacterGKeyCode = 71;
    var _kEscapeKeyCode = 27;
    var _kCharacterAKeyCode = 65;

    beforeEach(function() {
      Workbook.init();
      SheetSelectionManager.init();
      ToolsManager.setActiveTool();
    });

    it('should be able to be activated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(_kSheetCellToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetCellToolName);
    });

    it('should register for various signals and events when activated',
        function() {
          expect(ToolsManager.activeTool).toBeUndefined();

          spyOn(DomListener, 'addListener');
          spyOn(PubSub, 'subscribe').andCallThrough();

          FeaturePack.edit = false;
          ToolsManager.setActiveTool(_kSheetCellToolName);
          expect(DomListener.addListener).toHaveBeenCalled();
          expect(PubSub.subscribe).toHaveBeenCalled();

          ToolsManager.setActiveTool('');
          FeaturePack.edit = true;
          ToolsManager.setActiveTool(_kSheetCellToolName);
          expect(DomListener.addListener).toHaveBeenCalled();
          expect(PubSub.subscribe).toHaveBeenCalled();
        });

    it('should be able to be deactivated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(_kSheetCellToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetCellToolName);
      ToolsManager.setActiveTool();
      expect(ToolsManager.activeTool).not.toBe(_kSheetCellToolName);
    });

    it('should unregister for various signals and events when deactivated',
        function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          expect(ToolsManager.activeTool).toBe(_kSheetCellToolName);

          spyOn(DomListener, 'removeListener');
          spyOn(PubSub, 'unsubscribe').andCallThrough();

          FeaturePack.edit = false;
          ToolsManager.setActiveTool();
          expect(DomListener.removeListener).toHaveBeenCalled();
          expect(PubSub.unsubscribe).toHaveBeenCalled();

          ToolsManager.setActiveTool(_kSheetCellToolName);
          FeaturePack.edit = true;
          ToolsManager.setActiveTool();
          expect(DomListener.removeListener).toHaveBeenCalled();
          expect(PubSub.unsubscribe).toHaveBeenCalled();

        });

    it('should call Workbook.initiateCellEdit() when it ' +
        'receives a "qowt:widget:dblClick" signal from a pane',
        function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(Workbook, 'initiateCellEdit');

          PubSub.publish('qowt:widget:dblClick', {contentType: 'pane'});

          expect(Workbook.initiateCellEdit).toHaveBeenCalledWith(
            true, undefined);
        });

    it('should call Workbook.initiateCellEdit() if ' +
        'the user presses a character key and edit is enabled', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(Workbook, 'initiateCellEdit');
          FeaturePack.edit = true;

          // generate a character key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kCharacterGKeyCode;
          evt.keyIdentifier = 'blah';
          document.dispatchEvent(evt);

          expect(Workbook.initiateCellEdit).toHaveBeenCalledWith(
            true, evt.keyIdentifier);
        });

    it('should Workbook.initiateCellEdit()" ' +
        'when it receives a "qowt:formulaBar:focused" signal', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(Workbook, 'initiateCellEdit');

          PubSub.publish('qowt:formulaBar:focused');

          expect(Workbook.initiateCellEdit).toHaveBeenCalledWith(
            false, undefined);
        });

    it('should publish a "qowt:doAction" signal for "commitCellEdit" when ' +
        'it receives a "qowt:requestAction" signal for "commitCellEdit"',
        function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          var selectionObj = {
            anchor: {rowIdx: 4, colIdx: 4},
            topLeft: {rowIdx: 4, colIdx: 4},
            bottomRight: {rowIdx: 4, colIdx: 4},
            contentType: 'sheetCell'
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          PubSub.publish('qowt:requestAction', {
            action: 'commitCellEdit',
            context: {}
          });

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'commitCellEdit');
        });

    it('should publish a "qowt:doAction" signal for "cancelCellEdit" when ' +
        'it receives a "qowt:requestAction" signal for "cancelCellEdit"',
        function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          var selectionObj = {
            anchor: {rowIdx: 4, colIdx: 4},
            topLeft: {rowIdx: 4, colIdx: 4},
            bottomRight: {rowIdx: 4, colIdx: 4},
            contentType: 'sheetCell'
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          PubSub.publish('qowt:requestAction', {
            action: 'cancelCellEdit',
            context: {}
          });

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'cancelCellEdit');
        });

    it('should call a registered action handler when it receives ' +
        'a "qowt:requestAction" signal for cell formatting', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);

          var globalValue = 8;
          var actionHandler = function() {
            globalValue = 10;
          };
          SheetCellTool.registerActionHandler(['bold'], actionHandler);

          // publish a 'qowt:requestAction' signal for 'bold'
          PubSub.publish('qowt:requestAction', {action: 'bold', context: {}});

          // the tool should have called the registered action handler
          expect(globalValue).toBe(10);
        });

    it('should not call a registered action handler when it receives ' +
        'a "qowt:requestAction" signal for an unknown operation', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);

          var globalValue = 5;
          var actionHandler = function() {
            globalValue = 12;
          };
          SheetCellTool.registerActionHandler(['bold'], actionHandler);

          // publish a 'qowt:requestAction' signal for 'bold'
          PubSub.publish('qowt:requestAction', {action: 'random', context: {}});

          // the tool should have called the registered action handler
          expect(globalValue).toBe(5);
        });

    it('should publish a "qowt:doAction" for "moveRangeSelectionLeft" if ' +
        'the user presses shift-left', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = true;
          evt.keyCode = _kArrowLeftKeyCode;
          document.dispatchEvent(evt);

          // get the published a qowt:doAction signal
          var qowtDoActionSignal =
                PubSub.publish.argsForCall.filter(function(item){
                  return item[0] === "qowt:doAction";
                })[0];

          // the tool should have published a qowt:doAction signal
          expect(qowtDoActionSignal[0]).toBe('qowt:doAction');
          expect(qowtDoActionSignal[1].action).toBe(
              'moveRangeSelectionLeft');
          expect(qowtDoActionSignal[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveSelectionLeft" if the ' +
        'user presses left', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = false;
          evt.keyCode = _kArrowLeftKeyCode;
          document.dispatchEvent(evt);

          // get the published a qowt:doAction signal
          var qowtDoActionSignal =
                PubSub.publish.argsForCall.filter(function(item){
                  return item[0] === "qowt:doAction";
                })[0];

          // the tool should have published a qowt:doAction signal
          expect(qowtDoActionSignal[0]).toBe('qowt:doAction');
          expect(qowtDoActionSignal[1].action).toBe(
              'moveSelectionLeft');
          expect(qowtDoActionSignal[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveRangeSelectionUp" if the ' +
        'user presses shift-up', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = true;
          evt.keyCode = _kArrowUpKeyCode;
          document.dispatchEvent(evt);

          // get the published a qowt:doAction signal
          var qowtDoActionSignal =
                PubSub.publish.argsForCall.filter(function(item){
                  return item[0] === "qowt:doAction";
                })[0];


          // the tool should have published a qowt:doAction signal
          expect(qowtDoActionSignal[0]).toBe('qowt:doAction');
          expect(qowtDoActionSignal[1].action).toBe(
              'moveRangeSelectionUp');
          expect(qowtDoActionSignal[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveSelectionUp" if the user ' +
        'presses up', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = false;
          evt.keyCode = _kArrowUpKeyCode;
          document.dispatchEvent(evt);

          // get the published a qowt:doAction signal
          var qowtDoActionSignal =
                PubSub.publish.argsForCall.filter(function(item){
                  return item[0] === "qowt:doAction";
                })[0];

          // the tool should have published a qowt:doAction signal
          expect(qowtDoActionSignal[0]).toBe('qowt:doAction');
          expect(qowtDoActionSignal[1].action).toBe(
              'moveSelectionUp');
          expect(qowtDoActionSignal[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveRangeSelectionDown" if ' +
        'the user presses shift-down', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = true;
          evt.keyCode = _kArrowDownKeyCode;
          document.dispatchEvent(evt);

          // get the published a qowt:doAction signal
          var qowtDoActionSignal =
                PubSub.publish.argsForCall.filter(function(item){
                  return item[0] === "qowt:doAction";
                })[0];

          // the tool should have published a qowt:doAction signal
          expect(qowtDoActionSignal[0]).toBe('qowt:doAction');
          expect(qowtDoActionSignal[1].action).toBe(
              'moveRangeSelectionDown');
          expect(qowtDoActionSignal[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveSelectionDown" if the ' +
        'user presses down', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = false;
          evt.keyCode = _kArrowDownKeyCode;
          document.dispatchEvent(evt);

          // get the published a qowt:doAction signal
          var qowtDoActionSignal =
                PubSub.publish.argsForCall.filter(function(item){
                  return item[0] === "qowt:doAction";
                })[0];

          // the tool should have published a qowt:doAction signal
          expect(qowtDoActionSignal[0]).toBe('qowt:doAction');
          expect(qowtDoActionSignal[1].action).toBe(
              'moveSelectionDown');
          expect(qowtDoActionSignal[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveRangeSelectionRight" if ' +
        'the user presses shift-right', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = true;
          evt.keyCode = _kArrowRightKeyCode;
          document.dispatchEvent(evt);

          // get the published a qowt:doAction signal
          var qowtDoActionSignal =
                PubSub.publish.argsForCall.filter(function(item){
                  return item[0] === "qowt:doAction";
                })[0];

          // the tool should have published a qowt:doAction signal
          expect(qowtDoActionSignal[0]).toBe('qowt:doAction');
          expect(qowtDoActionSignal[1].action).toBe(
              'moveRangeSelectionRight');
          expect(qowtDoActionSignal[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveSelectionRight" if the ' +
        'user presses right', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = false;
          evt.keyCode = _kArrowRightKeyCode;
          document.dispatchEvent(evt);

          // get the published a qowt:doAction signal
          var qowtDoActionSignal =
                PubSub.publish.argsForCall.filter(function(item){
                  return item[0] === "qowt:doAction";
                })[0];

          // the tool should have published a qowt:doAction signal
          expect(qowtDoActionSignal[0]).toBe('qowt:doAction');
          expect(qowtDoActionSignal[1].action).toBe(
              'moveSelectionRight');
          expect(qowtDoActionSignal[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveSelectionDown" if the ' +
        'user presses Enter with no modifier keys', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'Enter' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kEnterKeyCode;
          document.dispatchEvent(evt);

          // the tool should have published a qowt:doAction signal
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'moveSelectionDown');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveSelectionUp" if the user ' +
        'presses Enter with the shift key', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-Enter' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = true;
          evt.keyCode = _kEnterKeyCode;
          document.dispatchEvent(evt);

          // the tool should have published a qowt:doAction signal
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'moveSelectionUp');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish no signals if the user presses Tab and edit is not ' +
        'enabled', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();
          FeaturePack.edit = false;

          // generate a 'Tab' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kTabKeyCode;
          document.dispatchEvent(evt);

          // the tool should NOT have published a qowt:doAction signal
          expect(PubSub.publish).not.toHaveBeenCalled();
        });

    it('should publish a "qowt:doAction" for "moveSelectionRight" if the ' +
        'user presses Tab with no modifier keys and edit is enabled',
        function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();
          FeaturePack.edit = true;

          // generate a 'Tab' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kTabKeyCode;
          document.dispatchEvent(evt);

          // the tool should have published a qowt:doAction signal
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'moveSelectionRight');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish a "qowt:doAction" for "moveSelectionLeft" if the ' +
        'user presses Tab with the shift key and edit is enabled', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();
          FeaturePack.edit = true;

          // generate a 'shift-Tab' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = true;
          evt.keyCode = _kTabKeyCode;
          document.dispatchEvent(evt);

          // the tool should have published a qowt:doAction signal
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'moveSelectionLeft');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish no signals if the user presses Delete or Backspace ' +
        'and edit is not enabled', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();
          FeaturePack.edit = false;

          // generate a 'Delete' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kDeleteKeyCode;
          document.dispatchEvent(evt);

          // the tool should NOT have published a qowt:doAction signal
          expect(PubSub.publish).not.toHaveBeenCalled();

          // generate a 'Backspace' key event
          evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kBackspaceKeyCode;
          document.dispatchEvent(evt);

          // the tool should NOT have published a qowt:doAction signal
          expect(PubSub.publish).not.toHaveBeenCalled();
        });

    it('should publish a "qowt:doAction" for "commitCellEdit" if the user ' +
        'presses Delete or Backspace and edit is enabled', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();
          FeaturePack.edit = true;

          // generate a 'Delete' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kDeleteKeyCode;
          document.dispatchEvent(evt);

          // the tool should have published a qowt:doAction signal
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'commitCellEdit');
          expect(PubSub.publish.mostRecentCall.args[1].context.cellText).
              toBe('');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');

          // generate a 'Backspace' key event
          evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kBackspaceKeyCode;
          document.dispatchEvent(evt);

          // the tool should have published a qowt:doAction signal
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'commitCellEdit');
          expect(PubSub.publish.mostRecentCall.args[1].context.cellText).
              toBe('');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');
        });

    it('should publish no signals if the user presses a character key and ' +
        'edit is not enabled', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();
          FeaturePack.edit = false;

          // generate a character key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kCharacterGKeyCode;
          document.dispatchEvent(evt);

          // the tool should NOT have published a qowt:doAction signal
          expect(PubSub.publish).not.toHaveBeenCalled();
        });
    it('should call a registered action handler when it receives a ' +
        '"qowt:requestAction" signal for "copy"', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);

          var selectionObj = {
            anchor: {rowIdx: 2, colIdx: 2},
            topLeft: {rowIdx: 2, colIdx: 2},
            bottomRight: {rowIdx: 2, colIdx: 2},
            contentType: 'sheetCell'
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var globalValue = 45;
          var actionHandler = function() {
            globalValue = 167;
          };
          SheetCellTool.registerActionHandler(['copy'], actionHandler);

          expect(globalValue).toBe(45);
          PubSub.publish('qowt:requestAction', {action: 'copy', context: {}});
          expect(globalValue).toBe(167);
        });
    it('should call a registered action handler when it receives a ' +
        '"qowt:requestAction" signal for "cut"', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);

          var selectionObj = {
            anchor: {rowIdx: 2, colIdx: 2},
            topLeft: {rowIdx: 2, colIdx: 2},
            bottomRight: {rowIdx: 2, colIdx: 2},
            contentType: 'sheetCell'
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var globalValue = 12;
          var actionHandler = function() {
            globalValue = 99;
          };
          SheetCellTool.registerActionHandler(['cut'], actionHandler);

          expect(globalValue).toBe(12);
          PubSub.publish('qowt:requestAction', {action: 'cut', context: {}});
          expect(globalValue).toBe(99);
        });
    it('should publish a "qowt:doAction" for "cancelCut" if the user ' +
        'presses Escape key', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          FeaturePack.edit = true;
          spyOn(PubSub, 'publish').andCallThrough();

          // generate a 'shift-left' key event
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.shiftKey = false;
          evt.keyCode = _kEscapeKeyCode;
          document.dispatchEvent(evt);

          // the tool should have published a qowt:doAction signal
          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'cancelCut');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');
        });
    it('should call a registered action handler when it receives a ' +
        '"qowt:requestAction" signal for "paste"', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);

          var selectionObj = {
            anchor: {rowIdx: 2, colIdx: 2},
            topLeft: {rowIdx: 2, colIdx: 2},
            bottomRight: {rowIdx: 2, colIdx: 2},
            contentType: 'sheetCell'
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var globalValue = 8;
          var actionHandler = function() {
            globalValue = 10;
          };
          SheetCellTool.registerActionHandler(['paste'], actionHandler);

          expect(globalValue).toBe(8);
          PubSub.publish('qowt:requestAction', {action: 'paste', context: {}});
          expect(globalValue).toBe(10);
        });
    it('should publish a "qowt:doAction" signal for "insertRow" when it ' +
        'receives a "qowt:requestAction" signal for "insertRow"', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          var selectionObj = {
            anchor: {rowIdx: 2, colIdx: 2},
            topLeft: {rowIdx: 2, colIdx: 2},
            bottomRight: {rowIdx: 2, colIdx: 2},
            contentType: 'sheetCell'
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          PubSub.publish('qowt:requestAction', {
            action: 'insertRow', context: {}
          });

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'insertRow');
        });
    it('should publish a "qowt:doAction" signal for "deleteRow" when it ' +
        'receives a "qowt:requestAction" signal for "deleteRow"', function() {
          ToolsManager.setActiveTool(_kSheetCellToolName);
          spyOn(PubSub, 'publish').andCallThrough();

          var selectionObj = {
            anchor: {rowIdx: 2, colIdx: 2},
            topLeft: {rowIdx: 2, colIdx: 2},
            bottomRight: {rowIdx: 2, colIdx: 2},
            contentType: 'sheetCell'
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          PubSub.publish('qowt:requestAction', {
            action: 'deleteRow', context: {}
          });

          expect(PubSub.publish.mostRecentCall.args[0]).toBe('qowt:doAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'deleteRow');
        });
    it('should publish signals if the user presses cmd + a ', function() {
      selectAllUsingCmdOrCtrl({metaKey: true});
    });

    it('should publish signals if the user presses ctrl + a ', function() {
      selectAllUsingCmdOrCtrl({ctrlKey: true});
    });


    function selectAllUsingCmdOrCtrl(keys) {
      ToolsManager.setActiveTool(_kSheetCellToolName);
      spyOn(PaneManager, 'selectAllCells').andCallThrough();

      // generate a 'ctrl/cmd + a' key event
      var evt = document.createEvent('Event');
      evt.initEvent('keydown', true, false);
      evt.keyCode = _kCharacterAKeyCode;

      evt.ctrlKey = keys.ctrlKey;
      evt.metaKey = keys.metaKey;

      document.dispatchEvent(evt);

      expect(PaneManager.selectAllCells).toHaveBeenCalled();
    }

  });
});
