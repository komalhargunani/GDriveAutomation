define([
  'qowtRoot/controls/grid/floaterManager',
  'qowtRoot/widgets/grid/floaterMergeCell'
], function(
    FloaterManager,
    FloaterMergeCell) {

  'use strict';
  var mergeCellFloaterType = 'sheetFloaterMergeCell';

  describe('Floater Manager layout control', function() {

    var floaterManager = FloaterManager.create();
    var p1 = {x: 5, y: 6};
    var p2 = {x: 8, y: 9};
    var p3 = {x: 12, y: 15};
    var mergeConfig = {
      colSpan: 2,
      rowSpan: 2
    };

    var mergeWidgetInRow, mergeWidgetInCol, mergeWidgetInRange;

    beforeEach(function() {
      mergeWidgetInRow = FloaterMergeCell.create(p1.x, p1.y, mergeConfig);
      mergeWidgetInCol = FloaterMergeCell.create(p2.x, p2.y, mergeConfig);
      mergeWidgetInRange = FloaterMergeCell.create(p3.x, p3.y, mergeConfig);
      floaterManager.attachWidget(mergeWidgetInRow);
      floaterManager.attachWidget(mergeWidgetInCol);
      floaterManager.attachWidget(mergeWidgetInRange);
      assert.isDefined(floaterManager);
    });


    afterEach(function() {
      floaterManager.reset();
    });


    describe('Test getFloatersInRange()', function() {
      it('should find merge cell floaters in range', function() {
        var r1 = p1.y, c1 = p1.x;
        var r2 = r1 + 4, c2 = c1 + 5;
        var floatersInRange = floaterManager.
            getFloatersInRange(r1, c1, r2, c2, mergeCellFloaterType);
        assert.strictEqual(floatersInRange.length, 2);
        assert.deepEqual(mergeWidgetInRow, floatersInRange[0]);
        assert.deepEqual(mergeWidgetInCol, floatersInRange[1]);
      });
    });


    describe('Test getAllFloaters()', function() {
      it('should find all merge cell floaters in sheet', function() {
        var floatersInSheet = floaterManager.
            getAllFloaters(mergeCellFloaterType);
        assert.strictEqual(floatersInSheet.length, 3);
        assert.deepEqual(mergeWidgetInRow, floatersInSheet[0]);
        assert.deepEqual(mergeWidgetInCol, floatersInSheet[1]);
        assert.deepEqual(mergeWidgetInRange, floatersInSheet[2]);
      });
    });


    describe('Test isRangeMerged()', function() {
      it('should return true if the range is merged', function() {
        function getComputedR2(r1) {return (r1 + mergeConfig.rowSpan - 1);}
        function getComputedC2(c1) {return (c1 + mergeConfig.colSpan - 1);}

        var r1 = p1.y;
        var c1 = p1.x;
        var r2 = getComputedR2(r1);
        var c2 = getComputedC2(c1);
        assert.isTrue(floaterManager.isRangeMerged(r1, c1, r2, c2));

        r1 = p2.y; c1 = p2.x;
        r2 = getComputedR2(r1);
        c2 = getComputedC2(c1);
        assert.isTrue(floaterManager.isRangeMerged(r1, c1, r2, c2));

        r1 = p3.y; c1 = p3.x;
        r2 = getComputedR2(r1);
        c2 = getComputedC2(c1);
        assert.isTrue(floaterManager.isRangeMerged(r1, c1, r2, c2));
      });


      it('should return false if the range is not merged', function() {
        function getComputedR2(r1) {return (r1 + mergeConfig.rowSpan + 10);}
        function getComputedC2(c1) {return (c1 + mergeConfig.colSpan + 10);}

        var r1 = p1.y;
        var c1 = p1.x;
        var r2 = getComputedR2(r1);
        var c2 = getComputedC2(c1);
        assert.isFalse(floaterManager.isRangeMerged(r1, c1, r2, c2));

        r1 = p2.y; c1 = p2.x;
        r2 = getComputedR2(r1);
        c2 = getComputedC2(c1);
        assert.isFalse(floaterManager.isRangeMerged(r1, c1, r2, c2));

        r1 = p3.y; c1 = p3.x;
        r2 = getComputedR2(r1);
        c2 = getComputedC2(c1);
        assert.isFalse(floaterManager.isRangeMerged(r1, c1, r2, c2));
      });
    });
  });
});
