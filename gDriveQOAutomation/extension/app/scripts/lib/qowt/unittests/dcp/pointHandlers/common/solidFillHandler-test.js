/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/pointHandlers/common/solidFillHandler',
  'qowtRoot/drawing/color/colorUtility',
  'qowtRoot/drawing/theme/themeManager'
], function(SolidFillHandler, ColorUtility, ThemeManager) {

  'use strict';

  describe('Solid Fill handler test', function() {
    var _solidFillHandler;
    var _colorUtility = ColorUtility;
    var _themeManager = ThemeManager;


    beforeEach(function() {
      _solidFillHandler = SolidFillHandler;
    });

    describe(' fill canvas context', function() {
      var _context;

      beforeEach(function() {
        _context = {
          fillStyle: '',
          fill: function() {
          }
        };
      });

      it('should handle scheme colors properly for canvas shapes', function() {
        var fill =
            {
              type: 'solidFill',
              color: {
                type: 'schemeClr',
                scheme: 'accent1',
                effects: {}
              }
            };

        spyOn(_colorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
            '#FFFFFF');

        _solidFillHandler.fillCanvasContext(_context, fill, 'none');

        expect(_colorUtility.getHexEquivalentOfSchemeColor)
            .toHaveBeenCalledWith(fill.color.scheme);
      });

      it('should use default color for canvas shapes if  fill-color is ' +
          'undefined', function() {
            var fill = {
              type: 'solidFill',
              color: undefined
            };
            var defaultColor = {
              type: 'srgbClr',
              clr: '000000'
            };
            var expectedColor = 'Some color';
            spyOn(_colorUtility, 'getColor').andReturn(expectedColor);
            spyOn(_colorUtility, 'handleLuminosity').andReturn(expectedColor);

            _solidFillHandler.fillCanvasContext(_context, fill, 'none');
            expect(_colorUtility.getColor).toHaveBeenCalledWith(defaultColor);
            expect(_colorUtility.handleLuminosity).toHaveBeenCalledWith(
                expectedColor, _context, 'none');
            expect(_context.fillStyle).toEqual(expectedColor);
          });
    });

    describe(' fill html shapes', function() {

      it('should handle scheme colors properly for rectangular shapes',
         function() {
           var fill = {
             type: 'solidFill',
             color: {
               type: 'schemeClr',
               scheme: 'accent1',
               effects: {}
             }
           };

           var shapeDiv = document.createElement('DIV');
           spyOn(_colorUtility, 'getHexEquivalentOfSchemeColor').andReturn(
               '#FFFFFF');

           _solidFillHandler.handleUsingHTML(fill, shapeDiv);

           expect(_colorUtility.getHexEquivalentOfSchemeColor).
               toHaveBeenCalledWith(fill.color.scheme);
         });

      it('should not set shapeDiv properties when fill is solidFill and ' +
          'transparency is not defined', function() {
            var fill = {
              type: 'solidFill',
              color: {
                type: 'schemeClr',
                scheme: 'accent1',
                effects: {}
              }
            };

            var cachedColorScheme = {
              'dk1': '#00ffff',
              'dk2': '#000082',
              'accent1': '#00ffff'
            };

            var shapeDiv = document.createElement('DIV');
            spyOn(_themeManager, 'getColorTheme').andReturn(cachedColorScheme);


            _solidFillHandler.handleUsingHTML(fill, shapeDiv);

            expect(shapeDiv.style.background).toEqual('rgb(0, 255, 255)');

          });

    });

    describe(' _getColor function', function() {

      it('should fill rectangular shape with default color if fill-color is ' +
          'undefined', function() {
            var fill = {
              type: 'solidFill',
              color: undefined
            };

            var shapeDiv = document.createElement('DIV');
            var expectedColor = 'black';
            spyOn(_colorUtility, 'getColor').andReturn(expectedColor);

            _solidFillHandler.handleUsingHTML(fill, shapeDiv);

            expect(shapeDiv.style.background).toEqual(expectedColor);
            expect(shapeDiv.style.opacity).toEqual('');
         });
    });
  });
});
