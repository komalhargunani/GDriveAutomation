// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the sheet text tool.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/toolManager',
  'qowtRoot/tools/sheet/sheetTextTool',
  'qowtRoot/utils/domListener',
  'qowtRoot/models/sheet',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/controls/grid/paneManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/formulaBar',
  'qowtRoot/tools/sheet/textHelpers/normalTextHelper',
  'qowtRoot/tools/sheet/textHelpers/formulaTextHelper'
], function(
    ToolsManager,
    SheetTextTool,
    DomListener,
    SheetModel,
    SheetSelectionManager,
    Workbook,
    PaneManager,
    PubSub,
    FormulaBar,
    NormalTextHelper,
    FormulaTextHelper) {

  'use strict';

  var rootNode;

  describe('The sheet text tool', function() {

    var _kSheetTextToolName = 'sheetText',
        _kEnterKeyCode = 13,
        _kTabKeyCode = 9,
        _kEscapeKeyCode = 27,
        _kArrowLeftKeyCode = 37,
        _kArrowUpKeyCode = 38,
        _kArrowRightKeyCode = 39,
        _kArrowDownKeyCode = 40;

    beforeEach(function() {
      Workbook.init();
      SheetSelectionManager.init();
      ToolsManager.setActiveTool();

      rootNode = document.createElement('div');
      Workbook.appendTo(rootNode);
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      document.body.removeChild(rootNode);
      rootNode = undefined;

      Workbook.reset();
    });

    it('should have the name "sheetText"', function() {
      expect(SheetTextTool.name).toBe('sheetText');
    });

    it('should be able to be activated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(_kSheetTextToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetTextToolName);
    });

    it('should register for various events and set itself to active when' +
        ' activated', function() {
          expect(ToolsManager.activeTool).toBeUndefined();
          expect(SheetTextTool.isActive()).toBe(false);

          spyOn(PubSub, 'subscribe').andCallThrough();
          spyOn(DomListener, 'add');

          ToolsManager.setActiveTool(_kSheetTextToolName);

          expect(PubSub.subscribe).toHaveBeenCalled();
          expect(DomListener.add).toHaveBeenCalled();
          expect(SheetTextTool.isActive()).toBe(true);
        });

    it('should use the "normal" text helper when activated for a cell that' +
        ' has normal text in it', function() {
          expect(ToolsManager.activeTool).toBeUndefined();

          spyOn(NormalTextHelper, 'init');
          spyOn(FormulaTextHelper, 'init');

          FormulaBar.setDisplayText('hello world');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);
          expect(NormalTextHelper.init).toHaveBeenCalled();
          expect(FormulaTextHelper.init).not.toHaveBeenCalled();
        });

    it('should use the "formula" text helper when activated for a cell that' +
        ' has formula text in it', function() {
          expect(ToolsManager.activeTool).toBeUndefined();

          spyOn(NormalTextHelper, 'init');
          spyOn(FormulaTextHelper, 'init');

          FormulaBar.setDisplayText('=R52');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          expect(FormulaTextHelper.init).toHaveBeenCalled();
          expect(NormalTextHelper.init).not.toHaveBeenCalled();
        });

    it('should be able to be deactivated via the Tools Manager', function() {
      expect(ToolsManager.activeTool).toBeUndefined();
      ToolsManager.setActiveTool(_kSheetTextToolName);
      expect(ToolsManager.activeTool).toBe(_kSheetTextToolName);
      ToolsManager.setActiveTool();
      expect(ToolsManager.activeTool).not.toBe(_kSheetTextToolName);
    });

    it('should unregister for various events and set itself to inactive ' +
        'when deactivated', function() {
          ToolsManager.setActiveTool(_kSheetTextToolName);
          expect(ToolsManager.activeTool).toBe(_kSheetTextToolName);
          expect(SheetTextTool.isActive()).toBe(true);

          spyOn(PubSub, 'unsubscribe').andCallThrough();
          spyOn(DomListener, 'removeGroup');

          ToolsManager.setActiveTool();
          expect(PubSub.unsubscribe).toHaveBeenCalled();
          expect(DomListener.removeGroup).toHaveBeenCalled();
          expect(SheetTextTool.isActive()).toBe(false);
        });

    it('should reset the "normal" text helper when deactivated on a cell ' +
        'that has normal text in it', function() {
          expect(ToolsManager.activeTool).toBeUndefined();

          spyOn(NormalTextHelper, 'reset');
          spyOn(FormulaTextHelper, 'reset');

          FormulaBar.setDisplayText('bla bla black sheep');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          ToolsManager.setActiveTool();
          expect(NormalTextHelper.reset).toHaveBeenCalled();
          expect(FormulaTextHelper.reset).not.toHaveBeenCalled();
        });

    it('should reset the "formula" text helper when deactivated on a cell ' +
        'that has formula text in it', function() {
          expect(ToolsManager.activeTool).toBeUndefined();

          spyOn(NormalTextHelper, 'reset');
          spyOn(FormulaTextHelper, 'reset');

          FormulaBar.setDisplayText('=R52');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          ToolsManager.setActiveTool();
          expect(FormulaTextHelper.reset).toHaveBeenCalled();
          expect(NormalTextHelper.reset).not.toHaveBeenCalled();
        });

    it('should call a registered action handler when it receives a ' +
        '"qowt:requestAction" signal for formatting', function() {
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var globalValue = 5;
          var actionHandler = function() {
            globalValue = 14;
          };
          SheetTextTool.registerActionHandler(['bold'], actionHandler);

          // publish a 'qowt:requestAction' signal for 'bold'
          PubSub.publish('qowt:requestAction', {action: 'bold', context: {}});

          // the tool should have called the registered action handler
          expect(globalValue).toBe(14);
        });

    it('should call a registered action handler when it receives a ' +
        '"qowt:requestAction" signal for "copy"', function() {
          ToolsManager.setActiveTool();

          FormulaBar.setDisplayText('=J14');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var globalValue = 4;
          var actionHandler = function() {
            globalValue = 8789;
          };
          SheetTextTool.registerActionHandler(['copy'], actionHandler);

          expect(globalValue).toBe(4);
          PubSub.publish('qowt:requestAction', {action: 'copy', context: {}});
          expect(globalValue).toBe(8789);
        });

    it('should call a registered action handler when it receives a ' +
        '"qowt:requestAction" signal for "cut"', function() {
          ToolsManager.setActiveTool();

          FormulaBar.setDisplayText('=J14');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var globalValue = 111;
          var actionHandler = function() {
            globalValue = 96;
          };
          SheetTextTool.registerActionHandler(['cut'], actionHandler);

          expect(globalValue).toBe(111);
          PubSub.publish('qowt:requestAction', {action: 'cut', context: {}});
          expect(globalValue).toBe(96);
        });

    it('should call a registered action handler when it receives a ' +
        '"qowt:requestAction" signal for "paste"', function() {
          ToolsManager.setActiveTool();

          FormulaBar.setDisplayText('=J14');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var globalValue = 23;
          var actionHandler = function() {
            globalValue = 57;
          };
          SheetTextTool.registerActionHandler(['paste'], actionHandler);

          expect(globalValue).toBe(23);
          PubSub.publish('qowt:requestAction', {action: 'paste', context: {}});
          expect(globalValue).toBe(57);
        });

    it('should call a registered action handler when it receives a ' +
        '"qowt:requestAction" signal for "injectAutocomplete"', function() {
          ToolsManager.setActiveTool();

          FormulaBar.setDisplayText('=J14');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          var globalValue = 42;
          var actionHandler = function() {
            globalValue = 8;
          };
          SheetTextTool.registerActionHandler(['injectAutocomplete'],
              actionHandler);

          expect(globalValue).toBe(42);
          PubSub.publish('qowt:requestAction', {
            action: 'injectAutocomplete',
            context: {}
          });
          expect(globalValue).toBe(8);
        });

    it('should call onArrowKeyDown() on its text helper when it receives ' +
        'an arrow "keydown" event', function() {
          FormulaBar.setDisplayText('=F82');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          spyOn(NormalTextHelper, 'onArrowKeyDown');
          spyOn(FormulaTextHelper, 'onArrowKeyDown');

          _dispatchKeyEvent('keydown', _kArrowRightKeyCode);
          expect(FormulaTextHelper.onArrowKeyDown).toHaveBeenCalled();
          NormalTextHelper.onArrowKeyDown.reset();
          FormulaTextHelper.onArrowKeyDown.reset();

          // mimic changing the text to be normal text
          FormulaBar.setDisplayText('some text');
          _dispatchKeyEvent('keyup');

          _dispatchKeyEvent('keydown', _kArrowDownKeyCode);
          expect(NormalTextHelper.onArrowKeyDown).toHaveBeenCalled();
          NormalTextHelper.onArrowKeyDown.reset();
          FormulaTextHelper.onArrowKeyDown.reset();

          // mimic changing the text to be formula text
          FormulaBar.setDisplayText('=C1');
          _dispatchKeyEvent('keyup');

          _dispatchKeyEvent('keydown', _kArrowUpKeyCode);
          expect(FormulaTextHelper.onArrowKeyDown).toHaveBeenCalled();
          NormalTextHelper.onArrowKeyDown.reset();
          FormulaTextHelper.onArrowKeyDown.reset();

          // mimic changing the text to be normal text
          FormulaBar.setDisplayText('foobar');
          _dispatchKeyEvent('keyup');

          _dispatchKeyEvent('keydown', _kArrowLeftKeyCode);
          expect(NormalTextHelper.onArrowKeyDown).toHaveBeenCalled();
        });

    it('should call doCommitCellEdit() on its text helper when it receives ' +
        'a "keyup" event for Enter or Tab', function() {
          FormulaBar.setDisplayText('=F82');
          var selectionObj = {
            textWidget: FormulaBar,
            contentType: 'sheetText'
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          // Note: spyOn(FormulatTextHelper.doCommitCellEdit) doesn't work
          // so instead let's verify that its contents are called
          spyOn(FormulaBar, 'commit');

          _dispatchKeyEvent('keydown', _kEnterKeyCode);
          // generate an 'Enter' keyup event
          _dispatchKeyEvent('keyup', _kEnterKeyCode);

          expect(FormulaBar.commit).toHaveBeenCalled();
          expect(SheetModel.lastAnchorCell).toBeUndefined();
          FormulaBar.commit.reset();
          SheetModel.lastAnchorCell = 'blah';

          _dispatchKeyEvent('keydown');
          // mimic changing the text to be normal text
          FormulaBar.setDisplayText('some text');
          _dispatchKeyEvent('keyup');

          _dispatchKeyEvent('keydown', _kTabKeyCode);

          // generate a 'Tab' keyup event
          _dispatchKeyEvent('keyup', _kTabKeyCode);

          expect(FormulaBar.commit).toHaveBeenCalled();
          expect(SheetModel.lastAnchorCell).toBeUndefined();
        });

    it('should call cancel() on the text editor widget when it receives a ' +
        '"keyup" event for Escape', function() {
          var globalValue = 12;

          var textWidget = {};
          textWidget.cancel = function() {
            globalValue = 70;
          };
          textWidget.getNode = function() {};
          textWidget.getDisplayText = function() {
            return '';
          };

          var selectionObj = {
            textWidget: textWidget,
            contentType: 'sheetText'
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          spyOn(textWidget, 'cancel').andCallThrough();

          _dispatchKeyEvent('keydown', _kEscapeKeyCode);
          // generate an 'Escape' keyup event
          _dispatchKeyEvent('keyup', _kEscapeKeyCode);

          expect(textWidget.cancel).toHaveBeenCalled();
          expect(globalValue).toBe(70);
          expect(SheetModel.lastAnchorCell).toBeUndefined();
        });

    it('should reset the previous text helper when switching ' +
        'to a different text helper due to a keyup event', function() {
          expect(ToolsManager.activeTool).toBeUndefined();

          spyOn(NormalTextHelper, 'init');
          spyOn(FormulaTextHelper, 'init');
          spyOn(NormalTextHelper, 'reset');
          spyOn(FormulaTextHelper, 'reset');

          FormulaBar.setDisplayText('foobar');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);
          expect(NormalTextHelper.init).toHaveBeenCalled();

          // mimic changing the text to be a formula
          FormulaBar.setDisplayText('=C93');
          _dispatchKeyEvent('keydown');
          _dispatchKeyEvent('keyup');
          expect(NormalTextHelper.reset).toHaveBeenCalled();
          expect(FormulaTextHelper.init).toHaveBeenCalled();

          // mimic changing the text back to be normal text
          FormulaBar.setDisplayText('Employee');
          _dispatchKeyEvent('keydown');
          _dispatchKeyEvent('keyup');
          expect(FormulaTextHelper.reset).toHaveBeenCalled();
          expect(NormalTextHelper.init).toHaveBeenCalled();
        });

    it('should do nothing when the required text helper is the same as the' +
        ' current text helper after a keyup event', function() {
          expect(ToolsManager.activeTool).toBeUndefined();

          spyOn(NormalTextHelper, 'init');
          spyOn(FormulaTextHelper, 'init');
          spyOn(NormalTextHelper, 'reset');
          spyOn(FormulaTextHelper, 'reset');

          FormulaBar.setDisplayText('foobar');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);
          expect(NormalTextHelper.init).toHaveBeenCalled();
          NormalTextHelper.init.reset();
          FormulaTextHelper.init.reset();
          NormalTextHelper.reset.reset();
          FormulaTextHelper.reset.reset();

          // mimic changing the text to be different normal text
          FormulaBar.setDisplayText('some text');
          _dispatchKeyEvent('keydown');
          _dispatchKeyEvent('keyup');
          expect(NormalTextHelper.reset).not.toHaveBeenCalled();
          expect(NormalTextHelper.init).not.toHaveBeenCalled();
          expect(FormulaTextHelper.reset).not.toHaveBeenCalled();
          expect(FormulaTextHelper.init).not.toHaveBeenCalled();
          NormalTextHelper.init.reset();
          FormulaTextHelper.init.reset();
          NormalTextHelper.reset.reset();
          FormulaTextHelper.reset.reset();

          // change the text to be a formula
          FormulaBar.setDisplayText('=B32');
          _dispatchKeyEvent('keydown');
          _dispatchKeyEvent('keyup');
          expect(NormalTextHelper.reset).toHaveBeenCalled();
          expect(FormulaTextHelper.init).toHaveBeenCalled();
          NormalTextHelper.init.reset();
          FormulaTextHelper.init.reset();
          NormalTextHelper.reset.reset();
          FormulaTextHelper.reset.reset();

          // mimic changing the text to be different formula text
          FormulaBar.setDisplayText('=B32 + F18');
          _dispatchKeyEvent('keydown');
          _dispatchKeyEvent('keyup');
          expect(FormulaTextHelper.reset).not.toHaveBeenCalled();
          expect(FormulaTextHelper.init).not.toHaveBeenCalled();
          expect(NormalTextHelper.reset).not.toHaveBeenCalled();
          expect(NormalTextHelper.init).not.toHaveBeenCalled();
        });

    it('should call onMouseDownOnPanesContainer() on its text helper' +
        'when a mousdown event occurs on the panes container', function() {
          FormulaBar.setDisplayText('some normal text');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          spyOn(NormalTextHelper, 'onMouseDownOnPanesContainer');
          spyOn(FormulaTextHelper, 'onMouseDownOnPanesContainer');

          // generate a 'mousedown' event on the pane's container node
          var evt = document.createEvent('Event');
          evt.initEvent('mousedown', true, false);
          PaneManager.getPanesContainerNode().dispatchEvent(evt);

          expect(NormalTextHelper.onMouseDownOnPanesContainer).
              toHaveBeenCalled();
          expect(FormulaTextHelper.onMouseDownOnPanesContainer).not.
              toHaveBeenCalled();
          NormalTextHelper.onMouseDownOnPanesContainer.reset();
          FormulaTextHelper.onMouseDownOnPanesContainer.reset();

          // mimic changing the text to be formula text
          FormulaBar.setDisplayText('=B59');
          _dispatchKeyEvent('keydown');
          _dispatchKeyEvent('keyup');

          // generate a 'mousedown' event on the pane's container node
          PaneManager.getPanesContainerNode().dispatchEvent(evt);

          expect(NormalTextHelper.onMouseDownOnPanesContainer).not.
              toHaveBeenCalled();
          expect(FormulaTextHelper.onMouseDownOnPanesContainer).
              toHaveBeenCalled();
        });

    it('should prevent the default context menu from appearing', function() {
      ToolsManager.setActiveTool();

      FormulaBar.setDisplayText('=J14');
      var selectionObj = {
        contentType: 'sheetText',
        textWidget: FormulaBar
      };
      SheetModel.activeSheetIndex = 2;
      PubSub.publish('qowt:sheet:requestFocus', selectionObj);

      // generate a 'contextmenu' event
      var evt = document.createEvent('Event');
      evt.initEvent('contextmenu', true, false);
      spyOn(evt, 'preventDefault');
      document.dispatchEvent(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
    });

    it("should call texteditor's injectNewlineCharacter() when it " +
       "receives a 'keyup' event for Enter with shift key", function() {
      FormulaBar.setDisplayText("abc");
      var selectionObj = {
        textWidget: FormulaBar,
        contentType: 'sheetText'
      };
      SheetModel.activeSheetIndex = 2;
      PubSub.publish('qowt:sheet:requestFocus', selectionObj);

      spyOn(FormulaBar, 'injectNewlineCharacter');

      _dispatchKeyEvent('keydown', _kEnterKeyCode, 'shiftKey');
      // generate an 'Enter' keyup event
      _dispatchKeyEvent('keyup', _kEnterKeyCode, 'shiftKey');

      expect(FormulaBar.injectNewlineCharacter).toHaveBeenCalled();
    });

  });

   var _dispatchKeyEvent = function(eventType, keyCode, opt_attributeOn) {
    var evt = document.createEvent("Event");
    var pane = PaneManager.getMainPane();
    var floatingEditor = pane.getFloatingEditor();
    evt.initEvent(eventType, true, false);
    if (keyCode) {
      evt.keyCode = keyCode;
      if(opt_attributeOn) {
        evt[opt_attributeOn] = true;
      }
    }
    floatingEditor.getNode().dispatchEvent(evt);
  };

});
