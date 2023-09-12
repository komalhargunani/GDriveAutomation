// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for shape widget
 * @author bhushan.shitole@synerzip.com (Bhushan Shitole)
 */

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/qowtMarkerUtils',
  'qowtRoot/widgets/shape/shapeTextBody',
  'qowtRoot/dcp/decorators/shapeDecorator',
  'qowtRoot/models/point',
  'qowtRoot/dcp/decorators/graphicFrameDecorator'
], function(
    UnitTestUtils,
    ShapeWidget,
    PubSub,
    QOWTMarkerUtils,
    ShapeTextBodyWidget,
    ShapeDecorator,
    PointModel,
    GraphicFrameDecorator) {

  'use strict';

  describe('Shape widget Tests', function() {
    var _shapeWidget, _shapeNode, _config, _textBodyNode, _shapeTextBodyWidget,
        _graphicFrameDecorator, _testArea;

    beforeEach(function() {
      _testArea = UnitTestUtils.createTestAppendArea();
      // Mock a shape node with text body
      _shapeNode = new QowtPointShape();
      _testArea.appendChild(_shapeNode);
      _shapeNode.id = 'E111';
      _textBodyNode = window.document.createElement('div');
      _textBodyNode.setAttribute('qowt-divtype', 'textBox');
      _shapeNode.appendChild(_textBodyNode);

      _graphicFrameDecorator = {
        setTransforms: function() {}
      };
      spyOn(GraphicFrameDecorator, 'create').andReturn(_graphicFrameDecorator);

      // Mock the ShapeTextBody widget
      _shapeTextBodyWidget = {
        getWidgetElement: function() { return _textBodyNode; }
      };
      spyOn(ShapeTextBodyWidget, 'create').andReturn(_shapeTextBodyWidget);

      // Create the widget
      _config = {
        fromNode: _shapeNode
      };
      _shapeWidget = ShapeWidget.create(_config);
    });

    afterEach(function() {
      _shapeWidget = undefined;
      _shapeNode = undefined;
      _textBodyNode = undefined;
      _config = undefined;
      _testArea = undefined;
      UnitTestUtils.removeTestAppendArea();
    });

    it('should properly create shape widget from shape by using it\'s string ' +
        'id', function() {
          var shapeWidget,
              shapeId = _shapeNode.id;

          expect(function() {
            shapeWidget = ShapeWidget.create({
              fromId: shapeId
            });
          }).not.toThrow();
          expect(shapeWidget).toBeDefined();
          expect(shapeWidget.getWidgetElement()).toBeDefined();
          expect(shapeWidget.getWidgetElement().id).toBe(shapeId);
        });

    it('should properly create shape widget from shape by using it\'s ' +
        'numbered id', function() {
          var shapeWidget,
              shapeId = '111';

          _shapeNode.id = shapeId;

          expect(function() {
            shapeWidget = ShapeWidget.create({
              fromId: shapeId
            });
          }).not.toThrow();
          expect(shapeWidget).toBeDefined();
          expect(shapeWidget.getWidgetElement()).toBeDefined();
          expect(shapeWidget.getWidgetElement().id).toBe(shapeId);
        });

    it('should return false for a non-placeholder shape', function() {
      expect(_shapeWidget.isPlaceholderShape()).toEqual(false);
    });

    it('should return true for a placeholder shape', function() {
      QOWTMarkerUtils.addQOWTMarker(_shapeNode, 'ph', 'ctrTitle_1');

      expect(_shapeWidget.isPlaceholderShape()).toEqual(true);
    });

    it('should get correct eid', function() {
      var shapeId = '111';
      _shapeNode.setAttribute('qowt-eid', shapeId);

      expect(_shapeWidget.getEid()).toEqual(shapeId);
    });

    it('should return undefined for a non-placeholder shape', function() {
      _shapeWidget = ShapeWidget.create(_config);

      expect(_shapeWidget.getPlaceholderType()).toBeUndefined();
    });

    it('should return correct placeholder type for a placeholder shape',
        function() {
          QOWTMarkerUtils.addQOWTMarker(_shapeNode, 'ph', 'ctrTitle_1');

          _shapeWidget = ShapeWidget.create(_config);

          expect(_shapeWidget.getPlaceholderType()).toEqual('ctrTitle');
        });

    it('should return undefined for a non-placeholder shape', function() {
      _shapeWidget = ShapeWidget.create(_config);

      expect(_shapeWidget.getPlaceholderIndex()).toBeUndefined();
    });

    it('should return correct placeholder index for a placeholder shape',
        function() {
          QOWTMarkerUtils.addQOWTMarker(_shapeNode, 'ph', 'body_1');

          _shapeWidget = ShapeWidget.create(_config);

          expect(_shapeWidget.getPlaceholderIndex()).toEqual('1');
        });

    it('should return correct widget shape node when shape widget is' +
        ' initialized', function() {
         _shapeWidget = ShapeWidget.create(_config);

         expect(_shapeWidget.getWidgetElement()).toEqual(_shapeNode);
       });

    it('should have handlers on select', function() {
      _shapeWidget.select();
      var handlers = _shapeNode.querySelector('[qowt-divtype=handlers]');
      expect(handlers).toBeDefined();
    });

    it('should not have handlers on deselect', function() {
      _shapeWidget.select();
      _shapeWidget.deselect();
      var handlers = _shapeNode.querySelector('[qowt-divtype=handlers]');
      expect(!!handlers).toBe(false);
    });

    it('should set placeholder properties on select for placeholder shape',
        function() {
          QOWTMarkerUtils.addQOWTMarker(_shapeNode, 'ph', 'body_1');
          _shapeWidget.select();

          expect(PointModel.CurrentPlaceHolderAtSlide.phTyp).toEqual('body');
          expect(PointModel.CurrentPlaceHolderAtSlide.phIdx).toEqual('1');
        });

    it('should reset placeholder properties on select for non-placeholder ' +
        'shape', function() {
          _shapeWidget.select();

          expect(PointModel.CurrentPlaceHolderAtSlide.phTyp).toBeUndefined();
          expect(PointModel.CurrentPlaceHolderAtSlide.phIdx).toBeUndefined();
        });

    it('should set new transforms to shape node', function() {
      var offset = {x: 1270000, y: 1270000};
      var extents = {cx: 952500, cy: 952500};
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
        off: offset,
        ext: extents,
        flipH: false,
        flipV: false
      };
      _shapeNode.setAttribute('qowt-divtype', 'shape');
      _shapeNode.shapeJson = shapeJson;

      _shapeWidget.setTransforms(xfrm);
      expect(parseFloat(_shapeNode.style.left)).toEqual(100);
      expect(parseFloat(_shapeNode.style.top)).toEqual(100);

      expect(parseFloat(_shapeNode.style.width)).toEqual(100);
      expect(parseFloat(_shapeNode.style.height)).toEqual(100);
    });

    it('should set new fill to shape node', function() {
      var _shapeDecorator = {
        setFill: function() {
        }
      };

      spyOn(ShapeDecorator, 'create').andReturn(_shapeDecorator);
      var _tempShapeWidget = ShapeWidget.create(_config);
      var shapeJson = {
        spPr: {
          fill: {
          }
        }
      };
      spyOn(_shapeDecorator, 'setFill');
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
      _shapeNode.shapeJson = shapeJson;
      _tempShapeWidget.setFill(fill);
      expect(_shapeDecorator.setFill).toHaveBeenCalledWith(_shapeNode, fill);
    });

    it('should get fill from shape node', function() {
      var shapeJson = {
        spPr: {
          fill: {
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
          }
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
      _shapeNode.shapeJson = shapeJson;
      expect(_shapeWidget.getFill()).toEqual(fill);
    });

    it('should get correct rotation angle of shape', function() {
      _shapeNode.style['-webkit-transform'] = 'rotate(30deg)';
      var expectedRotationValue = _shapeWidget.getRotationAngle();

      expect(expectedRotationValue).toEqual(30);
    });

    it('should return true for horizontal flipped shape', function() {
      _shapeNode.style['-webkit-transform'] = 'scale(-1, 1)';
      var expectedFlippedValue = _shapeWidget.isFlippedHorizontal();

      expect(expectedFlippedValue).toEqual(true);
    });

    it('should return true for vertical flipped shape', function() {
      _shapeNode.style['-webkit-transform'] = 'scale(1, -1)';
      var expectedFlippedValue = _shapeWidget.isFlippedVertical();

      expect(expectedFlippedValue).toEqual(true);
    });

    it('should focus shape node on select', function() {
      _shapeWidget.select();
      expect(document.activeElement).toEqual(_shapeNode);
    });

    it('should set tab index -1 on select', function() {
      _shapeNode.tabIndex = 1;
      _shapeWidget.select();
      expect(_shapeNode.tabIndex).toEqual(-1);
    });

    it('should requestFocusLost upon deselect', function() {
      spyOn(PubSub, 'publish').andCallThrough();
      _shapeWidget.select();
      _shapeWidget.deselect();
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:requestFocusLost',
          {contentType: 'shape'});
    });

    it('should set new transforms to chart', function() {
      var offset = {x: 1270000, y: 1270000};
      var extents = {cx: 952500, cy: 952500};
      var xfrm = {
        off: offset,
        ext: extents,
        flipH: false,
        flipV: false
      };
      _shapeNode.setAttribute('qowt-divtype', 'grFrm');
      spyOn(_graphicFrameDecorator, 'setTransforms');

      _shapeWidget.setTransforms(xfrm);

      expect(_graphicFrameDecorator.setTransforms).toHaveBeenCalled();
    });

    it('should return proper shape text body widget', function() {
      var textBodyWidget = _shapeWidget.getShapeTextBodyWidget();
      expect(textBodyWidget).toBeDefined();
    });

    it('should return correct location div', function() {
      _shapeWidget.select();

      var westLocationDiv = _shapeWidget.getLocationDiv('w');
      var eastLocationDiv = _shapeWidget.getLocationDiv('e');

      expect(westLocationDiv.getAttribute('location')).toEqual('w');
      expect(eastLocationDiv.getAttribute('location')).toEqual('e');
    });

    it('should set correct flips for handlers node on select', function() {
      _shapeNode.style['-webkit-transform'] = 'scale(-1, -1)';
      _shapeWidget.select();
      var handlers = _shapeNode.querySelector('[qowt-divtype=handlers]');

      expect(handlers.style['-webkit-transform']).toEqual('scale(-1, -1)');
    });

    it('should not append resize handlers for rotated shape', function() {
      _shapeNode.style['-webkit-transform'] = 'rotate(30deg)';

      _shapeWidget.select();

      var handlers = _shapeNode.querySelector('[qowt-divtype=handlers]');

      expect(handlers.childElementCount).toEqual(0);
    });

  });
});
