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
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/dcp/pointHandlers/common/blipFillHandler',
  'qowtRoot/dcp/pointHandlers/common/solidFillHandler',
  'qowtRoot/dcp/pointHandlers/common/gradientFillHandler',
  'qowtRoot/utils/deprecatedUtils'
], function(FillHandler,
            BlipFillHandler,
            SolidFillHandler,
            GradientFillHandler,
            DeprecatedUtils) {

  'use strict';

  /**
   * Fill handler Tests
   */
  describe('Fill handler Tests', function() {
    var _fillHandler, _blipFillHandler, _solidFillHandler, _gradientFillHandler;

    beforeEach(function() {
      _fillHandler = FillHandler;

      _blipFillHandler = BlipFillHandler;
      _solidFillHandler = SolidFillHandler;
      _gradientFillHandler = GradientFillHandler;
    });

    describe(' for canvas context fill', function() {
      var _canvas, _context, _fill, _pathFill;

      beforeEach(function() {
        _canvas = 'some canvas';
        _context = 'some context';
        _fill = {};
        _pathFill = 'some path fill';
      });

      it('should call handlers with alpha value 0.0, when transparency is 0.0',
         function() {
           _fill.type = 'solidFill';
           _fill.alpha = '0.0';

           spyOn(_solidFillHandler, 'fillCanvasContext');

           _fillHandler.fillCanvasContext(_canvas, _context, _fill, _pathFill);

           var expectedFill = {
             type: 'solidFill',
             alpha: '0.0'
           };

           expect(_solidFillHandler.fillCanvasContext).toHaveBeenCalledWith(
               _context, expectedFill, _pathFill);
         });

      it('should call handlers with alpha value 1, when transparency is 1',
         function() {
           _fill.type = 'solidFill';
           _fill.alpha = '1';

           spyOn(_solidFillHandler, 'fillCanvasContext');

           _fillHandler.fillCanvasContext(_canvas, _context, _fill, _pathFill);

           var expectedFill = {
             type: 'solidFill',
             alpha: '1'
           };

           expect(_solidFillHandler.fillCanvasContext).toHaveBeenCalledWith(
               _context, expectedFill, _pathFill);
         });

      it('should call handlers with alpha value 0.7, when transparency is 0.7',
         function() {
           _fill.type = 'solidFill';
           _fill.alpha = '0.7';

           spyOn(_solidFillHandler, 'fillCanvasContext');

           _fillHandler.fillCanvasContext(_canvas, _context, _fill, _pathFill);

           var expectedFill = {
             type: 'solidFill',
             alpha: '0.7'
           };

           expect(_solidFillHandler.fillCanvasContext).toHaveBeenCalledWith(
               _context, expectedFill, _pathFill);
         });

      it('should not call any renderer when fill is undefined', function() {
        _fill = undefined;

        spyOn(_solidFillHandler, 'fillCanvasContext');
        spyOn(_gradientFillHandler, 'fillCanvasContext');
        spyOn(_blipFillHandler, 'fillCanvasContext');

        _fillHandler.fillCanvasContext(_canvas, _context, _fill, _pathFill);

        expect(_solidFillHandler.fillCanvasContext).not.toHaveBeenCalled();
        expect(_gradientFillHandler.fillCanvasContext).not.toHaveBeenCalled();
        expect(_blipFillHandler.fillCanvasContext).not.toHaveBeenCalled();
      });

      it('should not call any renderer when fill-type is undefined',
         function() {
           _fill.type = undefined;

           spyOn(_solidFillHandler, 'fillCanvasContext');
           spyOn(_gradientFillHandler, 'fillCanvasContext');
           spyOn(_blipFillHandler, 'fillCanvasContext');

           _fillHandler.fillCanvasContext(_canvas, _context, _fill, _pathFill);

           expect(_solidFillHandler.fillCanvasContext).not.toHaveBeenCalled();
           expect(_gradientFillHandler.fillCanvasContext).not.
               toHaveBeenCalled();
           expect(_blipFillHandler.fillCanvasContext).not.toHaveBeenCalled();
         });

      it('should call solid-fill renderer', function() {
        _fill.type = 'solidFill';

        spyOn(_solidFillHandler, 'fillCanvasContext');

        _fillHandler.fillCanvasContext(_canvas, _context, _fill, _pathFill);

        expect(_solidFillHandler.fillCanvasContext).toHaveBeenCalledWith(
            _context, _fill, _pathFill);
      });

      it('should call gradient-fill renderer', function() {
        _fill.type = 'gradientFill';

        spyOn(_gradientFillHandler, 'fillCanvasContext');

        _fillHandler.fillCanvasContext(_canvas, _context, _fill, _pathFill);

        expect(_gradientFillHandler.fillCanvasContext).toHaveBeenCalledWith(
            _canvas, _context, _fill, _pathFill);
      });

      it('should call blip-fill renderer', function() {
        _fill.type = 'blipFill';
        var img = document.createElement('img');
        _canvas = {
          width: 100,
          height: 120
        };

        spyOn(_blipFillHandler, 'fillCanvasContext');

        _fillHandler.fillCanvasContext(_canvas, _context, _fill, 'trans', img);
        var expectedCanvasDimensions = {
          width: 100,
          height: 120
        };
        expect(_blipFillHandler.fillCanvasContext).toHaveBeenCalledWith(
            expectedCanvasDimensions, _context, _fill, 'trans', img);
      });
    });

    describe(' for html div ', function() {

      it('should call solidFill renderer', function() {
        var fill = {
          type: 'solidFill'
        };

        var divToFill = {
          id: 'solidFilledShape'
        };

        spyOn(_solidFillHandler, 'handleUsingHTML');

        _fillHandler.handleUsingHTML(fill, divToFill);

        expect(_solidFillHandler.handleUsingHTML).toHaveBeenCalledWith(fill,
            divToFill);
      });

      it('should call gradientFill renderer', function() {
        var fill = {
          type: 'gradientFill'
        };

        var divToFill = {
          id: 'gradientFilledShape'
        };

        spyOn(_gradientFillHandler, 'handleUsingHTML');

        _fillHandler.handleUsingHTML(fill, divToFill);

        expect(_gradientFillHandler.handleUsingHTML).toHaveBeenCalledWith(fill,
            divToFill);
      });

      it('should call blipFill renderer', function() {
        var fill = {
          type: 'blipFill'
        };

        var divToFill = {
          id: 'blipFilledShape'
        };

        spyOn(_blipFillHandler, 'handleUsingHTML');

        _fillHandler.handleUsingHTML(fill, divToFill);

        expect(_blipFillHandler.handleUsingHTML).toHaveBeenCalledWith(fill,
            divToFill);
      });

      it('should call noFill renderer', function() {
        var fill = {
          type: 'noFill'
        };

        var divToFill = {
          id: 'noFilledShape'
        };

        divToFill.style = {};
        _fillHandler.handleUsingHTML(fill, divToFill);

        expect(divToFill.style.background).toEqual('none');
      });

      it('should not call any renderer when fill-type is undefined',
         function() {
           var fill = {
             type: undefined
           };

           var divToFill = {
             id: 'noFilledShape'
           };

           divToFill.style = {};

           spyOn(_solidFillHandler, 'fillCanvasContext');
           spyOn(_gradientFillHandler, 'fillCanvasContext');
           spyOn(_blipFillHandler, 'fillCanvasContext');

           _fillHandler.handleUsingHTML(fill, divToFill);

           expect(_solidFillHandler.fillCanvasContext).not.toHaveBeenCalled();
           expect(_gradientFillHandler.fillCanvasContext).not.
               toHaveBeenCalled();
           expect(_blipFillHandler.fillCanvasContext).not.toHaveBeenCalled();
         });

      it('should not call any renderer when fill is undefined', function() {
        var fill;

        var divToFill = {
          id: 'noFilledShape'
        };

        divToFill.style = {};

        spyOn(_solidFillHandler, 'fillCanvasContext');
        spyOn(_gradientFillHandler, 'fillCanvasContext');
        spyOn(_blipFillHandler, 'fillCanvasContext');

        _fillHandler.handleUsingHTML(fill, divToFill);

        expect(_solidFillHandler.fillCanvasContext).not.toHaveBeenCalled();
        expect(_gradientFillHandler.fillCanvasContext).not.toHaveBeenCalled();
        expect(_blipFillHandler.fillCanvasContext).not.toHaveBeenCalled();
      });
    });

    describe(' for place holder divs ', function() {

      it('should call solidFill renderer', function() {
        var fill = {
          type: 'solidFill'
        };

        spyOn(_solidFillHandler, 'getStyleString');

        _fillHandler.getFillStyle(fill);

        expect(_solidFillHandler.getStyleString).toHaveBeenCalledWith(fill);
      });

      it('should call gradientFill renderer', function() {
        var fill = {
          type: 'gradientFill'
        };

        spyOn(_gradientFillHandler, 'getStyleString');

        _fillHandler.getFillStyle(fill);

        expect(_gradientFillHandler.getStyleString).toHaveBeenCalledWith(fill);
      });

      it('should call noFill renderer', function() {
        var fill = {
          type: 'noFill'
        };

        spyOn(DeprecatedUtils, 'getElementStyleString');

        _fillHandler.getFillStyle(fill);

        expect(DeprecatedUtils.getElementStyleString).toHaveBeenCalledWith(
            {background: 'none'});
      });

      it('should call blipFill renderer', function() {
        var fill = {
          type: 'blipFill'
        };
        var fillStyleClass = 'someCSSClass';

        spyOn(_blipFillHandler, 'getStyleString');

        _fillHandler.getFillStyle(fill, fillStyleClass);

        expect(_blipFillHandler.getStyleString).toHaveBeenCalledWith(fill,
            fillStyleClass);
      });

      it('should not call any renderer when fill-type is undefined',
         function() {
           var fill = {
             type: undefined
           };

           var divToFill = {
             id: 'noFilledShape'
           };

           divToFill.style = {};

           spyOn(_solidFillHandler, 'getStyleString');
           spyOn(_gradientFillHandler, 'getStyleString');
           spyOn(_blipFillHandler, 'getStyleString');

           _fillHandler.getFillStyle(fill);

           expect(_solidFillHandler.getStyleString).not.toHaveBeenCalled();
           expect(_gradientFillHandler.getStyleString).not.toHaveBeenCalled();
           expect(_blipFillHandler.getStyleString).not.toHaveBeenCalled();
         });
    });
  });
});
