/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview mocha based unit test for the BorderUtils module
 *
 * @author ghyde@google.com (Greg Hyde)
 */

define([
  'common/mixins/decorators/borderUtils',
  'qowtRoot/utils/stringUtils'
  ], function(
    BorderUtils,
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

    it('should not throw for invalid element node', function() {
      assert.doesNotThrow(function() {
        BorderUtils.setBorderSide(undefined, 'top', {});
      });

      assert.doesNotThrow(function() {
        BorderUtils.setBorderSide(_domNode, 'top', undefined);
      });

      assert.doesNotThrow(function() {
        BorderUtils.setBorderSide(_domNode, undefined, {});
      });
    });

    it('should ignore dcp that contains no border information', function() {
      var borders;
      BorderUtils.setBorderSide(_domNode, 'top', borders);
      BorderUtils.setBorderSide(_domNode, 'bottom', borders);
      BorderUtils.setBorderSide(_domNode, 'left', borders);
      BorderUtils.setBorderSide(_domNode, 'right', borders);

      verifyNoBorders_('*');
    });

    it('should ignore dcp that contains empty border information', function() {
      // Empty borders object.
      var borders = {};
      BorderUtils.setBorderSide(_domNode, 'top', borders);
      BorderUtils.setBorderSide(_domNode, 'bottom', borders);
      BorderUtils.setBorderSide(_domNode, 'left', borders);
      BorderUtils.setBorderSide(_domNode, 'right', borders);
      verifyNoBorders_('*');
    });

    it('should ignore dcp that contains invalid border side', function() {
      BorderUtils.setBorderSide(_domNode, 'badSide', {color: 'red'});
      verifyNoBorders_('*');
      assert.strictEqual(_domNode.style['border-' + 'badSide' + '-color'],
          undefined);
    });

    it('should set border style if present in border object', function() {
      var borderTop = {style: 'solid'};
      BorderUtils.setBorderSide(_domNode, 'top', borderTop);
      verifyBorder_('top', borderTop);
      verifyNoBorders_(['left', 'right', 'bottom']);
    });

    it('should set border color if present in border object', function() {
      var borderRight = {color: 'red'};
      BorderUtils.setBorderSide(_domNode, 'right', borderRight);
      verifyBorder_('right', borderRight);
      verifyNoBorders_(['left', 'top', 'bottom']);
    });

    it('should set left border color = auto', function() {
      var borderLeft = {color: 'auto'};
      BorderUtils.setBorderSide(_domNode, 'left', borderLeft);
      // Border color will be set to black.
      var expectedBorderLeft = {color: 'rgb(0, 0, 0)'};
      verifyBorder_('left', expectedBorderLeft);
      verifyNoBorders_(['top', 'right', 'bottom']);
    });

    it('should set bottom border width if present in border object',
        function() {
      var borderBottom = {width: 10, style: 'solid'};
      BorderUtils.setBorderSide(_domNode, 'bottom', borderBottom);
      // Border Width values are in 1/8 pt.
      borderBottom.width = '1.25pt';
      verifyBorder_('bottom', borderBottom);
      verifyNoBorders_(['left', 'right', 'top']);
    });

    it('should set top border width < 1 pt if present in border', function() {
      var borderTop = {width: 5, style: 'solid'};
      BorderUtils.setBorderSide(_domNode, 'top', borderTop);

      // Border Width values are in 1/8 pt,
      // should finally get a value of 1pt.
      borderTop.width = '1pt';
      verifyBorder_('top', borderTop);
      verifyNoBorders_(['left', 'right', 'bottom']);
    });

    it('should set top border width < 3 pt if style is double', function() {
      var borderTop = {width: 16, style: 'double'};
      BorderUtils.setBorderSide(_domNode, 'top', borderTop);

      // Border Width values are in 1/8 pt,
      // should finally get a value of 3pt.
      borderTop.width = '3pt';
      verifyBorder_('top', borderTop);
      verifyNoBorders_(['left', 'right', 'bottom']);
    });

    it('should set all borders if they are different', function() {
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
      BorderUtils.setBorderSide(_domNode, 'top', borderTop);
      BorderUtils.setBorderSide(_domNode, 'bottom', borderBottom);
      BorderUtils.setBorderSide(_domNode, 'left', borderLeft);
      BorderUtils.setBorderSide(_domNode, 'right', borderRight);

      // Border Width values are in 1/8 pt.
      borderTop.width = '1pt';
      borderRight.width = '2pt';
      borderBottom.width = '3pt';
      borderLeft.width = '4pt';

      verifyBorder_('top', borderTop);
      verifyBorder_('right', borderRight);
      verifyBorder_('bottom', borderBottom);
      verifyBorder_('left', borderLeft);
    });

    it('should set to no borders if border = nil', function() {
      var borderTop = {style: 'nil'};
      BorderUtils.setBorderSide(_domNode, 'top', borderTop);
      verifyBorder_('top', borderTop);
      verifyNoBorders_(['left', 'right', 'bottom']);
    });

    it('should set to border width = 0', function() {
      var borderTop = {
        style: 'solid',
        width: 0,
        color: 'blue'
      };
      BorderUtils.setBorderSide(_domNode, 'top', borderTop);
      borderTop.width = '0pt';
      verifyBorder_('top', borderTop);
    });

    it('should set all border sides', function() {
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
      BorderUtils.setBorders(_domNode, borders);


      // Border Width values are in 1/8 pt.
      borderTop.width = '1pt';
      borderRight.width= '2pt';
      borderBottom.width = '3pt';
      borderLeft.width = '4pt';

      verifyBorder_('top', borderTop);
      verifyBorder_('right', borderRight);
      verifyBorder_('bottom', borderBottom);
      verifyBorder_('left', borderLeft);
    });


    it('should unset the borders', function() {
      var borderLeft = {
        width: 32, color: 'yellow', style: 'double'
      };
      var borders = {left: borderLeft};
      BorderUtils.setBorders(_domNode, borders);

      // Border Width values are in 1/8 pt.
      borderLeft.width = '4pt';
      verifyBorder_('left', borderLeft);
      verifyNoBorders_(['top', 'right', 'bottom']);

      BorderUtils.unsetBorders(_domNode);
      verifyNoBorders_('*');

    });


    function verifyNoBordersForSide_(side) {
      assert.strictEqual(_domNode.style[(
          'border' + StringUtils.titleCase(side) + 'Style')], undefined);
      assert.strictEqual(_domNode.style[(
          'border' + StringUtils.titleCase(side) + 'Width')], undefined);
      assert.strictEqual(_domNode.style[(
          'border' + StringUtils.titleCase(side) + 'Color')], undefined);
    }

    function verifyNoBorders_(sides) {
      if (sides === '*') {
        sides = ['top', 'bottom', 'left', 'right'];
      }
      var side;
      for (side in sides) {
        verifyNoBordersForSide_(side);
      }
    }

    function verifyBorder_(side, border) {
      var style =  border.style || '';
      var width = border.width || '';
      var color = border.color || '';

      if (border.style === 'nil') {
        // There are no borders set.
        assert.strictEqual(_domNode.style[(
            'border' + StringUtils.titleCase(side) + 'Style')], 'none');
      } else {
        assert.strictEqual(_domNode.style[(
            'border' + StringUtils.titleCase(side) + 'Style')], style);
        assert.strictEqual(_domNode.style[(
            'border' + StringUtils.titleCase(side) + 'Width')], width);
        assert.strictEqual(_domNode.style[(
            'border' + StringUtils.titleCase(side) + 'Color')], color);
      }
    }
  });
});
