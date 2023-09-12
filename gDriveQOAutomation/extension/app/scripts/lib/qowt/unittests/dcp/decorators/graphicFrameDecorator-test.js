// Copyright 2012 Google Inc. All Rights Reserved.

define([
  'qowtRoot/dcp/decorators/graphicFrameDecorator',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/dcp/pointHandlers/transform2DHandler',
  'qowtRoot/presentation/layoutsManager'
], function(
            GraphicFrameDecorator,
            QOWTMarkerUtils,
            Transform2DHandler,
            LayoutsManager) {

  'use strict';

  describe('Graphic Frame Decorator test', function() {
    var _graphicFrameDecorator = GraphicFrameDecorator.create().decorate();

    describe('-withNewDiv- decorator test', function() {

      it('-withNewDiv- should create and return a new div', function() {
        var newDummyDiv = {
          style: {},
          setAttribute: function() {}
        };
        spyOn(document, 'createElement').andReturn(newDummyDiv);
        spyOn(QOWTMarkerUtils, 'addQOWTMarker');
        spyOn(newDummyDiv, 'setAttribute');

        var graphicFrameDiv = _graphicFrameDecorator.withNewDiv('777', '1');

        expect(document.createElement).toHaveBeenCalledWith('DIV');
        expect(newDummyDiv.id).toEqual('777');
        expect(newDummyDiv.style.position).toEqual('absolute');
        expect(newDummyDiv.style['z-index']).toEqual('0');
        expect(graphicFrameDiv).toEqual(newDummyDiv);
        expect(newDummyDiv.setAttribute).toHaveBeenCalledWith('qowt-divType',
            'grFrm');
        expect(newDummyDiv.setAttribute).toHaveBeenCalledWith('qowt-eid',
            '777');

        expect(QOWTMarkerUtils.addQOWTMarker).toHaveBeenCalledWith(newDummyDiv,
            'shape-Id', '1');
      });

      it('-withNewDiv- should not call addQOWTMarker when shape-id is ' +
          'not defined', function() {
            var newDummyDiv = {
              style: {},
              setAttribute: function() {}
            };
            spyOn(document, 'createElement').andReturn(newDummyDiv);
            spyOn(QOWTMarkerUtils, 'addQOWTMarker');

            _graphicFrameDecorator.withNewDiv('777', undefined);

            expect(QOWTMarkerUtils.addQOWTMarker).not.toHaveBeenCalled();
          });
    });

    describe('-withTransforms- decorator test', function() {
      it('should re-evaluate extents and call Transform2D handler, when ' +
          'graphic frame in a group shape', function() {
            spyOn(Transform2DHandler, 'handle');
            var graphicFrameDiv = {};
            var transform = {
              ext: {
                cx: 2,
                cy: 5
              }
            };
            var groupShapeBean = {
              scale: {
                x: 3,
                y: 4
              }
            };
            _graphicFrameDecorator.withTransforms(transform, groupShapeBean,
                graphicFrameDiv);

            var expectedTransform = {
              ext: {
                cx: 6,
                cy: 20
              }
            };
            expect(Transform2DHandler.handle).toHaveBeenCalledWith(
                expectedTransform, groupShapeBean, graphicFrameDiv);
          });

      it('should re-evaluate extents and call Transform2D handler, when ' +
          'graphic frame in not any group shape', function() {
            spyOn(Transform2DHandler, 'handle');
            var graphicFrameDiv = {};
            var transform = {
              ext: {
                cx: 2,
                cy: 5
              }
            };
            _graphicFrameDecorator.withTransforms(transform, undefined,
                graphicFrameDiv);

            expect(Transform2DHandler.handle).toHaveBeenCalledWith(transform,
                undefined, graphicFrameDiv);
          });

      it('should set transforms correctly', function() {
        var graphicFrameDiv = {};
        var shapeJson = {
          elm: [],
          xfrm: {}
        };

        var transform = {
          ext: {
            cx: 2,
            cy: 5
          }
        };

        graphicFrameDiv.shapeJson = shapeJson;
        graphicFrameDiv.parentNode = 'some node';
        var graphicFrameDecorator = GraphicFrameDecorator.create();
        spyOn(graphicFrameDecorator, 'decorate').
            andReturn(_graphicFrameDecorator);
        spyOn(_graphicFrameDecorator, 'withTransforms');

        graphicFrameDecorator.setTransforms(graphicFrameDiv, transform);

        expect(graphicFrameDiv.shapeJson.xfrm).toEqual(transform);
        expect(_graphicFrameDecorator.withTransforms).toHaveBeenCalled();
      });
    });

    describe('-withChart- decorator test', function() {
      it('should populate chartId-to-chartDiv map in layouts-manager',
          function() {
            var graphicDiv = {}, slideDiv = {};
            spyOn(LayoutsManager, 'cacheChartInfo');

            _graphicFrameDecorator.withChart('chartId', graphicDiv, slideDiv);

            expect(LayoutsManager.cacheChartInfo).toHaveBeenCalledWith(
                'chartId', graphicDiv, slideDiv);
          });
    });
  });
});
