define([
  'common/elements/ui/menuItems/qowt-sheet-rowcol-item/qowt-sheet-rowcol-item'
  ], function() {

  'use strict';

  describe('qowt-sheet-rowcol-item element', function() {
    var item;
    var signalNotUsed = 'aliasSignallName';
    var signalData = {
      newSelection: {
        contentType: 'sheetCell',
        topLeft: {
          colIdx: 1,
          rowIdx: 1
        }
      }
    };

    beforeEach(function() {
      this.stampOutTempl('qowt-sheet-rowcol-item-test-template');
      item = this.getTestDiv().querySelector('qowt-sheet-rowcol-item');
    });

    it('should have the correct prototype chain', function() {
      assert.instanceOf(item, QowtSheetRowcolItem,
          'is a qowt-sheet-rowcol-item');
    });

    it('should default a non-explicitly typed item to "row"', function() {
      assert.strictEqual(item.type, 'row', 'should be a "row" item');
    });

    it('should set a non-typed enabled item disabled', function() {
      assertItemState(undefined, false, true);
    });

    it('should set a non-typed disabled item disabled', function() {
      assertItemState(undefined, true, true);
    });

    it('should enable a disabled column item', function() {
      assertItemState('column', true, false);
    });

    it('should enable a disabled row item', function() {
      assertItemState('row', true, false);
    });

    it('should leave an enabled column item enabled', function() {
      assertItemState('column', false, false);
    });

    it('should leave an enabled row item enabled', function() {
      assertItemState('row', false, false);
    });

    function assertItemState(itemType, initialDisabled, expectDisabled) {
      item.type = itemType;
      item.disabled = initialDisabled;
      item.enableHandler(false, signalNotUsed, signalData);
      if (expectDisabled) {
        assert.isTrue(item.disabled, 'should be disabled');
      } else {
        assert.isFalse(item.disabled, 'should be enabled');
      }
    }
  });
});
