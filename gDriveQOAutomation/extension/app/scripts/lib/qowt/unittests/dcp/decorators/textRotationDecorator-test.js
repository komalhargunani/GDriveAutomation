// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit test case for CellTextRotationDecorator
 *
 * @author yuvraj.patel@synerzip.com (Yuvraj Patel)
 */

define([
  'qowtRoot/dcp/decorators/textRotationDecorator',
  'qowtRoot/variants/configs/sheet'
], function(TextRotationDecorator,
            SheetConfig) {

  'use strict';

  describe('dcp/decorators/textRotationDecorator ', function() {
    var _domNode;
    var scale = SheetConfig.ZOOM.levels[SheetConfig.ZOOM.current];

    beforeEach(function() {
      _domNode = document.createElement('DIV');
    });

    afterEach(function() {
      _domNode = undefined;
    });

    it('should set rotation correctly with left top alignment', function() {
      var hAlignment = 'left',
          vAlignment = 'top',
          angle = 60;

      TextRotationDecorator.decorate(
          _domNode, hAlignment, vAlignment, angle, scale);

      expect(_domNode.style.webkitTransform).toBe('rotate(-60deg)');
      expect(_domNode.style.webkitTransformOriginX).toBe('0%');
      expect(_domNode.style.webkitTransformOriginY).toBe('0%');
    });

    it('should set rotation correctly with left center alignment', function() {
      var hAlignment = 'left',
          vAlignment = 'centre',
          angle = -30;

      TextRotationDecorator.decorate(
          _domNode, hAlignment, vAlignment, angle, scale);

      expect(_domNode.style.webkitTransform).toBe('rotate(30deg)');
      expect(_domNode.style.webkitTransformOriginX).toBe('50%');
      expect(_domNode.style.webkitTransformOriginY).toBe('50%');
    });

    it('should set rotation correctly with left bottom alignment', function() {
      var hAlignment = 'left',
          vAlignment = 'bottom',
          angle = 15;

      TextRotationDecorator.decorate(
          _domNode, hAlignment, vAlignment, angle, scale);

      expect(_domNode.style.webkitTransform).toBe('rotate(-15deg)');
      expect(_domNode.style.webkitTransformOriginX).toBe('0%');
      expect(_domNode.style.webkitTransformOriginY).toBe('100%');
    });

    it('should set rotation correctly with center top alignment', function() {
      var hAlignment = 'centre',
          vAlignment = 'top',
          angle = 30;

      TextRotationDecorator.decorate(
          _domNode, hAlignment, vAlignment, angle, scale);

      expect(_domNode.style.webkitTransform).toBe('rotate(-30deg)');
      expect(_domNode.style.webkitTransformOriginX).toBe('50%');
      expect(_domNode.style.webkitTransformOriginY).toBe('50%');
    });

    it('should set rotation correctly with center center alignment',
        function() {
          var hAlignment = 'centre',
              vAlignment = 'centre',
              angle = 45;

          TextRotationDecorator.decorate(
              _domNode, hAlignment, vAlignment, angle, scale);

          expect(_domNode.style.webkitTransform).toBe('rotate(-45deg)');
          expect(_domNode.style.webkitTransformOriginX).toBe('50%');
          expect(_domNode.style.webkitTransformOriginY).toBe('50%');
        });

    it('should set rotation correctly with center bottom alignment',
        function() {
          var hAlignment = 'centre',
              vAlignment = 'bottom',
              angle = -75;

          TextRotationDecorator.decorate(
              _domNode, hAlignment, vAlignment, angle, scale);

          expect(_domNode.style.webkitTransform).toBe('rotate(75deg)');
          expect(_domNode.style.webkitTransformOriginX).toBe('50%');
          expect(_domNode.style.webkitTransformOriginY).toBe('50%');
        });

    it('should set rotation correctly with right top alignment',
        function() {
          var hAlignment = 'right',
              vAlignment = 'top',
              angle = 90;

          TextRotationDecorator.decorate(
              _domNode, hAlignment, vAlignment, angle, scale);

          expect(_domNode.style.webkitTransform).toBe('rotate(-90deg)');
          expect(_domNode.style.webkitTransformOriginX).toBe('100%');
          expect(_domNode.style.webkitTransformOriginY).toBe('0%');
        });

    it('should set rotation correctly with right center alignment',
        function() {
          var hAlignment = 'right',
              vAlignment = 'centre',
              angle = -15;

          TextRotationDecorator.decorate(
              _domNode, hAlignment, vAlignment, angle, scale);

          expect(_domNode.style.webkitTransform).toBe('rotate(15deg)');
          expect(_domNode.style.webkitTransformOriginX).toBe('50%');
          expect(_domNode.style.webkitTransformOriginY).toBe('50%');
        });

    it('should set rotation correctly with right bottom alignment',
        function() {
          var hAlignment = 'right',
              vAlignment = 'bottom',
              angle = 30;

          TextRotationDecorator.decorate(
              _domNode, hAlignment, vAlignment, angle, scale);

          expect(_domNode.style.webkitTransform).toBe('rotate(-30deg)');
          expect(_domNode.style.webkitTransformOriginX).toBe('100%');
          expect(_domNode.style.webkitTransformOriginY).toBe('100%');
        });

    it('should not set rotation if angle is not in range of -90 to 90',
        function() {
          var hAlignment = 'right',
              vAlignment = 'bottom',
              angle = 135;

          TextRotationDecorator.decorate(
              _domNode, hAlignment, vAlignment, angle, scale);

          expect(_domNode.style.webkitTransform).toBe('');
          expect(_domNode.style.webkitTransformOriginX).toBe('');
          expect(_domNode.style.webkitTransformOriginY).toBe('');
        });
  });
});
