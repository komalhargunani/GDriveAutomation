// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Floater Manager unit test suite.
 * @author mikkor@google.com (Mikko Rintala)
 */

define([
  'qowtRoot/controls/grid/floaterManager',
  'qowtRoot/widgets/grid/floaterChart',
  'qowtRoot/widgets/grid/floaterImage',
  'qowtRoot/widgets/grid/floaterMergeCell'
], function(
    FloaterManager,
    FloaterChart,
    FloaterImage,
    FloaterMergeCell) {

  'use strict';

  describe('Floater Manager layout control', function() {

    var floaterManager = FloaterManager.create();

    var chartConfig = {
      anchor: {
        type: 'two',
        frm: {
          ci: 7,
          ri: 11,
          xo: 19050,
          yo: 142875
        },
        to: {
          ci: 18,
          ri: 22,
          xo: 323850,
          yo: 28575
        }
      }
    };

    var mergeConfig = {
      colSpan: 10,
      rowSpan: 10
    };

    var imageConfigOne = {
      anchor: {
        type: 'one',
        frm: {
          ri: 10,
          ci: 10,
          xo: 100,
          yo: 100
        }
      }
    };

    var imageConfigTwo = {
      anchor: {
        type: 'two',
        frm: {
          ri: 10,
          ci: 10
        },
        to: {
          ri: 19,
          ci: 19
        }
      }
    };

    var imageConfigAbs = {
      anchor: {
        type: 'abs',
        pos: {
          x: 10,
          y: 10
        },
        ext: {
          cx: 10,
          cy: 10
        }
      }
    };

    var chartWidget, imageWidget1, imageWidget2, imageWidgetA, mergeWidget;

    beforeEach(function() {
      floaterManager.reset();
      chartWidget = FloaterChart.create(chartConfig);
      imageWidget1 = FloaterImage.create(imageConfigOne);
      imageWidget2 = FloaterImage.create(imageConfigTwo);
      imageWidgetA = FloaterImage.create(imageConfigAbs);
      mergeWidget = FloaterMergeCell.create(10, 10, mergeConfig);
    });

    afterEach(function() {
      floaterManager.reset();
    });

    it('should be defined', function() {
      expect(floaterManager).toBeDefined();
    });
    it('reset should remove the floaters', function() {
      floaterManager.attachWidget(chartWidget);
      floaterManager.attachWidget(imageWidget1);
      floaterManager.attachWidget(imageWidget2);
      floaterManager.attachWidget(imageWidgetA);
      floaterManager.attachWidget(mergeWidget);
      expect(floaterManager.count()).toBe(5);
      floaterManager.reset();
      expect(floaterManager.count()).toBe(0);
    });

    it('should not adjust range when expand with no merged cell', function() {
      floaterManager.attachWidget(mergeWidget);
      var res = floaterManager.calculateAdjustedSelectionRange(
          0, 3, 5, 8, true);

      expect(res.minRowIdx).toBe(0);
      expect(res.maxRowIdx).toBe(3);
      expect(res.minColIdx).toBe(5);
      expect(res.maxColIdx).toBe(8);
    });

    it('should adjust range when expand inside merged cell', function() {
      floaterManager.attachWidget(mergeWidget);
      var res = floaterManager.calculateAdjustedSelectionRange(
          12, 12, 12, 12, true);

      expect(res.minRowIdx).toBe(10);
      expect(res.maxRowIdx).toBe(19);
      expect(res.minColIdx).toBe(10);
      expect(res.maxColIdx).toBe(19);
    });

    it('should not adjust range when shrink row with no merged cell',
       function() {
         floaterManager.attachWidget(mergeWidget);
         var res = floaterManager.calculateAdjustedSelectionRange(
             0, 6, 0, 6, false, true);

         expect(res.minRowIdx).toBe(0);
         expect(res.maxRowIdx).toBe(6);
         expect(res.minColIdx).toBe(0);
         expect(res.maxColIdx).toBe(6);
       });

    it('should adjust range when shrink row inside merged cell', function() {
      floaterManager.attachWidget(mergeWidget);
      var res = floaterManager.calculateAdjustedSelectionRange(
          5, 18, 3, 15, false, true);

      expect(res.minRowIdx).toBe(5);
      expect(res.maxRowIdx).toBe(9);
      expect(res.minColIdx).toBe(3);
      expect(res.maxColIdx).toBe(15);
    });

    it('should not adjust range when shrink col with no merged cell',
       function() {
         floaterManager.attachWidget(mergeWidget);
         var res = floaterManager.calculateAdjustedSelectionRange(
             0, 3, 5, 8, false, false, true);

         expect(res.minRowIdx).toBe(0);
         expect(res.maxRowIdx).toBe(3);
         expect(res.minColIdx).toBe(5);
         expect(res.maxColIdx).toBe(8);
       });

    it('should adjust range when shrink col inside merged cell', function() {
      floaterManager.attachWidget(mergeWidget);
      var res = floaterManager.calculateAdjustedSelectionRange(
          8, 25, 6, 18, false, false, true);

      expect(res.minRowIdx).toBe(8);
      expect(res.maxRowIdx).toBe(25);
      expect(res.minColIdx).toBe(6);
      expect(res.maxColIdx).toBe(9);
    });

    it('should not adjust range when whole row is selected', function() {
      floaterManager.attachWidget(mergeWidget);
      var res = floaterManager.calculateAdjustedSelectionRange(
          0, 3, undefined, undefined, true);

      expect(res.minRowIdx).toBe(0);
      expect(res.maxRowIdx).toBe(3);
      expect(res.minColIdx).toBe(undefined);
      expect(res.maxColIdx).toBe(undefined);
    });

    it('should not adjust range when whole col is selected', function() {
      floaterManager.attachWidget(mergeWidget);
      var res = floaterManager.calculateAdjustedSelectionRange(
          undefined, undefined, 0, 3, true);

      expect(res.minRowIdx).toBe(undefined);
      expect(res.maxRowIdx).toBe(undefined);
      expect(res.minColIdx).toBe(0);
      expect(res.maxColIdx).toBe(3);
    });


    // TODO(mikkor) Comment these out as they are not needed until core
    // supports proper modifying and saving of images and charts (Issue 307935)

    /*
    // Chart widget
    // Rows
    it('should move chart widget correctly if rows inserted before the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterRowSplice(5, 3);
         expect(chartWidget.y()).toBe(13);
         expect(chartWidget.rowSpan()).toBe(10);
       });

    it('should make chart widget bigger if rows inserted inside the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterRowSplice(12, 3);
         expect(chartWidget.y()).toBe(10);
         expect(chartWidget.rowSpan()).toBe(13);
       });

    it('should not move chart widget if rows inserted after the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterRowSplice(22, 3);
         expect(chartWidget.y()).toBe(10);
         expect(chartWidget.rowSpan()).toBe(10);
       });

    it('should move chart widget correctly if rows deleted before the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterRowSplice(5, 3, true);
         expect(chartWidget.y()).toBe(7);
         expect(chartWidget.rowSpan()).toBe(10);
       });

    it('should make chart widget smaller if rows deleted inside the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterRowSplice(12, 3, true);
         expect(chartWidget.y()).toBe(10);
         expect(chartWidget.rowSpan()).toBe(7);
       });

    it('should not move chart widget if rows deleted after the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterRowSplice(22, 3, true);
         expect(chartWidget.y()).toBe(10);
         expect(chartWidget.rowSpan()).toBe(10);
       });

    // Cols
    it('should move chart widget correctly if cols inserted before the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterColumnSplice(5, 3);
         expect(chartWidget.x()).toBe(13);
         expect(chartWidget.colSpan()).toBe(10);
       });

    it('should make chart widget bigger if cols inserted inside the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterColumnSplice(12, 3);
         expect(chartWidget.x()).toBe(10);
         expect(chartWidget.colSpan()).toBe(13);
       });

    it('should not move chart widget if cols inserted after the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterColumnSplice(22, 3);
         expect(chartWidget.x()).toBe(10);
         expect(chartWidget.colSpan()).toBe(10);
       });

    it('should move chart widget correctly if cols deleted before the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterColumnSplice(5, 3, true);
         expect(chartWidget.x()).toBe(7);
         expect(chartWidget.colSpan()).toBe(10);
       });

    it('should make chart widget smaller if cols deleted inside the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterColumnSplice(12, 3, true);
         expect(chartWidget.x()).toBe(10);
         expect(chartWidget.colSpan()).toBe(7);
       });

    it('should not move chart widget if cols deleted after the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterColumnSplice(22, 3, true);
         expect(chartWidget.x()).toBe(10);
         expect(chartWidget.colSpan()).toBe(10);
       });

    // Image widget (2 cell anchor)
    // Rows
    it('should move 2 cell anchor image widget correctly if rows inserted ' +
        'before the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterRowSplice(5, 3);
          expect(imageWidget2.y()).toBe(13);
          expect(imageWidget2.rowSpan()).toBe(10);
        });

    it('should make 2 cell anchor image widget bigger if rows inserted ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterRowSplice(12, 3);
          expect(imageWidget2.y()).toBe(10);
          expect(imageWidget2.rowSpan()).toBe(13);
        });

    it('should not move 2 cell anchor image widget if rows inserted after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterRowSplice(22, 3);
          expect(imageWidget2.y()).toBe(10);
          expect(imageWidget2.rowSpan()).toBe(10);
        });

    it('should move 2 cell anchor image widget correctly if rows deleted ' +
        'before the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterRowSplice(5, 3, true);
          expect(imageWidget2.y()).toBe(7);
          expect(imageWidget2.rowSpan()).toBe(10);
        });

    it('should make 2 cell anchor image widget bigger if rows delete inside ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterRowSplice(12, 3, true);
          expect(imageWidget2.y()).toBe(10);
          expect(imageWidget2.rowSpan()).toBe(7);
        });

    it('should not move 2 cell anchor image widget if rows delete after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterRowSplice(22, 3, true);
          expect(imageWidget2.y()).toBe(10);
          expect(imageWidget2.rowSpan()).toBe(10);
        });

    // Cols
    it('should move 2 cell anchor image widget correctly if cols inserted ' +
        'before the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterColumnSplice(5, 3);
          expect(imageWidget2.x()).toBe(13);
          expect(imageWidget2.colSpan()).toBe(10);
        });

    it('should make 2 cell anchor image widget bigger if cols inserted ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterColumnSplice(12, 3);
          expect(imageWidget2.x()).toBe(10);
          expect(imageWidget2.colSpan()).toBe(13);
        });

    it('should not move 2 cell anchor image widget if cols inserted after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterColumnSplice(22, 3);
          expect(imageWidget2.x()).toBe(10);
          expect(imageWidget2.colSpan()).toBe(10);
        });

    it('should move 2 cell anchor image widget correctly if cols deleted ' +
        'before the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterColumnSplice(5, 3, true);
          expect(imageWidget2.x()).toBe(7);
          expect(imageWidget2.colSpan()).toBe(10);
        });

    it('should make 2 cell anchor image widget bigger if cols delete inside ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterColumnSplice(12, 3, true);
          expect(imageWidget2.x()).toBe(10);
          expect(imageWidget2.colSpan()).toBe(7);
        });

    it('should not move 2 cell anchor image widget if cols delete after the ' +
        'widget', function() {
          floaterManager.attachWidget(imageWidget2);
          floaterManager.updateFloatersAfterColumnSplice(22, 3, true);
          expect(imageWidget2.x()).toBe(10);
          expect(imageWidget2.colSpan()).toBe(10);
        });

    // Image widget (1 cell anchor)
    // Rows
    it('should move 1 cell anchor image widget correctly if rows inserted ' +
        'before the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterRowSplice(5, 3);
          expect(imageWidget1.y()).toBe(13);
          expect(imageWidget1.rowSpan()).toBe(undefined);
        });

    it('should not make 1 cell anchor image widget bigger if rows inserted ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterRowSplice(12, 3);
          expect(imageWidget1.y()).toBe(10);
          expect(imageWidget1.rowSpan()).toBe(undefined);
        });

    it('should not move 1 cell anchor image widget if rows inserted after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterRowSplice(22, 3);
          expect(imageWidget1.y()).toBe(10);
          expect(imageWidget1.rowSpan()).toBe(undefined);
        });

    it('should move 1 cell anchor image widget correctly if rows deleted ' +
        'before the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterRowSplice(5, 3, true);
          expect(imageWidget1.y()).toBe(7);
          expect(imageWidget1.rowSpan()).toBe(undefined);
        });

    it('should not make 1 cell anchor image widget bigger if rows delete ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterRowSplice(12, 3, true);
          expect(imageWidget1.y()).toBe(10);
          expect(imageWidget1.rowSpan()).toBe(undefined);
        });

    it('should not move 1 cell anchor image widget if rows delete after the ' +
        'widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterRowSplice(22, 3, true);
          expect(imageWidget1.y()).toBe(10);
          expect(imageWidget1.rowSpan()).toBe(undefined);
        });

    // Cols
    it('should move 1 cell anchor image widget correctly if cols inserted ' +
        'before the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterColumnSplice(5, 3);
          expect(imageWidget1.x()).toBe(13);
          expect(imageWidget1.colSpan()).toBe(undefined);
        });

    it('should not make 1 cell anchor image widget bigger if cols inserted ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterColumnSplice(12, 3);
          expect(imageWidget1.x()).toBe(10);
          expect(imageWidget1.colSpan()).toBe(undefined);
        });

    it('should not move 1 cell anchor image widget if cols inserted after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterColumnSplice(22, 3);
          expect(imageWidget1.x()).toBe(10);
          expect(imageWidget1.colSpan()).toBe(undefined);
        });

    it('should move 1 cell anchor image widget correctly if cols deleted ' +
        'before the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterColumnSplice(5, 3, true);
          expect(imageWidget1.x()).toBe(7);
          expect(imageWidget1.colSpan()).toBe(undefined);
        });

    it('should not make 1 cell anchor image widget bigger if cols delete ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterColumnSplice(12, 3, true);
          expect(imageWidget1.x()).toBe(10);
          expect(imageWidget1.colSpan()).toBe(undefined);
        });

    it('should not move 1 cell anchor image widget if cols delete after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidget1);
          floaterManager.updateFloatersAfterColumnSplice(22, 3, true);
          expect(imageWidget1.x()).toBe(10);
          expect(imageWidget1.colSpan()).toBe(undefined);
        });

    // Image widget (abs anchor)
    // Rows
    it('should not move abs cell anchor image widget correctly if rows ' +
        'inserted before the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterRowSplice(5, 3);
          expect(imageWidgetA.y()).toBe(undefined);
          expect(imageWidgetA.rowSpan()).toBe(undefined);
        });

    it('should not make abs cell anchor image widget bigger if rows inserted ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterRowSplice(12, 3);
          expect(imageWidgetA.y()).toBe(undefined);
          expect(imageWidgetA.rowSpan()).toBe(undefined);
        });

    it('should not move abs cell anchor image widget if rows inserted after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterRowSplice(22, 3);
          expect(imageWidgetA.y()).toBe(undefined);
          expect(imageWidgetA.rowSpan()).toBe(undefined);
        });

    it('should not move abs cell anchor image widget correctly if rows ' +
        'deleted before the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterRowSplice(5, 3, true);
          expect(imageWidgetA.y()).toBe(undefined);
          expect(imageWidgetA.rowSpan()).toBe(undefined);
        });

    it('should not make abs cell anchor image widget bigger if rows delete ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterRowSplice(12, 3, true);
          expect(imageWidgetA.y()).toBe(undefined);
          expect(imageWidgetA.rowSpan()).toBe(undefined);
        });

    it('should not move abs cell anchor image widget if rows delete after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterRowSplice(22, 3, true);
          expect(imageWidgetA.y()).toBe(undefined);
          expect(imageWidgetA.rowSpan()).toBe(undefined);
        });

    // Cols
    it('should not move abs cell anchor image widget correctly if cols ' +
        'inserted before the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterColumnSplice(5, 3);
          expect(imageWidgetA.x()).toBe(undefined);
          expect(imageWidgetA.colSpan()).toBe(undefined);
        });

    it('should not make abs cell anchor image widget bigger if cols inserted ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterColumnSplice(12, 3);
          expect(imageWidgetA.x()).toBe(undefined);
          expect(imageWidgetA.colSpan()).toBe(undefined);
        });

    it('should not move abs cell anchor image widget if cols inserted after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterColumnSplice(22, 3);
          expect(imageWidgetA.x()).toBe(undefined);
          expect(imageWidgetA.colSpan()).toBe(undefined);
        });

    it('should not move abs cell anchor image widget correctly if cols ' +
        'deleted before the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterColumnSplice(5, 3, true);
          expect(imageWidgetA.x()).toBe(undefined);
          expect(imageWidgetA.colSpan()).toBe(undefined);
        });

    it('should not make abs cell anchor image widget bigger if cols delete ' +
        'inside the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterColumnSplice(12, 3, true);
          expect(imageWidgetA.x()).toBe(undefined);
          expect(imageWidgetA.colSpan()).toBe(undefined);
        });

    it('should not move abs cell anchor image widget if cols delete after ' +
        'the widget', function() {
          floaterManager.attachWidget(imageWidgetA);
          floaterManager.updateFloatersAfterColumnSplice(22, 3, true);
          expect(imageWidgetA.x()).toBe(undefined);
          expect(imageWidgetA.colSpan()).toBe(undefined);
        });

    // Merged cell widget (2 cell anchor)
    // Rows
    it('should move merged cell widget correctly if rows inserted before ' +
        'the widget', function() {
          floaterManager.attachWidget(chartWidget);
          floaterManager.updateFloatersAfterRowSplice(5, 3);
          expect(chartWidget.y()).toBe(13);
          expect(chartWidget.rowSpan()).toBe(10);
        });

    it('should make merged cell widget bigger if rows inserted inside the ' +
        'widget', function() {
          floaterManager.attachWidget(chartWidget);
          floaterManager.updateFloatersAfterRowSplice(12, 3);
          expect(chartWidget.y()).toBe(10);
          expect(chartWidget.rowSpan()).toBe(13);
        });

    it('should not move merged cell widget if rows inserted after the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterRowSplice(22, 3);
         expect(chartWidget.y()).toBe(10);
         expect(chartWidget.rowSpan()).toBe(10);
       });

    it('should move merged cell widget correctly if rows deleted before the ' +
        'widget', function() {
          floaterManager.attachWidget(chartWidget);
          floaterManager.updateFloatersAfterRowSplice(5, 3, true);
          expect(chartWidget.y()).toBe(7);
          expect(chartWidget.rowSpan()).toBe(10);
        });

    it('should make merged cell widget smaller if rows deleted inside the ' +
        'widget', function() {
          floaterManager.attachWidget(chartWidget);
          floaterManager.updateFloatersAfterRowSplice(12, 3, true);
          expect(chartWidget.y()).toBe(10);
          expect(chartWidget.rowSpan()).toBe(7);
        });

    it('should not move merged cell widget if rows deleted after the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterRowSplice(22, 3, true);
         expect(chartWidget.y()).toBe(10);
         expect(chartWidget.rowSpan()).toBe(10);
       });

    // Cols
    it('should move merged cell widget correctly if cols inserted before the ' +
        'widget', function() {
          floaterManager.attachWidget(chartWidget);
          floaterManager.updateFloatersAfterColumnSplice(5, 3);
          expect(chartWidget.x()).toBe(13);
          expect(chartWidget.colSpan()).toBe(10);
        });

    it('should make merged cell widget bigger if cols inserted inside the ' +
        'widget', function() {
          floaterManager.attachWidget(chartWidget);
          floaterManager.updateFloatersAfterColumnSplice(12, 3);
          expect(chartWidget.x()).toBe(10);
          expect(chartWidget.colSpan()).toBe(13);
        });

    it('should not move merged cell widget if cols inserted after the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterColumnSplice(22, 3);
         expect(chartWidget.x()).toBe(10);
         expect(chartWidget.colSpan()).toBe(10);
       });

    it('should move merged cell widget correctly if cols deleted before the ' +
        'widget', function() {
          floaterManager.attachWidget(chartWidget);
          floaterManager.updateFloatersAfterColumnSplice(5, 3, true);
          expect(chartWidget.x()).toBe(7);
          expect(chartWidget.colSpan()).toBe(10);
        });

    it('should make merged cell widget smaller if cols deleted inside the ' +
        'widget', function() {
          floaterManager.attachWidget(chartWidget);
          floaterManager.updateFloatersAfterColumnSplice(12, 3, true);
          expect(chartWidget.x()).toBe(10);
          expect(chartWidget.colSpan()).toBe(7);
        });

    it('should not move merged cell widget if cols deleted after the widget',
       function() {
         floaterManager.attachWidget(chartWidget);
         floaterManager.updateFloatersAfterColumnSplice(22, 3, true);
         expect(chartWidget.x()).toBe(10);
         expect(chartWidget.colSpan()).toBe(10);
       });*/
  });
});
