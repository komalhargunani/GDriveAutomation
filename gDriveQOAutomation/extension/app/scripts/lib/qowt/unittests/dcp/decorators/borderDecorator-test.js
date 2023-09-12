/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit tests for border decorator.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/dcp/decorators/borderDecorator',
  'qowtRoot/utils/stringUtils'
], function(
    BorderDecorator,
    StringUtils) {

  'use strict';

  describe('border decorator tests', function() {
    var _domNode;

    beforeEach(function() {
      _domNode = document.createElement('DIV');
    });

    afterEach(function() {
      _domNode = undefined;
    });

    function _verifyNoBorders(side) {
      var checkSides = ['top', 'right', 'bottom', 'left'];
      if (side !== '*') {
        checkSides = side;
      }

      checkSides.forEach(function(side) {
        expect(_domNode.style[(
            'border' + StringUtils.titleCase(side) + 'Style')]).toBe('');
        expect(_domNode.style[(
            'border' + StringUtils.titleCase(side) + 'Width')]).toBe('');
        expect(_domNode.style[(
            'border' + StringUtils.titleCase(side) + 'Color')]).toBe('');
      });
    }

    function _verifyBorder(side, border) {
      var style =  border.style || '';
      var width = border.width || '';
      var color = border.color || '';

      expect(_domNode.style[(
          'border' + StringUtils.titleCase(side) + 'Style')]).toBe(style);
      expect(_domNode.style[(
          'border' + StringUtils.titleCase(side) + 'Width')]).toBe(width);
      expect(_domNode.style[(
          'border' + StringUtils.titleCase(side) + 'Color')]).toBe(color);
    }

    function verifyReturnedSizes(expected, actual) {
      for (var key in expected) {
        expect(actual[key]).toBe(expected[key]);
      }
    }

    it('should throw for invalid element node', function() {
      var elm;
      expect(function() {
        BorderDecorator.decorate({
          elm: elm
        });
      }).toThrow();

      expect(function() {
        BorderDecorator.decorate(elm);
      }).toThrow();
    });

    it('should ignore dcp that contains no border information', function() {
      var borders;
      var actualBorderSizes = BorderDecorator.decorate(_domNode, borders);

      _verifyNoBorders('*');
      var expectedBorderSizes = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
      verifyReturnedSizes(expectedBorderSizes, actualBorderSizes);
    });

    it('should ignore dcp that contains empty border information', function() {
      // Empty borders object.
      var borders = {};
      var expectedBorderSizes = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
      var actualBorderSizes = BorderDecorator.decorate(_domNode, borders);
      _verifyNoBorders('*');
      verifyReturnedSizes(expectedBorderSizes, actualBorderSizes);
    });

    it('should ignore dcp that contains invalid border side', function() {
      BorderDecorator.decorate(
          _domNode,
          {borders: {badSide: {color: 'red'}}}
          );
      _verifyNoBorders('*');
      expect(_domNode.style['border-' + 'badSide' + '-color']).toBeUndefined();
    });

    it('should ignore dcp that contains no border side', function() {
      BorderDecorator.decorate(
          _domNode,
          {borders: {}}
          );
      _verifyNoBorders('*');
    });

    it('should set top border style if present in border object', function() {
      var borderTop = {style: 'solid'};
      BorderDecorator.decorate(
          _domNode,
          {top: borderTop}
          );
      _verifyBorder('top', borderTop);
      _verifyNoBorders(['left', 'right', 'bottom']);
    });

    it('should set top border color if present in border object', function() {
      var borderTop = {color: 'red'};
      BorderDecorator.decorate(
          _domNode,
          {top: borderTop}
          );
      _verifyBorder('top', borderTop);
      _verifyNoBorders(['left', 'right', 'bottom']);
    });

    it('should set top border color = auto', function() {
      var borderTop = {color: 'auto'};
      BorderDecorator.decorate(
          _domNode,
          {top: borderTop}
          );
      // Border color will be set to black.
      var expectedBorderTop = {color: 'rgb(0, 0, 0)'};
      _verifyBorder('top', expectedBorderTop);
      _verifyNoBorders(['left', 'right', 'bottom']);
    });

    it('should set top border width if present in border object', function() {
      var borderTop = {width: 10};
      BorderDecorator.decorate(
          _domNode,
          {top: borderTop}
          );
      // Border Width values are in 1/8 pt.
      borderTop.width = '1.25pt';
      _verifyBorder('top', borderTop);
      _verifyNoBorders(['left', 'right', 'bottom']);
    });

    it('should set top border width < 1 pt if present in border', function() {
      var borderTop = {width: 5};
      var actualBorderSizes = BorderDecorator.decorate(
          _domNode,
          {top: borderTop});
      // Border Width values are in 1/8 pt,
      // should finally get a value of 1pt.
      borderTop.width = '1pt';
      _verifyBorder('top', borderTop);
      _verifyNoBorders(['left', 'right', 'bottom']);

      var expectdBorderSizes = {
        left: 0,
        right: 0,
        top: 1,
        bottom: 0
      };
     verifyReturnedSizes(expectdBorderSizes, actualBorderSizes);
    });

    it('should undecorate borders', function() {
      var borderLeft = {
        width: 32,
        color: 'yellow',
        style: 'double'
      };
      BorderDecorator.decorate(
          _domNode,
          {left: borderLeft}
          );
      borderLeft.width = '4pt';
      _verifyBorder('left', borderLeft);
      _verifyNoBorders(['top', 'right', 'bottom']);

      BorderDecorator.undecorate(_domNode, 'left');
      _verifyNoBorders('*');
    });

    it('should set all borders if present in border object', function() {
      var borderTop = {
        width: 8, color: 'red', style: 'dashed'
      };
      var borderRight = {
        width: 16, color: 'blue', style: 'solid'
      };
      var borderBottom = {
        width: 24, color: 'green', style: 'dotted'
      };
      var borderLeft = {
        width: 32, color: 'yellow', style: 'double'
      };
      var borders = {
        top: borderTop,
        right: borderRight,
        bottom: borderBottom,
        left: borderLeft
      };
      var actualBorderSizes = BorderDecorator.decorate(
          _domNode, borders);
      // Border Width values are in 1/8 pt.
      borderTop.width = '1pt';
      borderRight.width= '2pt';
      borderBottom.width = '3pt';
      borderLeft.width = '4pt';

      _verifyBorder('top', borderTop);
      _verifyBorder('right', borderRight);
      _verifyBorder('bottom', borderBottom);
      _verifyBorder('left', borderLeft);

      var expectdBorderSizes = {
        top: 1,
        right: 2,
        bottom: 3,
        left: 4
      };

      verifyReturnedSizes(expectdBorderSizes, actualBorderSizes);
    });
  });
});
