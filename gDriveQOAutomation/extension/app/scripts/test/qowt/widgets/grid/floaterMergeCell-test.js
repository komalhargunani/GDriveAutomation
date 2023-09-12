define([
  'qowtRoot/widgets/grid/floaterMergeCell'
], function(
    SheetFloaterMergeCell) {

  'use strict';

  describe('sheet floater merge cell widget', function() {
    var mergeCellWidget;
    beforeEach(function() {
      mergeCellWidget = SheetFloaterMergeCell.create(2, 3, {
        rowSpan: 3,
        colSpan: 4
      });
    });

    afterEach(function() {
      mergeCellWidget = undefined;
    });

    it('should return true if merge cell lies completely in selected range.',
        function() {
          assert.isTrue(mergeCellWidget.isCompletelyInSelection(3, 2, 6, 7));
        });

    it('should return false if merge cell does not lies completely in ' +
        'selected range.', function() {
      assert.isFalse(mergeCellWidget.isCompletelyInSelection(3, 3, 6, 8));
    });

    it('should return true if merge cell lies completely in selected range.',
        function() {
          assert.isTrue(mergeCellWidget.isInRange(3, 2, 6, 7));
        });

    it('should return true if merge cell lies partially in selected range.',
        function() {
      assert.isTrue(mergeCellWidget.isInRange(3, 3, 6, 8));
    });

    it('should return false if merge cell does not lie in selected range.',
        function() {
          assert.isFalse(mergeCellWidget.isInRange(4, 7, 6, 9));
        });
  });
});
