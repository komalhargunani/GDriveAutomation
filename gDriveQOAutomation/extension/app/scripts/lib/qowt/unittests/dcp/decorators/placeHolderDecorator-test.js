define([
  'qowtRoot/dcp/decorators/placeHolderDecorator',
  'qowtRoot/dcp/decorators/outlineDecorator',
  'qowtRoot/dcp/pointHandlers/common/fillHandler',
  'qowtRoot/models/point',
  'qowtRoot/drawing/theme/themeStyleRefManager'
], function(PlaceHolderDecorator,
            OutlineDecorator,
            FillHandler,
            PointModel,
            ThemeStyleRefManager) {

  'use strict';

  describe('Place Holder Decorator Test', function() {
    var _placeHolderDecorator = PlaceHolderDecorator.create();
    var _styleObj, _expectedStyle;
    beforeEach(function() {
      _styleObj = {
        'classPrefix': 'body_sldlt_11',
        'shapeStyle': {
          'styleText': ''
        },
        'shapeFillStyle': {
          'styleText': ''
        }
      };
    });

    describe('decorate withShapeTransform', function() {
      it('should decorate with place holder transforms', function() {
        var shapeProperties = {
          ext: {
            'cx': 3008313,
            'cy': 4691063
          },
          'flipV': true,
          'flipH': true,
          'off': {
            'x': '2133601',
            'y': '838200'
          },
          rot: 20
        };

        var textBodyProperties = {};
        _expectedStyle = 'width : 315.83338582677163px;' +
            'height : 492.5000524934383px;' + 'left : 168.00007874015748pt;' +
            'top : 66pt;-webkit-transform : rotate(20deg) scale(-1,-1);';

        _placeHolderDecorator.decorate(_styleObj.shapeStyle).
            withShapeTransform(shapeProperties, textBodyProperties);

        expect(_styleObj.shapeStyle.styleText).toContain(_expectedStyle);
      });

      it('should not decorate with place holder transforms when place holder ' +
          'extents are undefined', function() {
            var shapeProperties = {
              ext: undefined,
              'flipV': true,
              'off': {
                'x': '2133601',
                'y': '838200'
              },
              rot: 20
            };

            _expectedStyle = 'width : 315.83338582677163px;' +
                'height : 492.5000524934383px;' +
                'left : 168.00007874015748pt;' +
                'top : 66pt;-webkit-transform : rotate(20deg) scale(-1,-1);';

            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeTransform(shapeProperties, {});

            expect(_styleObj.shapeStyle.styleText).not.
                toContain(_expectedStyle);
          });

      it('should not decorate webkit-transforms when flipH and flipV is ' +
          'false and rotation is zero', function() {
            var shapeProperties = {
              ext: undefined,
              'flipH': false,
              'flipV': false,
              'off': {
                'x': '2133601',
                'y': '838200'
              },
              rot: '0'
            };

            _expectedStyle = '-webkit-transform';
            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeTransform(shapeProperties, {});

            expect(_styleObj.shapeStyle.styleText).not.
                toContain(_expectedStyle);
          });

      it('should decorate webkit-transforms when flipV is true', function() {
        var shapeProperties = {
          ext: undefined,
          'flipH': false,
          'flipV': true,
          'off': {
            'x': '2133601',
            'y': '838200'
          },
          rot: '0'
        };

        _expectedStyle = '-webkit-transform';
        _placeHolderDecorator.decorate(_styleObj.shapeStyle).
            withShapeTransform(shapeProperties, {});

        expect(_styleObj.shapeStyle.styleText).toContain(_expectedStyle);
      });

      it('should decorate webkit-transforms when flipH is true', function() {
        var shapeProperties = {
          ext: undefined,
          'flipH': true,
          'flipV': false,
          'off': {
            'x': '2133601',
            'y': '838200'
          },
          rot: '0'
        };
        _expectedStyle = '-webkit-transform';

        _placeHolderDecorator.decorate(_styleObj.shapeStyle).
            withShapeTransform(shapeProperties, {});

        expect(_styleObj.shapeStyle.styleText).toContain(_expectedStyle);
      });

      it('should decorate webkit-transforms when rotation is not zero',
          function() {
            var shapeProperties = {
              ext: undefined,
              'flipH': false,
              'flipV': false,
              'off': {
                'x': '2133601',
                'y': '838200'
              },
              rot: '90'
            };

            _expectedStyle = '-webkit-transform';
            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeTransform(shapeProperties, {});

            expect(_styleObj.shapeStyle.styleText).toContain(_expectedStyle);
          });

      it('should not decorate with place holder transforms when place holder ' +
          'offsets are undefined', function() {
            var shapeProperties = {
              ext: {
                'cx': 3008313,
                'cy': 4691063
              },
              'flipV': true,
              'off': undefined,
              rot: 20
            };

            _expectedStyle = 'width : 315.83338582677163px;' +
                'height : 492.5000524934383px;' +
                'top : 168.00007874015748pt;' +
                'bottom : 66pt;-webkit-transform : rotate(20deg) scale(1,-1);';

            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeTransform(shapeProperties, {});

            expect(_styleObj.shapeStyle.styleText).not.
                toContain(_expectedStyle);
          });

      it('should not decorate with place holder transforms when place holder ' +
          'transforms are undefined', function() {
            var shapeProperties;
            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeTransform(shapeProperties, {});

            expect(_styleObj.shapeStyle.styleText).toContain('');
         });
    });

    describe('decorate withShapeFill', function() {
      it('should decorate with place holder fill', function() {
        var fillProperties = {
          fill: {
            type: 'solidFill',
            clr: '#FF0000'
          }
        };

        var _fillHandler = FillHandler;

        spyOn(_fillHandler, 'getFillStyle').andReturn('some fill style');

        _placeHolderDecorator.decorate(_styleObj.shapeFillStyle).
            withShapeFill(fillProperties);

        expect(_styleObj.shapeFillStyle.styleText).toEqual('some fill style');

      });

      it(' should not decorate with place holder fill when place holder ' +
          'fill is undefined', function() {
            var fillProperties = {
              fill: undefined
            };

            _placeHolderDecorator.decorate(_styleObj.shapeFillStyle).
                withShapeFill(fillProperties);

            expect(_styleObj.shapeFillStyle.styleText).toEqual('');
          });

      it(' should not decorate with place holder fill when fillObj ' +
          'is undefined', function() {
            var fillProperties = {
              fill: undefined
            };

            spyOn(ThemeStyleRefManager, 'getCachedFillRefStyle').
                andReturn(undefined);
            _placeHolderDecorator.decorate(_styleObj.shapeFillStyle).
                withShapeFill(fillProperties.fill, true);

            expect(_styleObj.shapeFillStyle.styleText).toEqual('');
          });

      it(' should not decorate with place holder fill when place holder fill ' +
          'is nofill', function() {
            var fillProperties = {
              fill: 'noFill'
            };

            _placeHolderDecorator.decorate(_styleObj.shapeFillStyle).
                withShapeFill(fillProperties);

            expect(_styleObj.shapeFillStyle.styleText).toEqual('');
          });

      it(' should decorate with place holder fill when place holder fill is ' +
          'present in shape style', function() {
            var fillProperties = {
              fill: 'noFill'
            };

            spyOn(ThemeStyleRefManager, 'getCachedFillRefStyle');
            _placeHolderDecorator.decorate(_styleObj.shapeFillStyle).
                withShapeFill(fillProperties.fill, true);

            expect(ThemeStyleRefManager.getCachedFillRefStyle).
                toHaveBeenCalled();
          });
    });

    describe('decorate withShapeOutline', function() {
      it('should decorate with place holder outline', function() {
        var outLineProperties = {
          fill: 'somefill',
          ends: undefined,
          w: 10
        };

        var _outlineHandler = {
          handleUsingHTML: function() {},
          getPlaceHolderStyle: function() {}
        };

        _expectedStyle = 'some outline style';

        spyOn(OutlineDecorator, 'create').andReturn(_outlineHandler);

        spyOn(_outlineHandler, 'getPlaceHolderStyle').andReturn(
            'some outline style');

        _placeHolderDecorator.decorate(_styleObj.shapeStyle).
            withShapeOutline(outLineProperties);

        expect(_styleObj.shapeStyle.styleText).toEqual(_expectedStyle);
      });

      it('should not decorate with place holder when outline is undefined',
          function() {
            var outLineProperties;

            var _outlineHandler = OutlineDecorator.create();

            spyOn(_outlineHandler, 'getPlaceHolderStyle');

            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeOutline(outLineProperties);

            expect(_styleObj.shapeStyle.styleText).toEqual('');
          });

      it('should decorate with place holder when phTyp is sldmt', function() {
        PointModel.currentPHLevel = 'sldmt';
        var outLineProperties;
        _expectedStyle = 'border-style:solid;border-color:rgba(255,255,255,0);';
        _placeHolderDecorator.decorate(_styleObj.shapeStyle).withShapeOutline(
            outLineProperties);

        expect(_styleObj.shapeStyle.styleText).toEqual(_expectedStyle);
        PointModel.currentPHLevel = undefined;
      });

      it('should decorate with place holder outline when place holder ' +
          'outline is present in shape style', function() {
            var outLineProperties;

            spyOn(ThemeStyleRefManager, 'getCachedOutlineRefStyle');

            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeOutline(outLineProperties, true);

            expect(ThemeStyleRefManager.getCachedOutlineRefStyle).
                toHaveBeenCalled();
          });

      it('should not decorate with place holder outline when outlineObj is ' +
          'undefined ', function() {
            var outLineProperties;

            spyOn(ThemeStyleRefManager, 'getCachedOutlineRefStyle').andReturn(
                undefined);

            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeOutline(outLineProperties, true);

            expect(_styleObj.shapeStyle.styleText).toEqual('');
          });
    });

    describe('decorate with Shape Effects', function() {
      it('should decorate place holder with shadow effect', function() {
        var shadowProperties = {
          efstlst: {
            'outSdwEff': {'blurRad': 40000,
              'color': {'clr': '#000000',
                'effects': [
                  {'name': 'alpha', 'value': 35000}
                ], 'type': 'srgbClr'},
              'dir': 5400000,
              'dist': 23000,
              'rotwithshape': false,
              'type': 'outerShdw'
            }
          }
        };

        _expectedStyle = '-webkit-box-shadow:0pt 2pt 4.199475065616798px ' +
            'rgba(0,0,0,0.35);';
        _placeHolderDecorator.decorate(_styleObj.shapeStyle).
            withShapeEffects(shadowProperties.efstlst);

        expect(_styleObj.shapeStyle.styleText).toEqual(_expectedStyle);
      });

      it('should not decorate place holder with shadow effect when it is ' +
          'undefined', function() {
            var shadowProperties;

            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeEffects(shadowProperties);

            expect(_styleObj.shapeStyle.styleText).toEqual('');
          });

      it('should decorate place holder with reflection effect', function() {
        var reflectionEffectJSON = {
          refnEff: {blurRad: 6350, dist: 60, algn: 'bl'}
        };

        _expectedStyle = '-webkit-box-reflect:below 0.006299212598425197px ' +
            '-webkit-gradient(linear, left top, left bottom, ' +
            'from(transparent), color-stop(NaN%, transparent), ' +
            'to(rgba(255,255,255,0.6666666666666666)));';

        _placeHolderDecorator.decorate(_styleObj.shapeStyle).withShapeEffects(
            reflectionEffectJSON);

        expect(_styleObj.shapeStyle.styleText).toEqual(_expectedStyle);
      });

      it('should decorate place holder with shadow and reflection effect',
          function() {
            var reflectionEffectJSON = {
              'outSdwEff': {
                'blurRad': 40000,
                'color': {'clr': '#000000',
                  'effects': [
                    {'name': 'alpha', 'value': 35000}
                  ], 'type': 'srgbClr'},
                'dir': 5400000,
                'dist': 23000,
                'rotwithshape': false,
                'type': 'outerShdw'},
              refnEff: {blurRad: 6350, dist: 60, algn: 'bl'}
            };

            _expectedStyle = '-webkit-box-reflect:below 0.006299212598425197' +
                'px -webkit-gradient(linear, left top, left bottom, from(' +
                'transparent), color-stop(NaN%, transparent), to(rgba(255,' +
                '255,255,0.6666666666666666)));-webkit-box-shadow:0pt 2pt ' +
                '4.199475065616798px rgba(0,0,0,0.35);';
            _placeHolderDecorator.decorate(_styleObj.shapeStyle).
                withShapeEffects(reflectionEffectJSON);

            expect(_styleObj.shapeStyle.styleText).toEqual(_expectedStyle);
          });
    });
  });
});
