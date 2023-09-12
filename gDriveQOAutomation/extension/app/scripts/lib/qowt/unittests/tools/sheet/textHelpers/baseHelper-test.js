// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the base helper of the sheet text tool.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/sheet/textHelpers/baseHelper',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/formulaBar',
  'qowtRoot/selection/sheetSelectionManager'
], function(
    BaseHelper,
    SheetModel,
    PubSub,
    FormulaBar,
    SheetSelectionManager) {

  'use strict';

  describe('The base helper of the sheet text tool', function() {

    it('should have a create() method that returns the expected API',
        function() {
          expect(BaseHelper.create).toBeDefined();
          var api = BaseHelper.create();
          expect(api.mode).toBe('base');
          expect(api.init).toBeDefined();
          expect(api.reset).toBeDefined();
          expect(api.onMouseDownOnPanesContainer).toBeDefined();
          expect(api.onMouseDownOnPane).toBeDefined();
          expect(api.onArrowKeyDown).toBeDefined();
          expect(api.onMutationEvent).toBeDefined();
          expect(api.onInjectAutocompleteText).toBeDefined();
          expect(api.doCommitCellEdit).toBeDefined();
        });

    it('should have a doCommitCellEdit() that calls commit() on the ' +
        'active text editor', function() {
          SheetSelectionManager.init();
          FormulaBar.init();
          FormulaBar.setDisplayText('=F82');
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: FormulaBar
          };
          SheetModel.activeSheetIndex = 2;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          spyOn(FormulaBar, 'commit');

          SheetModel.lastAnchorCell = 'foo';
          var api = BaseHelper.create();
          api.mode = 'formula';
          var dummyEvt = {keyCode: 'dummy'};
          api.doCommitCellEdit(dummyEvt);

          // commit should have been called with the dummy
          // event and with the 'isFormula' param set to true
          expect(FormulaBar.commit).toHaveBeenCalledWith(dummyEvt, true);
          expect(SheetModel.lastAnchorCell).toBeUndefined();

          SheetModel.lastAnchorCell = 'bar';
          api.mode = 'normal';
          dummyEvt = {keyCode: 'test'};
          api.doCommitCellEdit(dummyEvt);

          // commit should have been called with the dummy
          // event and with the 'isFormula' param set to false
          expect(FormulaBar.commit).toHaveBeenCalledWith(dummyEvt, false);
          expect(SheetModel.lastAnchorCell).toBeUndefined();
        });

    it('should not be able to override the doCommitCellEdit() method',
        function() {
          var api = BaseHelper.create();
          var errorThrown;
          try {
            api.doCommitCellEdit = function() {
            };
          }
          catch (e) {
            errorThrown = e;
          }

          expect(errorThrown).toBeDefined();
          expect(errorThrown.message.indexOf('Cannot assign to read only ' +
              'property')).not.toBe(-1);
        });
  });

});
