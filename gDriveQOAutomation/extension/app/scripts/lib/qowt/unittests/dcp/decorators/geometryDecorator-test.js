/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([
  'qowtRoot/dcp/decorators/geometryDecorator',
  'qowtRoot/drawing/geometry/geometryManager',
  'qowtRoot/drawing/theme/themeStyleRefManager',
  'qowtRoot/unittests/__unittest-util'
], function(GeometryDecorator,
            GeometryManager,
            ThemeStyleRefManager,
            UnittestUtils) {

  'use strict';

  describe('Geometry decorator test', function() {
    var _geometryDecorator = GeometryDecorator.create();

    var _testAppendArea = UnittestUtils.createTestAppendArea();
    var _shadowProp = {
      type: undefined,
      clr: undefined,
      blurRad: 0,
      delta: {
        x: 0,
        y: 0
      }
    };

    afterEach(function() {
      var canvasElements = _testAppendArea.getElementsByTagName('canvas');
      if (canvasElements.length > 0) {
        _testAppendArea.removeChild(canvasElements[0]);
      }
    });

    it('should return local-api object', function() {
      var localApi = _geometryDecorator.decorate('');

      expect(localApi.withNewCanvas).not.toEqual(undefined);
      expect(localApi.withCanvasTransforms).not.toEqual(undefined);
      expect(localApi.withCanvasDrawing).not.toEqual(undefined);
    });

    it('should create new canvas and attach it to the shape div', function() {
      var someShapeDiv = _testAppendArea;
      someShapeDiv.id = '123';

      _geometryDecorator.decorate(someShapeDiv).withNewCanvas();

      var newCanvas = someShapeDiv.getElementsByTagName('canvas')[0];

      expect(newCanvas.id).toEqual(_testAppendArea.id + 'canvas');
      expect(newCanvas.style.position).toEqual('absolute');
      expect(newCanvas.style['z-index']).toEqual('0');
      expect(newCanvas.parentNode.id).toEqual(someShapeDiv.id);
    });

    it('should call geometry manager, when decorated with canvas drawing',
        function() {
          var someShapeDiv = _testAppendArea;
          var shapeProperties = 'some shape properties';
          var someShapeCanvas = { style: {} };
          var someGroupShapeProperties = 'some group shape properties';

          var geoMgrApi = {
            generateFillColorBean: function() {},
            drawCanvas: function() {},
            withNewCanvas: function() {}
          };

          var fillClrBean = {
            fill: undefined,
            outlineFill: {
              type: undefined,
              lineWidth: undefined,
              data: undefined
            }
          };

          spyOn(GeometryManager, 'initialize').andReturn(geoMgrApi);
          spyOn(geoMgrApi, 'generateFillColorBean').andReturn(fillClrBean);
          spyOn(geoMgrApi, 'drawCanvas');

          _geometryDecorator.decorate(someShapeDiv).withCanvasDrawing(
              shapeProperties, someGroupShapeProperties, fillClrBean, undefined,
              someShapeCanvas);

          expect(GeometryManager.initialize).toHaveBeenCalledWith(
              shapeProperties, someGroupShapeProperties);
          expect(geoMgrApi.drawCanvas).toHaveBeenCalledWith(fillClrBean,
              undefined, someShapeCanvas);
        });

    it('should adjust canvas position and dimension with delta value, ' +
        'when -ln- is undefined', function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = {
            style: {}
          };

          var shapeTransformItem = {
            'ext': {
              'cx': 914400, //96px
              'cy': 457200 //48px
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem,
            'ln': undefined
          };

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(96).toEqual(someShapeCanvas.width);
          expect(48).toEqual(someShapeCanvas.height);
          expect('0px').toEqual(someShapeCanvas.style.left);
          expect('0px').toEqual(someShapeCanvas.style.top);
        });

    it('should get lineWidth from theme if it is not present in ' +
        'shapeProperties', function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = { style: {} };

          var shapeTransformItem = {
            'ext': {
              'cx': 914400, //96px
              'cy': 457200 //48px
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem
          };

          spyOn(ThemeStyleRefManager, 'getCachedOutlineRefStyle');

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(ThemeStyleRefManager.getCachedOutlineRefStyle).
              toHaveBeenCalled();
        });

    it('should not set shape dimensions when shapeTransforms is undefined',
        function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = { style: {} };

          var shapeTransformItem = {
            'ext': undefined
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem
          };

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(someShapeDiv.height).toEqual(undefined);
          expect(someShapeDiv.width).toEqual(undefined);
          expect(someShapeDiv.style.top).toEqual('');
          expect(someShapeDiv.style.left).toEqual('');
        });

    it('should not set shape dimensions when cy in shapeTransforms is ' +
        'undefined', function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = { style: {} };

          var shapeTransformItem = {
            'ext': {
              cy: undefined,
              cx: 914400
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem
          };

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(someShapeDiv.height).toEqual(undefined);
          expect(someShapeDiv.width).toEqual(undefined);
          expect(someShapeDiv.style.top).toEqual('');
          expect(someShapeDiv.style.left).toEqual('');
       });

    it('should not set shape dimensions when cx in shapeTransforms ' +
        'is undefined', function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = { style: {} };

          var shapeTransformItem = {
            'ext': {
              cy: 914400,
              cx: undefined
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem
          };

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(someShapeDiv.height).toEqual(undefined);
          expect(someShapeDiv.width).toEqual(undefined);
          expect(someShapeDiv.style.top).toEqual('');
          expect(someShapeDiv.style.left).toEqual('');
       });

    it('should set lineWidth as zero if it is not defined in theme',
        function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = { style: {} };

          var shapeTransformItem = {
            'ext': {
              'cx': 914400, //96px
              'cy': 457200 //48px
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem
          };

          spyOn(ThemeStyleRefManager, 'getCachedOutlineRefStyle').andReturn(
              undefined);

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(ThemeStyleRefManager.getCachedOutlineRefStyle).
              toHaveBeenCalled();
          expect(96).toEqual(someShapeCanvas.width);
          expect(48).toEqual(someShapeCanvas.height);
          expect('0px').toEqual(someShapeCanvas.style.left);
          expect('0px').toEqual(someShapeCanvas.style.top);
        });

    it('should adjust canvas position and dimension with delta value, ' +
        'when -ln.w- and -ln.ends- are undefined', function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = {
            style: {}
          };

          var shapeTransformItem = {
            'ext': {
              'cx': 914400, //96px
              'cy': 457200 //48px
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem,
            'ln': {
              'w': undefined,
              'ends': undefined
            }
          };

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(98).toEqual(someShapeCanvas.width);
          expect(50).toEqual(someShapeCanvas.height);
          expect('-1px').toEqual(someShapeCanvas.style.left);
          expect('-1px').toEqual(someShapeCanvas.style.top);
        });

    it('should adjust canvas position and dimension with delta value, ' +
        'when -ln.w- present and -ln.ends- is undefined', function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = {
            style: {}
          };

          var shapeTransformItem = {
            'ext': {
              'cx': 914400, //96px
              'cy': 457200 //48px
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem,
            'ln': {
              'w': 19050, //2px
              'ends': undefined
            }
          };

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(100).toEqual(someShapeCanvas.width);
          expect(52).toEqual(someShapeCanvas.height);
          expect('-2px').toEqual(someShapeCanvas.style.left);
          expect('-2px').toEqual(someShapeCanvas.style.top);
       });

    it('should adjust canvas position and dimension with delta value, ' +
        'when -ln.ends- present and -ln.w- is undefined', function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = {
            style: {}
          };

          var shapeTransformItem = {
            'ext': {
              'cx': 914400, //96px
              'cy': 457200 //48px
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem,
            'ln': {
              'w': undefined,
              'ends': {} //arrows present as preset geometry
            }
          };

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(110).toEqual(Math.floor(someShapeCanvas.width));
          expect(62).toEqual(Math.floor(someShapeCanvas.height));
          var left = someShapeCanvas.style.left;
          expect('-7').toEqual(left.substring(0, left.indexOf('.')));
          var top = someShapeCanvas.style.top;
          expect('-7').toEqual(top.substring(0, top.indexOf('.')));
       });

    it('should adjust canvas position and dimension with delta value, ' +
        'when -ln.ends- and -ln.w- are present', function() {
          var someShapeDiv = _testAppendArea;
          var someShapeCanvas = {
            style: {}
          };

          var shapeTransformItem = {
            'ext': {
              'cx': 914400, //96px
              'cy': 457200 //48px
            }
          };
          var geometryPropertyItem = 'geometry property item';
          var shapeProperties = {
            'xfrm': shapeTransformItem,
            'geom': geometryPropertyItem,
            'ln': {
              'w': 19050,
              'ends': {} //arrows present as preset geometry
            }
          };

          _geometryDecorator.decorate(someShapeDiv).withCanvasTransforms(
              shapeProperties, _shadowProp, someShapeCanvas);

          expect(124).toEqual(Math.floor(someShapeCanvas.width));
          expect(76).toEqual(Math.floor(someShapeCanvas.height));
          var left = someShapeCanvas.style.left;
          expect('-14').toEqual(left.substring(0, left.indexOf('.')));
          var top = someShapeCanvas.style.top;
          expect('-14').toEqual(top.substring(0, top.indexOf('.')));
        });
  });
});
