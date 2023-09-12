// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test suite for the auto-complete
 * action handler of Quicksheet.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/toolManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/controls/grid/workbook',
  'qowtRoot/tools/sheet/textHelpers/normalTextHelper',
  'qowtRoot/tools/sheet/textHelpers/formulaTextHelper',
  'qowtRoot/widgets/grid/formulaBar',
  'qowtRoot/models/sheet',
  'qowtRoot/selection/sheetSelectionManager',
  'qowtRoot/tools/sheet/actionHandlers/autoComplete'
], function(
    ToolManager,
    PubSub,
    Workbook,
    NormalTextHelper,
    FormulaTextHelper,
    FormulaBar,
    SheetModel,
    SheetSelectionManager) {

  'use strict';

  describe('Auto-complete action handler', function() {
    var rootNode;

    beforeEach(function() {
      Workbook.init();

      rootNode = document.createElement('div');
      rootNode.className = 'qowt-sheet-formula-bar-container';
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      Workbook.reset();
    });

    it('should call onInjectAutocompleteText() on the active text helper ' +
        'when a "qowt:requestAction" signal for "injectAutocomplete" is ' +
        'published and the Sheet Text Tool is active', function() {
          SheetSelectionManager.init();
          // activate the Sheet Text Tool
          FormulaBar.setDisplayText('=G67');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);
          expect(ToolManager.activeTool).toBe('sheetText');

          var actionData = {
            'action': 'injectAutocomplete',
            'context': {
              value: 8,
              contentType: 'sheetText'
            }
          };

          spyOn(FormulaTextHelper, 'onInjectAutocompleteText');
          PubSub.publish('qowt:requestAction', actionData);
          expect(FormulaTextHelper.onInjectAutocompleteText).
              toHaveBeenCalledWith(actionData.context.value);

          FormulaBar.appendTo(rootNode);
          // mimic changing the text to be normal text
          FormulaBar.setDisplayText('some text');

          var keyDownEvt = document.createEvent('Event');
          keyDownEvt.initEvent('keydown', true, false);
          FormulaBar.getNode().dispatchEvent(keyDownEvt);

          var keyUpEvt = document.createEvent('Event');
          keyUpEvt.initEvent('keyup', true, false);
          FormulaBar.getNode().dispatchEvent(keyUpEvt);

          spyOn(NormalTextHelper, 'onInjectAutocompleteText');
          PubSub.publish('qowt:requestAction', actionData);
          expect(NormalTextHelper.onInjectAutocompleteText).
              toHaveBeenCalledWith(actionData.context.value);
        });
  });

});
