define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/models/point',
  'qowtRoot/widgets/point/overlay',
  'qowtRoot/widgets/shape/shape',
  'qowtRoot/widgets/shape/moveShapeDragHandler'
], function(PubSub, PointModel, OverlayWidget, ShapeWidget,
            MoveShapeDragHandler) {

  'use strict';

  describe('Move Shape Drag Handler', function() {
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
      it('should create overlay widget upon creation', function() {
        var dummyOverlayWidget = {};
        sinon.stub(OverlayWidget, 'create').returns(dummyOverlayWidget);
        dragHandler_ = new MoveShapeDragHandler(shapeWidget_, slideNode_);

        assert.deepEqual(dragHandler_.shape_, shapeWidget_,
            'shape widgets are equal');
        assert.isNull(dragHandler_.x_, 'x co-ordinate initialized to null');
        assert.isNull(dragHandler_.y_, 'y co-ordinate initialized to null');
        assert.isTrue(OverlayWidget.create.calledOnce,
            'overlay widget created once');
        assert.deepEqual(dragHandler_.overlay_, dummyOverlayWidget,
            'overlay widgets are equal');
        OverlayWidget.create.restore();
      });
    });

    describe('Test Drag behavior', function() {
      var dummyDragEvent_;
      beforeEach(function() {
        dragHandler_ = new MoveShapeDragHandler(shapeWidget_, slideNode_);
        PointModel.currentZoomScale = 1;
        dummyDragEvent_ = {
          clientX: 20,
          clientY: 40
        };
      });

      describe('onDragStart:', function() {
        it('should update and show the overlay widget for dragging on ' +
            'onDragStart', function() {
              var dummyShapeNode = {
                appendChild: function() {}
              };

              sinon.stub(dragHandler_.shape_, 'getWidgetElement').returns(
                  dummyShapeNode);
              sinon.stub(dragHandler_.overlay_, 'getWidgetElement').returns({});
              sinon.stub(dragHandler_.overlay_, 'update');
              sinon.stub(dragHandler_.overlay_, 'setVisible');
              sinon.stub(dummyShapeNode, 'appendChild');
              dragHandler_.onDragStart(dummyDragEvent_);
              assert.isTrue(dragHandler_.shape_.getWidgetElement.calledOnce,
                  'getWidgetElement called once');
              assert.isTrue(dragHandler_.overlay_.update.calledOnce,
                  'overlay.update called once');
              assert.deepEqual(dragHandler_.overlay_.update.firstCall.args[0],
                  dragHandler_.shape_,
                  'overlay update called with correct widget');
              assert.isTrue(dragHandler_.overlay_.setVisible.calledOnce,
                  'overlay.setVisible called once');
              assert.strictEqual(dragHandler_.overlay_.setVisible.
                  firstCall.args[0], true,
                  'overlay setVisible called with correct value');
              var dummyOverlayWidget = dragHandler_.overlay_.getWidgetElement();
              assert.isTrue(dummyShapeNode.appendChild.calledOnce,
                  'appendChild called once');
              assert.deepEqual(dummyShapeNode.appendChild.firstCall.args[0],
                  dummyOverlayWidget,
                  'appendChild called with correct element');
              dragHandler_.shape_.getWidgetElement.restore();
              dragHandler_.overlay_.getWidgetElement.restore();
              dragHandler_.overlay_.update.restore();
              dragHandler_.overlay_.setVisible.restore();
              dummyShapeNode.appendChild.restore();
            });
      });

      describe('onDrag:', function() {
        it('should ask the overlay widget to move the ghost image while ' +
            'dragging in onDrag', function() {
              sinon.stub(dragHandler_.overlay_, 'moveDragImage');
              dragHandler_.onDrag(dummyDragEvent_);
              assert.isTrue(dragHandler_.overlay_.moveDragImage.calledOnce,
                  'moveDragImage called once');
              assert.deepEqual(dragHandler_.overlay_.moveDragImage.
                  firstCall.args[0], dragHandler_.shape_,
                  'moveDragImage called with correct widget');
              assert.strictEqual(dragHandler_.overlay_.moveDragImage.
                  firstCall.args[1], 20,
                  'moveDragImage called with correct x coordinate');
              assert.strictEqual(dragHandler_.overlay_.moveDragImage.
                  firstCall.args[2], 40,
                  'moveDragImage called with correct y coordinate');
              dragHandler_.overlay_.moveDragImage.restore();
            });
      });

      describe('onDragEnd:', function() {
        it('should ask the overlay widget to hide the ghost image and ' +
            'request shapeMove action onDragEnd', function() {
              sinon.stub(dragHandler_.overlay_, 'hideDragImage');
              sinon.stub(shapeNode_, 'removeChild');
              sinon.stub(PubSub, 'publish');
              dragHandler_.onDragEnd(dummyDragEvent_);
              assert.isTrue(dragHandler_.overlay_.hideDragImage.calledOnce,
                  'hideDragImage called once');
              assert.strictEqual(PubSub.publish.firstCall.args[0],
                  'qowt:requestAction', 'publish() called with correct event');
              var eventData = PubSub.publish.firstCall.args[1];
              assert.strictEqual(eventData.action, 'modifyTransform',
                  'publish() called with correct action');
              assert.strictEqual(eventData.context.command.sn, 2,
                  'publish() called with correct slide number');
              dragHandler_.overlay_.hideDragImage.restore();
              shapeNode_.removeChild.restore();
              PubSub.publish.restore();
            });
      });
    });
  });
});
