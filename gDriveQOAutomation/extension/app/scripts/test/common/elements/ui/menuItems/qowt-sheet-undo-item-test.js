define([
    'common/elements/ui/menuItems/qowt-sheet-undo-item/qowt-sheet-undo-item'
  ], function() {

  'use strict';

  describe('qowt-sheet-undo-item element', function() {
    var item;
    var sheetTextSelection = {newSelection: {contentType: 'sheetText'}};
    var sheetCellSelection = {newSelection: {contentType: 'sheetCell'}};

    beforeEach(function() {
      this.stampOutTempl('qowt-sheet-undo-item-test-template');
      item = this.getTestDiv().querySelector('qowt-sheet-undo-item');
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(item, QowtSheetUndoItem, 'is a qowt-sheet-undo-item');
    });

    it('should default to an undo item if no type is given.', function() {
      assert.strictEqual(item.type, 'undo', 'default is undo item');
    });

    it('should default to having an empty undo stack state.', function() {
      assert.isTrue(item.stackEmpty_, 'empty stack');
    });

    it('should default to allowing the item to enable.', function() {
      assert.isTrue(item.allowEnable_, 'enable allowed');
    });

    it('should disable the item on getting stackEmpty.', function() {
      item.disabled = false;
      item.stackEmpty_ = false;
      assertStackAndDisabledState(item.stackEmptyListener, true, true);
    });

    it('should enable the item on stackNonEmpty with enable allowed.',
        function() {
      item.allowEnable_ = true;

      item.stackNonEmptyListener();
      assertStackAndDisabledState(item.stackNonEmptyListener, false, false);
    });

    it('should disable the item on stackNonEmpty with enable disallowed.',
        function() {
      item.allowEnable_ = false;
      assertStackAndDisabledState(item.stackNonEmptyListener,false, true);
    });

    it('should disable and not allowEnable on selectionChange with sheetText',
        function() {
      item.enableHandler(false, '', sheetTextSelection);
      assert.isTrue(item.disabled, 'expect disabled');
      assert.isFalse(item.allowEnable_, 'expect enable not allowed');
    });

    it('should disable and allowEnable on selectionChange with sheetCell ' +
        'and stack empty' ,function() {
      item.stackEmpty_ = true;
      item.enableHandler(false, '', sheetCellSelection);
      assert.isTrue(item.disabled, 'disabled');
      assert.isTrue(item.allowEnable_, 'enableAllowed');
    });

    it('should enable and allowEnable on selectionChange with sheetCell ' +
        'and stack not empty' ,function() {
      item.stackEmpty_ = false;
      item.enableHandler(false, '', sheetCellSelection);
      assert.isFalse(item.disabled, 'disabled');
      assert.isTrue(item.allowEnable_, 'enableAllowed');
    });

    function assertStackAndDisabledState(
        testFunc, expectedStackEmpty,expectedDisabled) {
      testFunc();
      if (expectedStackEmpty) {
        assert.isTrue(item.stackEmpty_, 'expect stack empty');
      } else {
        assert.isFalse(item.stackEmpty_, 'expect stack non empty');
      }
      if (expectedDisabled) {
        assert.isTrue(item.disabled, 'expect item disabled');
      } else  {
        assert.isFalse(item.disabled, 'expect item enabled');
      }
    }
  });
});
