define([
  'qowtRoot/dcp/decorators/geometryDecorator',
  'qowtRoot/dcp/decorators/shapeDecorator',
  'qowtRoot/dcp/pointHandlers/shapePropertiesHandler',
  'qowtRoot/dcp/pointHandlers/rectangularShapePropertiesHandler',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/models/point',
  'qowtRoot/drawing/geometry/canvasPathExecutor',
  'qowtRoot/drawing/geometry/geometryManager',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/dcp/decorators/shapeEffectsDecorator',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/features/utils',
  'qowtRoot/widgets/image/image',
  'qowtRoot/drawing/geometry/metaFilePainter'
], function(GeometryDecorator,
            ShapeDecorator,
            ShapePropertiesHandler,
            RectangularShapePropertiesHandler,
            PlaceHolderManager,
            UnittestUtils,
            PointModel,
            CanvasPathExecutor,
            GeometryManager,
            ThemeStyleRefManager,
            DeprecatedUtils,
            PubSub,
            ShapeEffectsDecorator,
            QOWTMarkerUtils,
            PlaceHolderPropertiesManager,
            Features,
            ImageWidget,
            MetaFilePainter) {

  'use strict';

  describe('Shape Decorator Test', function() {
    var _shapeDecorator = ShapeDecorator.create();
    var _shapePropertiesHandler = ShapePropertiesHandler;
    var _testAppendArea, _shapeJSON;

    beforeEach(function() {
      _testAppendArea = UnittestUtils.createTestAppendArea();
      _shapeJSON = {
        etp: 'sp',
        eid: '11',
        spPr: {},
        nvSpPr: {}
      };
    });

    afterEach(function() {
      UnittestUtils.removeTestAppendArea();
    });

    it('should decorate with a new div for group shape', function() {
      var someShapeDiv = _testAppendArea;
      _shapeDecorator.withDefaultStyle(someShapeDiv, _shapeJSON);

      expect(someShapeDiv.style.position).toEqual('absolute');
      expect(someShapeDiv.style['z-index']).toEqual('0');
      expect(someShapeDiv.className).toContain('qowt-point-shape');
      expect(someShapeDiv.hasAttribute('qowt-marker')).toEqual(false);
    });

    it('should decorate with a div for a shape and with a shape Id',
        function() {
          var shapeId = '1';
          var someShapeDiv = _testAppendArea;
          _shapeJSON.nvSpPr.shapeId = shapeId;

          _shapeDecorator.withDefaultStyle(someShapeDiv, _shapeJSON);

          expect(someShapeDiv.style.position).toEqual('absolute');
          expect(someShapeDiv.style['z-index']).toEqual('0');
          expect(someShapeDiv.className).toContain('qowt-point-shape');

          var qowtMarkerValue = someShapeDiv.getAttribute('qowt-marker');
          expect(qowtMarkerValue).toBeDefined();
          expect(QOWTMarkerUtils.fetchQOWTMarker(someShapeDiv, 'shape-Id')).
              toEqual(shapeId);
          expect(QOWTMarkerUtils.fetchQOWTMarker(someShapeDiv, 'ph')).
              toBeUndefined();
        });

    it('should decorate with a div for a placeholder shape', function() {
      var previousPhTyp = PointModel.CurrentPlaceHolderAtSlide.phTyp,
          previousPhIdx = PointModel.CurrentPlaceHolderAtSlide.phIdx,
          phTyp = 'ctrTile',
          phIdx = '1';

      _shapeJSON.nvSpPr.phTyp = {};
      PointModel.CurrentPlaceHolderAtSlide.phTyp = phTyp;
      PointModel.CurrentPlaceHolderAtSlide.phIdx = phIdx;

      var someShapeDiv = _testAppendArea;
      _shapeDecorator.withDefaultStyle(someShapeDiv, _shapeJSON);

      expect(someShapeDiv.style.position).toEqual('absolute');
      expect(someShapeDiv.style['z-index']).toEqual('0');
      expect(someShapeDiv.className).toContain('qowt-point-shape');

      var qowtMarkerValue = someShapeDiv.getAttribute('qowt-marker');
      expect(qowtMarkerValue).toBeDefined();
      expect(QOWTMarkerUtils.fetchQOWTMarker(someShapeDiv, 'shape-Id')).
          toBeUndefined();
      expect(QOWTMarkerUtils.fetchQOWTMarker(someShapeDiv, 'ph')).
          toEqual(phTyp + '_' + phIdx);

      // restore phType and phIdx to previous values.
      PointModel.CurrentPlaceHolderAtSlide.phTyp = previousPhTyp;
      PointModel.CurrentPlaceHolderAtSlide.phIdx = previousPhIdx;
      delete _shapeJSON.nvSpPr.phTyp;
    });

    it('should decorate with shape properties', function() {
      var someShapeDiv = _testAppendArea;

      var shapePropertiesElement = 'dummy shape properties element';
      var containerGroupPropertiesBean = 'dummy container group properties ' +
          'bean';

      var shapeDcpObj = {
        spPr: shapePropertiesElement,
        nvSpPr: {},
        grpPrp: containerGroupPropertiesBean,
        elm: [
          {
            etp: 'txBody',
            bodyPr: 'some text-body properties'
          }
        ]
      };

      spyOn(_shapePropertiesHandler, 'handle');

      _shapeDecorator.withShapeProperties(someShapeDiv, shapeDcpObj);

      expect(_shapePropertiesHandler.handle).toHaveBeenCalledWith(
          shapeDcpObj, someShapeDiv, containerGroupPropertiesBean);
    });

    it('should set flip-v and flip-h attributes properly', function() {
      var someShapeDiv = _testAppendArea;

      var shapeDcpObj = {
        spPr: {
          xfrm: {
            flipV: true,
            flipH: true
          }
        }
      };

      _shapeDecorator.decorate(someShapeDiv, shapeDcpObj);

      expect(someShapeDiv.getAttribute('flip-h')).toEqual('true');
      expect(someShapeDiv.getAttribute('flip-v')).toEqual('true');
    });

    it('should set flip-v and flip-h attributes from the resolved properties' +
        ' if it is a placeholder', function() {
          var someShapeDiv = _testAppendArea;

          var shapeDcpObj = {
            spPr: {},
            nvSpPr: {
              phTyp: 'title',
              phIdx: '1'
            }
          };
          var resolvedSpPr = {
            xfrm: {
              flipV: true,
              flipH: false
            }
          };
          spyOn(PlaceHolderManager, 'updateCurrentPlaceHolderForShape');
          spyOn(PlaceHolderPropertiesManager, 'getResolvedShapeProperties').
              andReturn(resolvedSpPr);
          _shapeDecorator.decorate(someShapeDiv, shapeDcpObj);

          expect(someShapeDiv.getAttribute('flip-h')).toEqual('false');
          expect(someShapeDiv.getAttribute('flip-v')).toEqual('true');
          expect(PlaceHolderManager.updateCurrentPlaceHolderForShape).
              toHaveBeenCalledWith(shapeDcpObj.nvSpPr.phTyp,
                  shapeDcpObj.nvSpPr.phIdx);
          expect(PlaceHolderPropertiesManager.getResolvedShapeProperties).
              toHaveBeenCalled();
        });

    it('should display shapeDiv if shape non-visual property has "isHidden" ' +
        'set to false', function() {
          var someShapeDiv = _testAppendArea;

          var shapePropertiesElement = 'dummy shape properties element';

          var shapeDcpObj = {
            spPr: shapePropertiesElement,
            'nvSpPr': {
              'isHidden': false
            },
            elm: [
              {
                etp: 'txBody',
                bodyPr: 'some text-body properties'
              }
            ]
          };

          _shapeDecorator.withShapeProperties(someShapeDiv, shapeDcpObj);

          expect(someShapeDiv.style.display).not.toEqual('none');
        });

    it('should not display shapeDiv if shape non-visual property has ' +
        '"isHidden" set to true', function() {
          var someShapeDiv = _testAppendArea;

          var shapePropertiesElement = 'dummy shape properties element';

          var shapeDcpObj = {
            spPr: shapePropertiesElement,
            'nvSpPr': {
              'isHidden': true
            },
            elm: [
              {
                etp: 'txBody',
                bodyPr: 'some text-body properties'
              }
            ]
          };

          _shapeDecorator.withShapeProperties(someShapeDiv, shapeDcpObj);

          expect(someShapeDiv.style.display).toEqual('none');
        });

    it('should decorate with geometry properties, when rectangular shape',
        function() {
          var someShapeDiv = document.createElement('div');
          someShapeDiv.id = 'shape123';
          _testAppendArea.appendChild(someShapeDiv);
          var shapeDcpObj = {
            etp: 'sp',
            grpPrp: 'some group shape properties',
            spPr: {
              geom: {
                prst: '88'
              }
            }
          };

          var rectPropHandler = RectangularShapePropertiesHandler;
          spyOn(rectPropHandler, 'handle');

          _shapeDecorator.withGeometry(someShapeDiv, shapeDcpObj);

          var expectedShapeFillChildDiv = someShapeDiv.childNodes[0];

          var expectedShapeProps = _.cloneDeep(shapeDcpObj.spPr);
          expectedShapeProps.ln = { fill: { type: 'noFill' }};

          expect(rectPropHandler.handle).
              toHaveBeenCalledWith(expectedShapeProps, shapeDcpObj.grpPrp,
                  someShapeDiv, expectedShapeFillChildDiv);

          expect(expectedShapeFillChildDiv.id).toEqual('shape123shapeFill');
          expect(expectedShapeFillChildDiv.getAttribute('qowt-divType')).
              toEqual('shape-fill');
          _testAppendArea.removeChild(someShapeDiv);
        });

    it('should decorate with geometry properties and call geometry decorator,' +
        ' when non-rectangular shape', function() {
          var someShapeDiv = _testAppendArea;
          var canvasDiv = _testAppendArea;
          var geometryManagerApi = {
            generateFillColorBean: function() {},
            generateEffectsBean: function() {}
          };
          var shapeDcpObj = {
            etp: 'sp',
            grpPrp: 'some group shape properties',
            spPr: {
              geom: {},
              xfrm: {}
            }
          };
          var fillColorBean = 'some fill color bean';
          var effectsBean = 'some effects';

          var geometryDecorator = {
            decorate: function() {}
          };
          var localGeoDecoratorApi = {
            withNewCanvas: function() {},
            withCanvasTransforms: function() {},
            withCanvasDrawing: function() {}
          };

          spyOn(GeometryManager, 'initialize').andReturn(geometryManagerApi);
          spyOn(geometryManagerApi, 'generateFillColorBean').andReturn(
              fillColorBean);
          spyOn(geometryManagerApi, 'generateEffectsBean').andReturn(
              effectsBean);
          spyOn(GeometryDecorator, 'create').andReturn(geometryDecorator);
          spyOn(geometryDecorator, 'decorate').andReturn(localGeoDecoratorApi);
          spyOn(localGeoDecoratorApi, 'withNewCanvas').andReturn(
              canvasDiv);
          spyOn(localGeoDecoratorApi, 'withCanvasDrawing').andReturn(
              localGeoDecoratorApi);
          spyOn(localGeoDecoratorApi, 'withCanvasTransforms').andReturn(
              localGeoDecoratorApi);
          spyOn(CanvasPathExecutor, 'drawPathsOnContext').andCallThrough();
          var shapeDecorator = ShapeDecorator.create();

          shapeDecorator.withGeometry(someShapeDiv, shapeDcpObj);

          var expectedShapeProps = _.cloneDeep(shapeDcpObj.spPr);
          expectedShapeProps.ln = { fill: { type: 'noFill' }};


          expect(geometryDecorator.decorate).toHaveBeenCalledWith(someShapeDiv);
          expect(localGeoDecoratorApi.withNewCanvas).toHaveBeenCalled();
          expect(localGeoDecoratorApi.withCanvasTransforms).
              toHaveBeenCalledWith(expectedShapeProps, effectsBean, canvasDiv);
          expect(localGeoDecoratorApi.withCanvasDrawing).toHaveBeenCalledWith(
              expectedShapeProps, shapeDcpObj.grpPrp, fillColorBean,
              effectsBean, canvasDiv);
        });

    it('should set border-style:none decorate and call geometry decorator, ' +
        'when non-rectangular placeholder shape', function() {
          var someShapeDiv = _testAppendArea;
          var canvasDiv = _testAppendArea;
          var shapeDcpObj = {
            etp: 'sp',
            grpPrp: 'some group shape properties',
            spPr: {
              geom: {},
              xfrm: {}
            }
          };

          PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
          var geometryDecorator = {
            decorate: function() {}
          };

          var localGeoDecoratorApi = {
            withNewCanvas: function() {},
            withCanvasTransforms: function() {},
            withCanvasDrawing: function() {}
          };

          var geometryManagerApi = {
            generateFillColorBean: function() {},
            generateEffectsBean: function() {}
          };

          var fillColorBean = 'some fill color bean';
          var effectsBean = 'some effects';

          spyOn(GeometryManager, 'initialize').andReturn(geometryManagerApi);
          spyOn(geometryManagerApi, 'generateFillColorBean').andReturn(
              fillColorBean);
          spyOn(geometryManagerApi, 'generateEffectsBean').andReturn(
              effectsBean);
          spyOn(GeometryDecorator, 'create').andReturn(geometryDecorator);
          spyOn(geometryDecorator, 'decorate').andReturn(localGeoDecoratorApi);
          spyOn(localGeoDecoratorApi, 'withNewCanvas').andReturn(
              canvasDiv);
          spyOn(localGeoDecoratorApi, 'withCanvasDrawing').andReturn(
              localGeoDecoratorApi);
          spyOn(localGeoDecoratorApi, 'withCanvasTransforms').andReturn(
              localGeoDecoratorApi);
          spyOn(CanvasPathExecutor, 'drawPathsOnContext').andCallThrough();
          var shapeDecorator = ShapeDecorator.create();

          shapeDecorator.withGeometry(someShapeDiv, shapeDcpObj);

          var expectedShapeProps = _.cloneDeep(shapeDcpObj.spPr);
          expectedShapeProps.ln = { fill: { type: 'noFill' }};

          expect(geometryDecorator.decorate).toHaveBeenCalledWith(someShapeDiv);
          expect(localGeoDecoratorApi.withNewCanvas).toHaveBeenCalled();
          expect(localGeoDecoratorApi.withCanvasTransforms).
              toHaveBeenCalledWith(expectedShapeProps, effectsBean, canvasDiv);
          expect(localGeoDecoratorApi.withCanvasDrawing).toHaveBeenCalledWith(
              expectedShapeProps, shapeDcpObj.grpPrp, fillColorBean,
              effectsBean, canvasDiv);
          expect(someShapeDiv.style.border).toEqual('none');
        });

    it('should not set shadow property, when shape is a non-rectangular' +
        'placeholder', function() {
          var someShapeDiv = _testAppendArea;
          var canvasDiv = _testAppendArea;
          var shapeDcpObj = {
            etp: 'sp',
            grpPrp: 'some group shape properties',
            spPr: {
              geom: {},
              xfrm: {}
            }
          };

          PointModel.CurrentPlaceHolderAtSlide.phTyp = 'title';
          var geometryDecorator = {
            decorate: function() {}
          };

          var localGeoDecoratorApi = {
            withNewCanvas: function() {},
            withCanvasTransforms: function() {},
            withCanvasDrawing: function() {
            }
          };

          var geometryManagerApi = {
            generateFillColorBean: function() {},
            generateEffectsBean: function() {}
          };

          var fillColorBean = 'some fill color bean';
          var effectsBean = 'some effects';

          spyOn(GeometryManager, 'initialize').andReturn(geometryManagerApi);
          spyOn(geometryManagerApi, 'generateFillColorBean').andReturn(
              fillColorBean);
          spyOn(geometryManagerApi, 'generateEffectsBean').andReturn(
              effectsBean);
          spyOn(GeometryDecorator, 'create').andReturn(geometryDecorator);
          spyOn(geometryDecorator, 'decorate').andReturn(localGeoDecoratorApi);
          spyOn(localGeoDecoratorApi, 'withNewCanvas').andReturn(
              canvasDiv);
          spyOn(localGeoDecoratorApi, 'withCanvasDrawing').andReturn(
              localGeoDecoratorApi);
          spyOn(localGeoDecoratorApi, 'withCanvasTransforms').andReturn(
              localGeoDecoratorApi);
          spyOn(CanvasPathExecutor, 'drawPathsOnContext').andCallThrough();
          var shapeDecorator = ShapeDecorator.create();

          shapeDecorator.withGeometry(someShapeDiv, shapeDcpObj);

          expect(someShapeDiv.style['-webkit-box-shadow']).toEqual('none');
        });

    it('should decorate with table specifics, when height not defined',
        function() {
          var someShapeDiv = _testAppendArea;

          var shapeDcpObj = {};

          _shapeDecorator.withTableSpecifics(someShapeDiv, shapeDcpObj);

          expect(someShapeDiv.style.position).toEqual('relative');
          expect(someShapeDiv.style.height).toEqual('100%');
        });

    it('should decorate with table specifics, when height is defined',
        function() {
          var someShapeDiv = _testAppendArea;

          var shapeDcpObj = {
            height: '914400'
          };

          _shapeDecorator.withTableSpecifics(someShapeDiv, shapeDcpObj);

          expect(someShapeDiv.style.position).toEqual('relative');
          expect(someShapeDiv.style.height).toEqual('100%');
          expect(someShapeDiv.style.minHeight).toEqual('96px');
        });

    describe(' with high level effects ', function() {
      var _placeHolderManager = PlaceHolderManager;

      var _someShapeDiv;
      var _shapeObj = {
        etp: 'sp',
        spPr: {
          geom: {
            prst: '88'
          },
          xfrm: {},
          efstlst: {
            outSdwEff: {
              blurRad: 6350,
              dist: 60,
              algn: 'bl',
              color: {scheme: 'accent2', type: 'scheme'}
            },
            refnEff: {blurRad: 6350, dist: 60, algn: 'bl'}
          }
        },
        grpPrp: 'some group shape properties'
      };

      var _localShapeEffectsAPI = {
        withShadow: function() {},
        withRedundantEffects: function() {},
        withReflection: function() {}
      };

      var _geometryDecorator = {
        decorate: function() {}
      };

      var _localGeoDecoratorApi = {
        withNewCanvas: function() {},
        withCanvasTransforms: function() {},
        withCanvasDrawing: function() {}
      };

      var _geometryManagerApi = {
        generateFillColorBean: function() {},
        generateEffectsBean: function() {}
      };

      var fillColorBean = 'some fill color bean';
      var effectsBean = 'some effects';
      var someCanvas = {
        style: ''
      };
      var _themeEffectCSSClass;

      beforeEach(function() {
        _someShapeDiv = _testAppendArea;

        spyOn(ShapeEffectsDecorator, 'create').andReturn(_localShapeEffectsAPI);

        spyOn(GeometryManager, 'initialize').andReturn(_geometryManagerApi);
        spyOn(_geometryManagerApi, 'generateFillColorBean').andReturn(
            fillColorBean);
        spyOn(_geometryManagerApi, 'generateEffectsBean').andReturn(
            effectsBean);
        spyOn(GeometryDecorator, 'create').andReturn(_geometryDecorator);
        spyOn(_geometryDecorator, 'decorate').andReturn(_localGeoDecoratorApi);
        spyOn(_localGeoDecoratorApi, 'withNewCanvas').andReturn(
            someCanvas);
        spyOn(_localGeoDecoratorApi, 'withCanvasDrawing').andReturn(
            _localGeoDecoratorApi);
        spyOn(_localGeoDecoratorApi, 'withCanvasTransforms').andReturn(
            _localGeoDecoratorApi);
        spyOn(CanvasPathExecutor, 'drawPathsOnContext').andCallThrough();

        _placeHolderManager.resetCurrentPlaceHolderForShape();

        _shapeDecorator = ShapeDecorator.create();

        PointModel.MasterSlideId = '901';
        PointModel.SlideLayoutId = '801';
        spyOn(DeprecatedUtils, 'appendJSONAttributes');
      });

      afterEach(function() {
        PointModel.MasterSlideId = undefined;
        PointModel.SlideLayoutId = undefined;
        _someShapeDiv = undefined;
      });

      it('should decorate with high level effects , when it is a rectangular ' +
          'shape', function() {
            var reflectionStyle = 'some reflection style';
            spyOn(_localShapeEffectsAPI, 'withReflection').andReturn(
                reflectionStyle);
            spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').
                andReturn();

            _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);

            expect(_localShapeEffectsAPI.withReflection).toHaveBeenCalledWith(
                _shapeObj.spPr.efstlst.refnEff);
            expect(DeprecatedUtils.appendJSONAttributes).toHaveBeenCalledWith(
                _someShapeDiv.style, reflectionStyle);
          });

      it('should handle redundant effects , when it is a rectangular shape',
          function() {
            var redundantStyle = 'some redundant style';
            spyOn(_localShapeEffectsAPI, 'withRedundantEffects').andReturn(
                redundantStyle);
            spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').
                andReturn();

            _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);

            expect(_localShapeEffectsAPI.withRedundantEffects).
                toHaveBeenCalledWith(_someShapeDiv, _shapeObj.spPr.efstlst,
                    true);
            expect(DeprecatedUtils.appendJSONAttributes).toHaveBeenCalledWith(
                _someShapeDiv.style, redundantStyle);

          });

      it('should decorate with high level effects , when it is a ' +
          'non-rectangular shape', function() {
            var someCanvas = {
              style: ''
            };
            _shapeObj.spPr.geom.prst = '98';
            var reflectionStyle = 'some reflection style';
            spyOn(_localShapeEffectsAPI, 'withReflection').andReturn(
                reflectionStyle);
            spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').
                andReturn();
            _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);

            expect(_localShapeEffectsAPI.withReflection).toHaveBeenCalledWith(
                _shapeObj.spPr.efstlst.refnEff);
            expect(DeprecatedUtils.appendJSONAttributes).toHaveBeenCalledWith(
                someCanvas.style, reflectionStyle);
          });

      it('should handle redundant effects , when it is a non-rectangular ' +
          'shape', function() {
            var someCanvas = {
              style: ''
            };

            _shapeObj.spPr.geom.prst = '98';
            var redundantStyle = 'some redundant style';
            spyOn(_localShapeEffectsAPI, 'withRedundantEffects').andReturn(
                redundantStyle);
            spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').
                andReturn();
            _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);

            expect(_localShapeEffectsAPI.withRedundantEffects).
                toHaveBeenCalledWith(someCanvas, _shapeObj.spPr.efstlst, true);
            expect(DeprecatedUtils.appendJSONAttributes).toHaveBeenCalledWith(
                someCanvas.style, redundantStyle);
          });

      it('should not append redundant style to target div when redundant ' +
          'style is undefined', function() {
            _shapeObj.spPr.geom.prst = '88';
            spyOn(_localShapeEffectsAPI, 'withRedundantEffects').andReturn(
                undefined);
            spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').
               andReturn();

            _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);
          });

      it('should not append high level effect when reflection effect list ' +
          'is undefined', function() {
            _shapeObj.spPr.geom.prst = '88';
            _shapeObj.spPr.efstlst = {
              refnEff: undefined
            };
            spyOn(_localShapeEffectsAPI, 'withReflection');
            spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').
                andReturn();

            _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);

            expect(_localShapeEffectsAPI.withReflection).not.toHaveBeenCalled();
          });

      it('should not append high level effect when effect list is undefined',
          function() {
            _shapeObj.spPr.geom.prst = '88';
            _shapeObj.spPr.efstlst = undefined;
            spyOn(_localShapeEffectsAPI, 'withReflection');
            spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').
                andReturn();

            _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);

            expect(_localShapeEffectsAPI.withReflection).not.toHaveBeenCalled();
          });

      it('should append High Level EffectRef ClassName', function() {
        _themeEffectCSSClass = 'someClass';
        _shapeObj.spPr.geom.prst = '88';
        _shapeObj.spPr.efstlst = {
          outSdwEff: {
            blurRad: 6350,
            dist: 60,
            algn: 'bl',
            color: {scheme: 'accent2', type: 'scheme'}
          },
          refnEff: {blurRad: 6350, dist: 60, algn: 'bl'}
        };
        spyOn(_localShapeEffectsAPI, 'withReflection');
        spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').andReturn(
            _themeEffectCSSClass);

        _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);

        expect(_someShapeDiv.className).toContain(_themeEffectCSSClass);
      });

      it('should not append High Level EffectRef ClassName if it is undefined',
          function() {
            _someShapeDiv.className = '';
            _themeEffectCSSClass = undefined;
            _shapeObj.spPr.geom.prst = '88';
            _shapeObj.spPr.efstlst = {
              outSdwEff: {
                blurRad: 6350,
                dist: 60,
                algn: 'bl',
                color: {scheme: 'accent2', type: 'scheme'}
              },
              refnEff: {blurRad: 6350, dist: 60, algn: 'bl'}
            };
            spyOn(_localShapeEffectsAPI, 'withReflection');
            spyOn(ThemeStyleRefManager, 'getHighLevelEffectRefClassName').
                andReturn(_themeEffectCSSClass);

            _shapeDecorator.withGeometry(_someShapeDiv, _shapeObj);

            expect(_someShapeDiv.className).toEqual('');
          });

      it('should decorate with z-index to -1, when picture rectangular shape',
          function() {
            var someShapeDiv = document.createElement('div');
            someShapeDiv.id = 'someId';
            _shapeObj.etp = 'pic';
            _shapeObj.spPr.geom.prst = '88';

            _shapeDecorator.withGeometry(someShapeDiv, _shapeObj);

            var expectedShapeFillChildDiv = someShapeDiv.childNodes[0];
            expect(expectedShapeFillChildDiv.getAttribute('qowt-filltype')).
                toEqual('pic');
          });
    });

    it('should set transform properties to shape correctly', function() {
      var shapeNode = window.document.createElement('div');
      var canvasNode = window.document.createElement('canvas');
      var textBodyNode = window.document.createElement('div');
      var handlersNode = window.document.createElement('div');
      var dummyCanvasNode = window.document.createElement('canvas');
      var dummyShapeNode = window.document.createElement('div');
      var shapeJson = {
        spPr: {
          xfrm: {
            ext: {},
            off: {},
            flipH: false,
            flipV: false
          }
        }
      };

      var xfrm = {
        ext: {},
        off: {},
        flipH: true,
        flipV: false
      };
      textBodyNode.setAttribute('qowt-divtype', 'textBox');
      handlersNode.setAttribute('qowt-divtype', 'handlers');
      dummyShapeNode.style['-webkit-transform'] = 'scale(-1, -1)';
      shapeNode.appendChild(textBodyNode);
      shapeNode.appendChild(canvasNode);
      shapeNode.appendChild(handlersNode);
      dummyShapeNode.appendChild(dummyCanvasNode);
      shapeNode.shapeJson = shapeJson;
      spyOn(_shapeDecorator, 'isFlippedHorizontal').andReturn(true);
      spyOn(_shapeDecorator, 'isFlippedVertical').andReturn(true);

      _shapeDecorator.setTransforms(shapeNode, xfrm);

      expect(shapeNode.getAttribute('flip-v')).toEqual('false');
      expect(shapeNode.getAttribute('flip-h')).toEqual('true');
      expect(handlersNode.style['-webkit-transform']).toEqual('scale(-1, -1)');
    });

    it('should call image widget when image is resized', function() {
      var shapeNode = window.document.createElement('div');

      var shapeJson = {
        etp: 'pic',
        elm: [
          {
            etp: 'img',
            eid: '111'
          }],
        spPr: {
          xfrm: {
            ext: {cx: 0, cy: 0},
            off: {x: 0, y: 0},
            flipH: false,
            flipV: false
          }
        }
      };

      var xfrm = {
        ext: {cx: 0, cy: 0},
        off: {x: 0, y: 0},
        flipH: true,
        flipV: false
      };
      var _imageWidget = {
        setWidth: function() {},
        setHeight: function() {}
      };
      shapeNode.shapeJson = shapeJson;
      var imageNode = window.document.createElement('img');
      imageNode.id = '111';
      var handlersNode = window.document.createElement('div');
      handlersNode.setAttribute('qowt-divtype', 'handlers');
      shapeNode.appendChild(imageNode);
      shapeNode.appendChild(handlersNode);
      spyOn(ImageWidget, 'create').andReturn(_imageWidget);
      spyOn(_imageWidget, 'setWidth');
      spyOn(_imageWidget, 'setHeight');
      spyOn(shapeNode, 'querySelector').andReturn(imageNode);

      _shapeDecorator.setTransforms(shapeNode, xfrm);

      expect(_imageWidget.setWidth).toHaveBeenCalled();
      expect(_imageWidget.setHeight).toHaveBeenCalled();
    });

    it('should not perform redraw operation for charts', function() {
      var shapeNode = window.document.createElement('div');
      shapeNode.setAttribute('qowt-divtype', 'grFrm');
      var shapeJson = {
        etp: 'pic',
        elm: [
          {
            etp: 'img',
            eid: '111'
          }],
        spPr: {
          xfrm: {
            ext: {cx: 0, cy: 0},
            off: {x: 0, y: 0},
            flipH: true,
            flipV: false
          }
        }
      };
      var xfrm = {
        ext: {cx: 0, cy: 0},
        off: {x: 0, y: 0},
        flipH: true,
        flipV: false
      };
      shapeNode.shapeJson = shapeJson;

      spyOn(_shapeDecorator, 'decorate');
      _shapeDecorator.setTransforms(shapeNode, xfrm);

      expect(_shapeDecorator.decorate).not.toHaveBeenCalled();
    });

    it('should update flip attributes of shape node when ' +
        'shape is horizontally flipped', function() {
         var shapeNode = window.document.createElement('div');
         var handlersNode = window.document.createElement('div');
         var textBodyNode = window.document.createElement('div');
         var dummyTextBodyNode = window.document.createElement('div');
         dummyTextBodyNode.classList.add('placeholder-text-body');
         dummyTextBodyNode.setAttribute('qowt-divtype', 'textBox');
         textBodyNode.setAttribute('qowt-divtype', 'textBox');

         shapeNode.appendChild(dummyTextBodyNode);
         var shapeJson = {
           spPr: {
             xfrm: {
               ext: {},
               off: {},
               flipH: false,
               flipV: false
             }
           }
         };
         var xfrm = {
           ext: {cx: 0, cy: 0},
           off: {x: 0, y: 0},
           flipH: true,
           flipV: false
         };
         handlersNode.setAttribute('qowt-divtype', 'handlers');
         shapeNode.appendChild(textBodyNode);
         shapeNode.appendChild(handlersNode);
         shapeNode.shapeJson = shapeJson;
         spyOn(_shapeDecorator, 'isFlippedHorizontal').andReturn(true);

         _shapeDecorator.setTransforms(shapeNode, xfrm);

         expect(shapeNode.getAttribute('flip-v')).toEqual('false');
         expect(shapeNode.getAttribute('flip-h')).toEqual('true');
       });

    it('should call meta file painter when meta file shape is resized',
        function() {
          var shapeJson = {
            etp: 'pic',
            elm: [
              {
                etp: 'mf',
                eid: 'E123',
                pathLst: [{}],
                ext: {cx: 0, cy: 0},
                elm: [
                  {
                    etp: 'img',
                    eid: 'E124'
                  }
                ]
              }],
            spPr: {
              xfrm: {
                ext: {cx: 0, cy: 0},
                off: {x: 0, y: 0},
                flipH: false,
                flipV: false
              }
            }
          };
          var xfrm = {
            ext: {cx: 0, cy: 0},
            off: {x: 0, y: 0},
            flipH: true,
            flipV: false
          };
          var _imageWidget = {
            setWidth: function() {},
            setHeight: function() {}
          };

          var shapeNode = window.document.createElement('div');
          shapeNode.shapeJson = shapeJson;
          var metaFileDiv = window.document.createElement('div');
          var metaFileCanvas = window.document.createElement('canvas');
          var metaFileImage = window.document.createElement('img');
          metaFileDiv.id = 'E123';
          metaFileImage.id = 'E124';
          metaFileDiv.appendChild(metaFileCanvas);
          metaFileDiv.appendChild(metaFileImage);
          shapeNode.appendChild(metaFileDiv);
          spyOn(MetaFilePainter, 'paintCanvas');
          spyOn(ImageWidget, 'create').andReturn(_imageWidget);
          spyOn(_imageWidget, 'setWidth');
          spyOn(_imageWidget, 'setHeight');

          _shapeDecorator.setTransforms(shapeNode, xfrm);

          expect(MetaFilePainter.paintCanvas).toHaveBeenCalled();
          expect(_imageWidget.setWidth).toHaveBeenCalled();
          expect(_imageWidget.setHeight).toHaveBeenCalled();
        });


    it('should apply transform style to handlers node if it is defined',
        function() {
          var shapeNode = window.document.createElement('div');
          var handlersNode = window.document.createElement('div');
          var shapeJson = {
            spPr: {
              xfrm: {
                ext: {},
                off: {},
                flipH: true,
                flipV: false
              }
            }
          };
          var xfrm = {
            ext: {cx: 0, cy: 0},
            off: {x: 0, y: 0},
            flipH: true,
            flipV: false
          };
          handlersNode.setAttribute('qowt-divtype', 'handlers');
          spyOn(_shapeDecorator, 'isFlippedHorizontal').andReturn(true);
          shapeNode.appendChild(handlersNode);
          shapeNode.shapeJson = shapeJson;

          _shapeDecorator.setTransforms(shapeNode, xfrm);

          expect(handlersNode.style['-webkit-transform']).toEqual(
              'scale(-1, 1)');
        });

    it('should apply fill',
        function() {
          var shapeNode = window.document.createElement('div');
          var shapeJson = {
            spPr: {
              fill: {}
            }
          };
          var fill = {
            'color': {
              'clr': '#ffff00',
              'effects': [
                {
                  'name': 'alpha',
                  'value': 100000
                }
              ],
              'type': 'srgbClr'
            },
            'type': 'solidFill'
          };
          shapeNode.shapeJson = shapeJson;
          spyOn(_shapeDecorator, 'decorate');
          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(ThemeStyleRefManager, 'cacheShapeStyle');
          _shapeDecorator.setFill(shapeNode, fill);
          expect(_shapeDecorator.decorate).toHaveBeenCalled();
        });

    describe('Shape decorator related test cases', function() {

      var shapeDiv = document.createElement('div');
      beforeEach(function() {

        spyOn(_shapeDecorator, 'decorate').andCallThrough();

        spyOn(_shapeDecorator, 'withDefaultStyle');
        spyOn(_shapeDecorator, 'withTableSpecifics');
        spyOn(_shapeDecorator, 'withShapeProperties');
        spyOn(_shapeDecorator, 'withGeometry');
        spyOn(_shapeDecorator, 'withPlaceHolderType');

        _shapeJSON = {
          etp: 'sp',
          eid: '11',
          spPr: {},
          nvSpPr: {}
        };

      });


      it('should decorate shapeDiv with table properties if shape is table ' +
          'cell', function() {

           _shapeJSON.spPr.isShapeWithinTable = true;

           _shapeDecorator.decorate(shapeDiv, _shapeJSON);

           expect(_shapeDecorator.decorate).toHaveBeenCalled();

           expect(_shapeDecorator.withDefaultStyle).toHaveBeenCalled();
           expect(_shapeDecorator.withTableSpecifics).
           toHaveBeenCalledWith(shapeDiv, _shapeJSON);
           expect(_shapeDecorator.withShapeProperties).
           toHaveBeenCalledWith(shapeDiv, _shapeJSON);
           expect(_shapeDecorator.withGeometry).not.toHaveBeenCalled();
         });

      it('should decorates shape div with the geometry', function() {

        _shapeJSON.spPr = {
          geom: 'some geometry properties'
        };

        _shapeJSON.style = {};

        _shapeDecorator.decorate(shapeDiv, _shapeJSON);

        expect(_shapeDecorator.decorate).toHaveBeenCalled();
        expect(_shapeDecorator.withDefaultStyle).toHaveBeenCalled();
        expect(_shapeDecorator.withTableSpecifics).not.toHaveBeenCalled();
        expect(_shapeDecorator.withShapeProperties).
            toHaveBeenCalledWith(shapeDiv, _shapeJSON);
        expect(_shapeDecorator.withGeometry).
            toHaveBeenCalledWith(shapeDiv, _shapeJSON);
      });

      it('should decorate shapeDiv without geometry and table specifics ' +
          'properties', function() {

           _shapeDecorator.decorate(shapeDiv, _shapeJSON);

           expect(_shapeDecorator.decorate).toHaveBeenCalled();
           expect(_shapeDecorator.withDefaultStyle).toHaveBeenCalled();
           expect(_shapeDecorator.withTableSpecifics).not.toHaveBeenCalled();
           expect(_shapeDecorator.withShapeProperties).
           toHaveBeenCalledWith(shapeDiv, _shapeJSON);
         });

      describe(' Shape Decoration with place-holder test case', function() {
        var resolvedShapePr;
        beforeEach(function() {
          resolvedShapePr = {
            geom: {
              prst: 88
            },
            efstlst: {outSdwEff: {
              'blurRad': 40000,
              'color': {'clr': '#000000',
                'effects': [
                  {'name': 'alpha',
                    'value': 35000}
                ],
                'type': 'srgbClr'},
              'dir': 5400000,
              'dist': 23000,
              'rotwithshape': false,
              'type': 'outerShdw'}
            }
          };

          spyOn(PlaceHolderPropertiesManager, 'getResolvedShapeProperties').
              andReturn(resolvedShapePr);

          _shapeJSON.nvSpPr = {
            phTyp: 'ftr',
            phIdx: '11',
            sldLtId: '801',
            msLtId: '901'
          };
        });

        it('should pick preset-id 88, when explicit geom absent, and resolved' +
            ' shape-properties comes as undefined', function() {
             _shapeJSON.spPr.geom = undefined;
             resolvedShapePr = undefined;

             _shapeDecorator.decorate(shapeDiv, _shapeJSON);

             expect(_shapeDecorator.withShapeProperties.calls[0].args[0]).
             toEqual(shapeDiv, _shapeJSON);
           });

        it('should pick preset-id 88, if explicit geom is absent and ' +
            'resolved shape property is present but, preset geom is absent ' +
            'in resolved shape properties', function() {
             _shapeJSON.spPr.geom = undefined;
             resolvedShapePr.geom = undefined;

             _shapeDecorator.decorate(shapeDiv, _shapeJSON);

             expect(_shapeDecorator.withShapeProperties.calls[0].args[0]).
             toEqual(shapeDiv, _shapeJSON);
           });

        it('should pick preset-id from resolved geom, when explicit geom ' +
            'absent and preset geom is present in resolved shape properties',
            function() {
              _shapeJSON.spPr.geom = undefined;

              _shapeDecorator.decorate(shapeDiv, _shapeJSON);

              expect(_shapeDecorator.withShapeProperties.calls[0].args[0]).
                  toEqual(shapeDiv, _shapeJSON);
            });

        it('should call decorate with placeholder, when non-visual shape ' +
            'properties and placeholder type is present', function() {
             _shapeDecorator.decorate(shapeDiv, _shapeJSON);

             expect(_shapeDecorator.decorate).toHaveBeenCalled();
             expect(_shapeDecorator.withPlaceHolderType).toHaveBeenCalled();
           });

        it('should decorate shapeDiv with geometry if non-visual shape ' +
            'properties and placeholder type is present', function() {
             _shapeJSON.style = 'some shape style';
             _shapeJSON.spPr.geom = 111;

             _shapeDecorator.decorate(shapeDiv, _shapeJSON);

             expect(_shapeDecorator.decorate).toHaveBeenCalled();
             expect(_shapeDecorator.withGeometry).
             toHaveBeenCalledWith(shapeDiv, _shapeJSON);
           });

        it('should update shape properties with shadow effects if shape is a ' +
            'placeholder', function() {
             _shapeJSON.style = 'some shape style';
             _shapeJSON.spPr = {geom: {prst: '88'}};
             _shapeJSON.nvSpPr.phTyp = undefined;

             _shapeDecorator.decorate(shapeDiv, _shapeJSON);

             expect(_shapeJSON.spPr.efstlst).not.toBeDefined();
           });

        it('should not update shape properties with shadow effects if ' +
            'non-visual properties for shape are undefined', function() {
             _shapeJSON.style = 'some shape style';
             _shapeJSON.spPr = {geom: {prst: '78'}};
             _shapeJSON.nvSpPr = undefined;

             _shapeDecorator.decorate(shapeDiv, _shapeJSON);

             expect(_shapeJSON.spPr.efstlst).not.toBeDefined();
           });

        it('should not update shape properties with shadow effects if shape ' +
            'is rectangular', function() {
             _shapeJSON.style = 'some shape style';
             _shapeJSON.spPr = {geom: {prst: '88'}};
             _shapeJSON.nvSpPr.phTyp = 'body';

             _shapeDecorator.decorate(shapeDiv, _shapeJSON);

             expect(_shapeJSON.spPr.efstlst).not.toBeDefined();
           });

        it('should append placeholder text body to shape', function() {
          _shapeJSON.nvSpPr.phTyp = 'body';
          _shapeJSON.nvSpPr.phIdx = '1';
          var bodyNode = document.createElement('div');
          bodyNode.id = 'testAppendArea';
          PointModel.placeholderTextBody.body_1 = bodyNode;
          spyOn(Features, 'isEnabled').andReturn(true);

          _shapeDecorator.decorate(shapeDiv, _shapeJSON);

          expect(shapeDiv.getElementById('testAppendArea')).toBeDefined();
        });
      });

    });

  });
});
