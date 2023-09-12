/*
 * Floater image test
 */

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/widgets/grid/floaterImage',
  'qowtRoot/fixtures/sheet/sheetImageFixture'
], function(UnittestUtils, SheetFloaterImage, ImageFixture) {

  'use strict';

  describe('sheet floater image widget', function() {
    var rootNode, testAppendArea;

    beforeEach(function() {
      testAppendArea = UnittestUtils.createTestAppendArea();
      rootNode = document.createElement('div');
      testAppendArea.appendChild(rootNode);
    });

    afterEach(function() {
      testAppendArea.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should clone image widget correctly', function() {
      var childNode = document.createElement('div');
      var clonedNode = document.createElement('div');
      var parentNode = document.createElement('div');
      testAppendArea.appendChild(clonedNode);
      testAppendArea.appendChild(parentNode);

      var config = ImageFixture.twoCellAnchorResponse();
      config.parentNode = parentNode;

      var imageWidget = SheetFloaterImage.create(config);
      imageWidget.appendChild(childNode);
      imageWidget.updatePositionAndDimensions(0, 0, 50, 50);
      expect(imageWidget.getAnchorType()).toBe('two');
      expect(imageWidget.getNode()).toBe(childNode);

      var clonedWidget = imageWidget.cloneTo(clonedNode);
      expect(clonedWidget.getAnchorType()).toBe(imageWidget.getAnchorType());
      expect(clonedWidget.getRect()).toEqual(imageWidget.getRect());
      expect(clonedWidget.getImageId()).toBe(imageWidget.getImageId());
      expect(clonedWidget.getNode()).toBeDefined();

      testAppendArea.removeChild(clonedNode);
      testAppendArea.removeChild(parentNode);
      childNode = undefined;
      clonedNode = undefined;
      parentNode = undefined;
    });

    it('should return correct type of anchor', function() {
      var imageWidget = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(imageWidget.getAnchorType()).toBe('two');

      imageWidget = SheetFloaterImage.create(ImageFixture.
          oneCellAnchorResponse());
      expect(imageWidget.getAnchorType()).toBe('one');
      imageWidget = SheetFloaterImage.create(ImageFixture.
          absCellAnchorResponse());
      expect(imageWidget.getAnchorType()).toBe('abs');

    });

    it('should return correct the anchor cell', function() {
      var imageWidget = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(imageWidget.x()).toBe(7);
      expect(imageWidget.y()).toBe(2);

      imageWidget = SheetFloaterImage.create(ImageFixture.
          oneCellAnchorResponse());
      expect(imageWidget.x()).toBe(2);
      expect(imageWidget.y()).toBe(5);
    });

    it('should return the row span of the image', function() {
      var imageWidget = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(imageWidget.rowSpan()).toBe(27);
    });

    it('should return the column span of the image', function() {
      var imageWidget = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(imageWidget.colSpan()).toBe(-2);
    });

    it('should return the row and column offsets', function() {
      var imageWidget = SheetFloaterImage.create(ImageFixture.
          absCellAnchorResponse());
      var offsets = imageWidget.getOffsets();
      expect(offsets.topLeftXOffset).toBeCloseTo(242.667);
      expect(offsets.topLeftYOffset).toBeCloseTo(181.6);
      expect(offsets.bottomRightXOffset).toBeCloseTo(426.667);
      expect(offsets.bottomRightYOffset).toBeCloseTo(283.733);
    });

    it('should return the image ID', function() {
      var imageWidget = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(imageWidget.getImageId()).toBe('221');
      imageWidget = SheetFloaterImage.create(ImageFixture.
          oneCellAnchorResponse());
      expect(imageWidget.getImageId()).toBe('222');
      imageWidget = SheetFloaterImage.create(ImageFixture.
          absCellAnchorResponse());
      expect(imageWidget.getImageId()).toBe('223');
    });

    it('should not match against undefined or null', function() {
      var imageWidget = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(imageWidget.isMatchingFloater(undefined)).toBe(false);
      expect(imageWidget.isMatchingFloater(null)).toBe(false);
    });

    it('should not match against Image Floater', function() {
      var imageWidgetTwo = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(imageWidgetTwo.isMatchingFloater(imageWidgetTwo)).toBe(true);

      var imageWidgetOne = SheetFloaterImage.create(ImageFixture.
          oneCellAnchorResponse());
      expect(imageWidgetOne.isMatchingFloater(imageWidgetOne)).toBe(true);

      var imageWidgetAbs = SheetFloaterImage.create(ImageFixture.
          absCellAnchorResponse());
      expect(imageWidgetAbs.isMatchingFloater(imageWidgetAbs)).toBe(true);
    });

    it('should NOT request to be selected', function() {
      var imageWidget = SheetFloaterImage.create(ImageFixture.
          oneCellAnchorResponse());
      expect(imageWidget.isSelectable()).toBe(false);
    });

    it('should return the correct fromColOffset', function() {
      var imageWidgetTwo = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(Math.round(imageWidgetTwo.getFromColOffset())).toBe(16);

      var imageWidgetOne = SheetFloaterImage.create(ImageFixture.
          oneCellAnchorResponse());
      expect(Math.round(imageWidgetOne.getFromColOffset())).toBe(52);
    });

    it('should return the correct fromRowOffset', function() {
      var imageWidgetTwo = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(Math.round(imageWidgetTwo.getFromRowOffset())).toBe(1);

      var imageWidgetOne = SheetFloaterImage.create(ImageFixture.
          oneCellAnchorResponse());
      expect(Math.round(imageWidgetOne.getFromRowOffset())).toBe(0);
    });

    it('should return the correct toColOffset', function() {
      var imageWidgetTwo = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(Math.round(imageWidgetTwo.getToColOffset())).toBe(96);
    });

    it('should return the correct toRowOffset', function() {
      var imageWidgetTwo = SheetFloaterImage.create(ImageFixture.
          twoCellAnchorResponse());
      expect(Math.round(imageWidgetTwo.getToRowOffset())).toBe(9);
    });
  });
});
