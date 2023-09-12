define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/point',
  'qowtRoot/widgets/drawing/ghostShape',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/widgets/shape/resizeShapeDragHandler'
], function(PubSub, PointModel, GhostShape, ShapeWidget,
            ResizeShapeDragHandler) {

  'use strict';

  describe('Resize Shape Drag Handler', function() {
    var dragHandler_, shapeWidget_, shapeNode_, slideNode_;

    beforeEach(function() {
      // Mock a slide node
      slideNode_ = document.createElement('div');
      slideNode_.setAttribute('id', 'qowt-point-slide-1');

      // Mock a shape node
      shapeNode_ = document.createElement('div');
      shapeNode_.setAttribute('qowt-divtype', 'shape');
      // Create the widget
      var _config = {
        fromNode: shapeNode_
      };
      shapeWidget_ = ShapeWidget.create(_config);
    });

    describe('constructor:', function() {
      it('should initialize shape and slide nodes', function() {
        dragHandler_ = new ResizeShapeDragHandler(shapeWidget_, slideNode_);

        assert.deepEqual(dragHandler_.shape_, shapeWidget_,
            'shape widgets are equal');
        assert.deepEqual(dragHandler_.slideNode_, slideNode_,
            'slide nodes are equal');
      });
    });

    describe('Test Drag behavior', function() {
      var dummyDragEvent_, dummyLocationHandler_, dummyGhostShape_, shapeJson_,
          dummyShapeNode_, dummyContainerNode_;
      beforeEach(function() {
        dragHandler_ = new ResizeShapeDragHandler(shapeWidget_, slideNode_);
        PointModel.currentZoomScale = 1;
        dummyDragEvent_ = {
          clientX: 20,
          clientY: 40
        };
        dummyLocationHandler_ = {
          getAttribute: function(attr) {
            switch (attr) {
              case 'location':
                return dummyLocationHandler_;
            }
          }
        };
        dummyDragEvent_.target = dummyLocationHandler_;
        dummyGhostShape_ = {
          classList: {
            remove: function() {}
          }
        };
        shapeJson_ = {
          spPr: {
            xfrm: {
              flipH: true,
              flipV: false
            }
          },
          nvSpPr: {}
        };
        dummyShapeNode_ = {
          getBoundingClientRect: function() {
            return {left: 10, top: 10, height: 200, width: 200};
          },
          classList: {
            remove: function() {}
          }
        };
        dummyContainerNode_ = {
          getBoundingClientRect: function() {
            return {left: 0, top: 10};
          }
        };
      });

      describe('onMouseDown:', function() {
        it('should get location of target and display the ghostShape on ' +
            'onMouseDown', function() {
              sinon.stub(GhostShape, 'display');
              sinon.stub(GhostShape, 'getContainerNode').returns(
                  dummyContainerNode_);
              sinon.stub(GhostShape, 'getWidgetElement').returns(
                  dummyGhostShape_);
              sinon.stub(dragHandler_.shape_, 'getWidgetElement').returns(
                  dummyShapeNode_);
              sinon.stub(dragHandler_.shape_, 'getJson').returns(shapeJson_);
              dragHandler_.onMouseDown(dummyDragEvent_);
              assert.deepEqual(dragHandler_.locationNode_,
                  dummyLocationHandler_, 'location nodes are equal');
              assert.isTrue(GhostShape.display.calledOnce,
                  'display() called once');
              GhostShape.display.restore();
              GhostShape.getContainerNode.restore();
              GhostShape.getWidgetElement.restore();
              dragHandler_.shape_.getWidgetElement.restore();
              dragHandler_.shape_.getJson.restore();
            });
      });

      describe('onDrag:', function() {
        it('should set correct positions and resize ghost shape during onDrag',
            function() {
              sinon.stub(GhostShape, 'display');
              sinon.stub(GhostShape, 'getContainerNode').returns(
                  dummyContainerNode_);
              sinon.stub(GhostShape, 'getWidgetElement').returns(
                  dummyGhostShape_);
              sinon.stub(dragHandler_.shape_, 'getWidgetElement').returns(
                  dummyShapeNode_);
              sinon.stub(dragHandler_.shape_, 'getJson').returns(shapeJson_);
              dragHandler_.onMouseDown(dummyDragEvent_);

              sinon.stub(GhostShape, 'resize');
              dragHandler_.onDrag(dummyDragEvent_);
              assert.strictEqual(dragHandler_.x2_, 20,
                  'x2 resize coordinates match');
              assert.strictEqual(dragHandler_.y2_, 30,
                  'y2 resize coordinates match');
              assert.isTrue(GhostShape.resize.calledOnce,
                  'resize() called once');
              GhostShape.display.restore();
              GhostShape.getContainerNode.restore();
              GhostShape.getWidgetElement.restore();
              dragHandler_.shape_.getWidgetElement.restore();
              dragHandler_.shape_.getJson.restore();
              GhostShape.resize.restore();
            });
      });

      describe('onMouseUp:', function() {
        it('should restore ghost widget and request shapeResize action ' +
            'onMouseUp', function() {
              dummyGhostShape_ = {
                firstChild: shapeNode_,
                style: {
                  left: 0,
                  top: 0
                }
              };

              sinon.stub(GhostShape, 'getWidgetElement').returns(
                  dummyGhostShape_);
              sinon.stub(GhostShape, 'restore');
              sinon.stub(PubSub, 'publish');
              dragHandler_.onMouseUp(dummyDragEvent_);
              assert.isTrue(GhostShape.restore.calledOnce,
                  'restore() called once');
              assert.strictEqual(PubSub.publish.firstCall.args[0],
                  'qowt:requestAction',
                  'publish() called with correct event type');
              var eventData = PubSub.publish.firstCall.args[1];
              assert.strictEqual(eventData.action, 'modifyTransform',
                  'publish() called with correct action');
              assert.strictEqual(eventData.context.command.sn, 2,
                  'publish() called with correct slide number');
              GhostShape.getWidgetElement.restore();
              GhostShape.restore.restore();
              PubSub.publish.restore();
            });
      });
    });
  });
});
