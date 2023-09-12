// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Selection Box unit test suite.
 */

define([
  'qowtRoot/widgets/grid/selectionBox'
], function(
    SelectionBox) {

  'use strict';

  describe('The sheet selection box', function() {

    var _kAnchor_Node_Normal_ClassName = 'qowt-selection-anchor-node-normal',
        _kRange_Node_ClassName = 'qowt-selection-range-node';

    it('should have two nodes after it has been created', function() {
      var box = SelectionBox.create();
      var rootNode = document.createElement('div');
      box.appendTo(rootNode);

      expect(rootNode.childNodes.length).toBe(2);
      expect(rootNode.childNodes[0].className).toBe(
          _kAnchor_Node_Normal_ClassName);
      expect(rootNode.childNodes[1].className).toBe(
          _kRange_Node_ClassName);
    });

    it("should have its anchor and range node positioned 'off-pane' " +
        'after it has been created', function() {
          var box = SelectionBox.create();
          var rootNode = document.createElement('div');
          box.appendTo(rootNode);

          var anchorNode = rootNode.childNodes[0];
          expect(parseInt(anchorNode.style.top, 10)).toBeLessThan(0);
          expect(parseInt(anchorNode.style.left, 10)).toBeLessThan(0);

          var rangeNode = rootNode.childNodes[1];
          expect(parseInt(rangeNode.style.top, 10)).toBeLessThan(0);
          expect(parseInt(rangeNode.style.left, 10)).toBeLessThan(0);
        });

    it("should be able to set the anchor node's position and " +
        'dimensions', function() {
          var box = SelectionBox.create();
          var rootNode = document.createElement('div');
          box.appendTo(rootNode);

          box.setAnchorNodeTopPosition(15);
          box.setAnchorNodeLeftPosition(128);
          box.setAnchorNodeWidth(200);
          box.setAnchorNodeHeight(350);

          var anchorNode = rootNode.childNodes[0];
          expect(anchorNode.style.top).toBe('15px');
          expect(anchorNode.style.left).toBe('128px');
          expect(anchorNode.style.width).toBe('200px');
          expect(anchorNode.style.height).toBe('350px');
        });

    it("should be able to set the range node's position and " +
        'dimensions', function() {
          var box = SelectionBox.create();
          var rootNode = document.createElement('div');
          box.appendTo(rootNode);

          box.setRangeNodeTopPosition(333);
          box.setRangeNodeLeftPosition(42);
          box.setRangeNodeWidth(256);
          box.setRangeNodeHeight(173);

          var rangeNode = rootNode.childNodes[1];
          expect(rangeNode.style.top).toBe('333px');
          expect(rangeNode.style.left).toBe('42px');
          expect(rangeNode.style.width).toBe('256px');
          expect(rangeNode.style.height).toBe('173px');
        });
  });
});
