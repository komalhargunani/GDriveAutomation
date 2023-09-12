// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for overlay.js
 *
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */
define([
  'qowtRoot/widgets/point/overlay',
  'qowtRoot/unittests/__unittest-util'
], function(
    OverlayWidget,
    UnittestUtils) {

  'use strict';

  describe('Point overlay widget', function() {
    var _shapeNode;
    var _shapeWidget;
    var _overlayWidget;

    beforeEach(function() {
      // Mock shape widget
      _shapeNode = UnittestUtils.createTestAppendArea();
      _shapeWidget = {
          getWidgetElement: function() { return _shapeNode; },
          getRotationAngle: function() {},
          isFlippedHorizontal: function() {},
          isFlippedVertical: function() {}
      };

      // Common code to all test cases
      _overlayWidget = OverlayWidget.create({});
    });

    afterEach(function() {
      UnittestUtils.removeTestAppendArea();
      _shapeNode = undefined;
      _shapeWidget = undefined;
      _overlayWidget = undefined;
    });


    it('should create overlay div', function() {
      var overlayNode = _overlayWidget.getWidgetElement();
      expect(overlayNode.classList.contains('qowt-point-overlay')).toBe(true);
      expect(overlayNode.getAttribute('qowt-divType')).toEqual('overlay');
    });

    it('should hide overlay div on setVisible false', function() {
      var overlayNode = _overlayWidget.getWidgetElement();
      _overlayWidget.setVisible(false);
      expect(overlayNode.style.display).toEqual('none');
      expect(overlayNode.style.zIndex).toEqual('-11');
    });

    it('should show overlay div on setVisible true', function() {
      var overlayNode = _overlayWidget.getWidgetElement();
      _overlayWidget.setVisible(true);
      expect(overlayNode.style.display).toEqual('block');
      expect(overlayNode.style.zIndex).toEqual('1');

    });

    it('should set the display style of actual node to the ghost shape',
        function() {
      _shapeNode.style.display = '-webkit-box';

      _overlayWidget.update(_shapeWidget);
      _overlayWidget.moveDragImage(_shapeWidget,100, 100);
      var overlayNode = _overlayWidget.getWidgetElement();
      expect(overlayNode.childNodes[0].style.display).toEqual('-webkit-box');
    });

    it('should add class "ghostShape" to ghost shape node', function() {
      var canvasElement = document.createElement('canvas');
      _shapeNode.appendChild(canvasElement);
      _shapeNode.setAttribute('qowt-divtype', 'shape');

      _overlayWidget.update(_shapeWidget);

      var overlayNode = _overlayWidget.getWidgetElement();
      var shapeGhostNode = overlayNode.firstChild;

      expect(shapeGhostNode.classList.contains('shapeGhost')).toBe(true);
    });

    it('should set adjusted offsets to overlay for rotated shapes while ' +
        'dragging', function() {
      var canvasElement = document.createElement('canvas');
      _shapeNode.appendChild(canvasElement);
      _shapeNode.setAttribute('qowt-divtype', 'shape');
      _shapeNode.style['-webkit-transform'] = 'rotate(30deg)';


      spyOn(_shapeWidget, 'getRotationAngle').andReturn(30);

      _overlayWidget.update(_shapeWidget);
      _overlayWidget.moveDragImage(_shapeWidget, 100, 100);
      var overlayNode = _overlayWidget.getWidgetElement();
      var shapeGhostNode = overlayNode.firstChild;
      expect(parseFloat(shapeGhostNode.style.left)).toEqual(136.6);
      expect(parseFloat(shapeGhostNode.style.top)).toEqual(36.6);
    });

    it('should set adjusted offsets to overlay for horizontally flipped' +
        ' shapes while dragging', function() {
          var canvasElement = document.createElement('canvas');
          _shapeNode.appendChild(canvasElement);
          _shapeNode.setAttribute('qowt-divtype', 'shape');
          _shapeNode.style['-webkit-transform'] = 'scale(-1, 1)';

          spyOn(_shapeWidget, 'isFlippedHorizontal').andReturn(true);

          _overlayWidget.update(_shapeWidget);
          _overlayWidget.moveDragImage(_shapeWidget, 100, 100);
          var overlayNode = _overlayWidget.getWidgetElement();
          var shapeGhostNode = overlayNode.firstChild;
          expect(parseFloat(shapeGhostNode.style.left)).toEqual(-100);
          expect(parseFloat(shapeGhostNode.style.top)).toEqual(100);
        });

    it('should set adjusted offsets to overlay for vertically flipped' +
        ' shapes while dragging', function() {
          var canvasElement = document.createElement('canvas');
          _shapeNode.appendChild(canvasElement);
          _shapeNode.setAttribute('qowt-divtype', 'shape');
          _shapeNode.style['-webkit-transform'] = 'scale(1, -1)';

          spyOn(_shapeWidget, 'isFlippedVertical').andReturn(true);

          _overlayWidget.update(_shapeWidget);
          _overlayWidget.moveDragImage(_shapeWidget, 100, 100);
          var overlayNode = _overlayWidget.getWidgetElement();
          var shapeGhostNode = overlayNode.firstChild;
          expect(parseFloat(shapeGhostNode.style.left)).toEqual(100);
          expect(parseFloat(shapeGhostNode.style.top)).toEqual(-100);
        });

    it('should set adjusted offsets to overlay for shapes having rotation as ' +
        'well as horizontal flip while dragging', function() {
          var canvasElement = document.createElement('canvas');
          _shapeNode.appendChild(canvasElement);
          _shapeNode.setAttribute('qowt-divtype', 'shape');
          _shapeNode.style['-webkit-transform'] = 'rotate(30deg) scale(-1, 1)';

          spyOn(_shapeWidget, 'getRotationAngle').andReturn(30);
          spyOn(_shapeWidget, 'isFlippedHorizontal').andReturn(true);

          _overlayWidget.update(_shapeWidget);
          _overlayWidget.moveDragImage(_shapeWidget, 100, 100);
          var overlayNode = _overlayWidget.getWidgetElement();
          var shapeGhostNode = overlayNode.firstChild;
          expect(parseFloat(shapeGhostNode.style.left)).toEqual(-136.6);
          expect(parseFloat(shapeGhostNode.style.top)).toEqual(36.6);
        });

    it('should set adjusted offsets to overlay for shapes having rotation as ' +
        'well as vertical flip while dragging', function() {
          var canvasElement = document.createElement('canvas');
          _shapeNode.appendChild(canvasElement);
          _shapeNode.setAttribute('qowt-divtype', 'shape');
          _shapeNode.style['-webkit-transform'] = 'rotate(30deg) scale(1, -1)';

          spyOn(_shapeWidget, 'getRotationAngle').andReturn(30);
          spyOn(_shapeWidget, 'isFlippedVertical').andReturn(true);

          _overlayWidget.update(_shapeWidget);
          _overlayWidget.moveDragImage(_shapeWidget, 100, 100);
          var overlayNode = _overlayWidget.getWidgetElement();
          var shapeGhostNode = overlayNode.firstChild;
          expect(parseFloat(shapeGhostNode.style.left)).toEqual(136.6);
          expect(parseFloat(shapeGhostNode.style.top)).toEqual(-36.6);
        });

    it('should set correct flip property to overlay for flipped shapes while ' +
        'dragging', function() {
      var canvasElement = document.createElement('canvas');
      _shapeNode.appendChild(canvasElement);
      _shapeNode.setAttribute('qowt-divtype', 'shape');
      _shapeNode.style['-webkit-transform'] = 'scale(-1, -1)';

      spyOn(_shapeWidget, 'isFlippedHorizontal').andReturn(true);
      spyOn(_shapeWidget, 'isFlippedVertical').andReturn(true);

      _overlayWidget.update(_shapeWidget);
      _overlayWidget.moveDragImage(_shapeWidget, 100, 100);
      var overlayNode = _overlayWidget.getWidgetElement();
      var shapeGhostNode = overlayNode.firstChild;

      expect(shapeGhostNode.style['-webkit-transform']).toEqual('none');
    });
  });
});
