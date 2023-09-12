define([
  'qowtRoot/dcp/decorators/tableCellTextStyleDecorator',
  'qowtRoot/dcp/pointHandlers/textSpacingHandler',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/utils/fontManager',
  'qowtRoot/drawing/theme/themeStyleRefManager'
], function(
    CellTextStyleDecorator,
    TextSpacingHandler,
    ColorUtility,
    Fonts,
    ThemeStyleRefManager) {
  'use strict';

  describe('Point: "tableCellTextStyle" Decorator', function() {
    var fontFamily_ = "Calibri, \'Footlight MT Light\'";

    beforeEach(function() {

      sinon.stub(ColorUtility, 'getColor', function(color) {
        var computed;
        if (color && color.type === 'schemeClr' && color.scheme === 'dk1') {
          computed = '#111111';
        }
        return computed;
      });

      sinon.stub(TextSpacingHandler, 'getLineSpacing').returns('120%');
      sinon.stub(Fonts, 'family').returns(fontFamily_);
      sinon.stub(ThemeStyleRefManager, 'getResolvedFontRefStyle',
          function (style) {
            if (style && style.fontRef && style.fontRef.idx === 'minor') {
              return { font: 'Calibri' };
            }
            return undefined;
          });
    });

    afterEach(function() {
      TextSpacingHandler.getLineSpacing.restore();
      ColorUtility.getColor.restore();
      Fonts.family.restore();
      ThemeStyleRefManager.getResolvedFontRefStyle.restore();
    });

    it('should style cell correctly', function() {
      var textStyle = {
        'color': {
          'scheme': 'dk1',
          'type': 'schemeClr'
        },
        'fontRef': {
          'idx': 'minor'
        }
      };

      var elm = document.createElement('div');

      CellTextStyleDecorator.decorate(elm, textStyle);

      assert.isDefined(elm && elm.style);
      assert.strictEqual(elm.style.color, 'rgb(17, 17, 17)', 'Invalid color.');
      assert.strictEqual(elm.style.lineHeight, '120%', 'Invalid line height.');
      assert.strictEqual(getStrWithoutQuotes_(elm.style.fontFamily),
          getStrWithoutQuotes_(fontFamily_), 'Invalid font.');
    });
  });

  function getStrWithoutQuotes_(str) {
    // remove single quote and double quote.
    return str.replace(/'|"/g, '');
  }
});

