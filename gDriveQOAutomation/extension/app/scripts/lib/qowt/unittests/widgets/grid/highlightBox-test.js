/**
 * Highlight box tests
 */

define([
  'qowtRoot/widgets/grid/highlightBox',
  'qowtRoot/variants/configs/sheet'

], function(
    HighlightBox,
    SheetConfig) {

  'use strict';

  describe('The sheet highlight box', function() {

    var _kHighlight_Box_ClassName = 'qowt-highlight-box';

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('should have a node with the specified border color after it has been ' +
        'created', function() {
          var idx = 0;
          var color = 'rgb(204, 51, 51)';
          var box = HighlightBox.create(idx, color);
          var rootNode = document.createElement('div');
          box.appendTo(rootNode);

          expect(rootNode.childNodes.length).toBe(1);
          expect(rootNode.childNodes[0].className).toBe(
              _kHighlight_Box_ClassName);
          expect(rootNode.childNodes[0].style.borderColor).toBe(color);
        });

    it('should have a positionNode() method which sets the position and ' +
        'dimensions of the highlight box', function() {
          var idx = 0;
          var color = 'rgb(204, 51, 51)';
          var box = HighlightBox.create(idx, color);
          var rootNode = document.createElement('div');
          box.appendTo(rootNode);

          var rect = {
            topPos: 867,
            leftPos: 255,
            height: 30,
            width: 180
          };

          box.positionNode(rect);

          expect(rootNode.childNodes[0].style.top).toBe(rect.topPos + 'px');
          expect(rootNode.childNodes[0].style.left).toBe(rect.leftPos + 'px');
          expect(rootNode.childNodes[0].style.height).toBe(rect.height +
              SheetConfig.kGRID_GRIDLINE_WIDTH + 'px');
          expect(rootNode.childNodes[0].style.width).toBe(rect.width +
              SheetConfig.kGRID_GRIDLINE_WIDTH + 'px');
        });
  });
});

