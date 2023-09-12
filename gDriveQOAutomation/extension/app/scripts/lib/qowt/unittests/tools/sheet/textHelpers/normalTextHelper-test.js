// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the 'normal' text helper of the sheet text tool.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/tools/sheet/textHelpers/normalTextHelper',
  'qowtRoot/utils/domListener',
  'qowtRoot/models/sheet',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/controls/grid/autocompleteHandler',
  'qowtRoot/selection/sheetSelectionManager'
], function(
    NormalTextHelper,
    DomListener,
    SheetModel,
    PubSub,
    AutocompleteHandler,
    SheetSelectionManager) {

  'use strict';

  describe('The "normal" text helper of the sheet text tool', function() {

    it('should inherit from the BaseHelper API', function() {
      expect(NormalTextHelper.mode).toBeDefined();
      expect(NormalTextHelper.init).toBeDefined();
      expect(NormalTextHelper.reset).toBeDefined();
      expect(NormalTextHelper.onMouseDownOnPanesContainer).toBeDefined();
      expect(NormalTextHelper.onMouseDownOnPane).toBeDefined();
      expect(NormalTextHelper.onArrowKeyDown).toBeDefined();
      expect(NormalTextHelper.onMutationEvent).toBeDefined();
      expect(NormalTextHelper.onInjectAutocompleteText).toBeDefined();
      expect(NormalTextHelper.doCommitCellEdit).toBeDefined();
    });

    it('should override the mode property to define its own', function() {
      expect(NormalTextHelper.mode).toBe('normal');
    });

    it('should override the init() method to set up the auto-complete menu',
        function() {
          spyOn(AutocompleteHandler, 'generateCandidateList');
          spyOn(DomListener, 'add');

          NormalTextHelper.init();
          expect(AutocompleteHandler.generateCandidateList).toHaveBeenCalled();
          expect(DomListener.add).toHaveBeenCalled();
        });

    it('should override the reset() method to clear the auto-complete menu',
        function() {
          spyOn(AutocompleteHandler, 'clearCandidateList');
          spyOn(DomListener, 'removeGroup');

          NormalTextHelper.reset();
          expect(AutocompleteHandler.clearCandidateList).toHaveBeenCalled();
          expect(DomListener.removeGroup).toHaveBeenCalled();
        });

    it('should override the onMouseDownOnPane() method to call ' +
        'doCommitCellEdit()', function() {
          SheetSelectionManager.init();
          var textWidget = {
            commit: function() {
            }
          };
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: textWidget
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          // Note: spyOn(NormalTextHelper.doCommitCellEdit) doesn't work
          // so instead let's verify that its contents are called
          spyOn(textWidget, 'commit');
          NormalTextHelper.onMouseDownOnPane();
          expect(textWidget.commit).toHaveBeenCalled();
          expect(SheetModel.lastAnchorCell).toBeUndefined();
        });

    it('should override the onInjectAutocompleteText() method to inject ' +
        'the chosen text and then commit the edit', function() {
          SheetSelectionManager.init();
          var textWidget = {
            isInline: function() {
              return true;
            },
            setDisplayText: function() {
            },
            commit: function() {
            }
          };
          var selectionObj = {
            contentType: 'sheetText',
            textWidget: textWidget
          };
          SheetModel.activeSheetIndex = 1;
          PubSub.publish('qowt:sheet:requestFocus', selectionObj);

          spyOn(textWidget, 'setDisplayText').andCallThrough();
          // Note: spyOn(NormalTextHelper.doCommitCellEdit) doesn't work
          // so instead let's verify that its contents are called
          spyOn(textWidget, 'commit');

          NormalTextHelper.onInjectAutocompleteText('world');
          expect(textWidget.setDisplayText).toHaveBeenCalledWith('world');
          expect(textWidget.commit).toHaveBeenCalled();
          expect(SheetModel.lastAnchorCell).toBeUndefined();
        });
  });

});
