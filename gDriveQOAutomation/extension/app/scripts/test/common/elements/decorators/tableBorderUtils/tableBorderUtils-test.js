define([
  'common/mixins/decorators/tableBorderUtils'
], function(
    TableBorderUtils) {

  'use strict';

  describe('TableBorderUtils Module', function() {

    it('should return right cssText for each table border side', function() {
      var sides = ['top', 'right', 'bottom', 'left',
                   'insideHorizontal', 'insideVertical'];
      var border = {
        width: 8,
        color: 'yellow',
        style: 'solid'
      };
      sides.forEach(function(side) {
        var cssText = TableBorderUtils.cssText(side, border);
        matchCssText(side, cssText);
      });
    });

    it('should validate table border side', function() {
      assert.isFalse(
          TableBorderUtils.isValidSide('bad'), 'should be false');

      var sides = ['top', 'right', 'bottom', 'left',
                   'insideHorizontal', 'insideVertical'];
      sides.forEach(function(side) {
        assert.isTrue(
            TableBorderUtils.isValidSide(side), 'should be valid');
      });
    });

    function matchCssText(side, cssText) {
      if (side === 'insideHorizontal') {
        side = 'bottom';
      } else if (side === 'insideVertical') {
        side = 'right';
      }
      var expectedCssText = 'border-' + side + ': 1pt solid yellow;';
      assert.equal(cssText, expectedCssText, 'cssText should match');
    }

  });
});
