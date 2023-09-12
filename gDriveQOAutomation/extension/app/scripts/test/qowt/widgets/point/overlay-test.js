define(['qowtRoot/widgets/point/overlay'], function(OverlayWidget) {

  'use strict';

  describe('Point overlay widget', function() {
    var shapeNode_;
    var shapeWidget_;
    var overlayWidget_;

    beforeEach(function() {
      // Mock shape widget
      shapeNode_ = document.createElement('div');
      shapeWidget_ = {
        getWidgetElement: function() { return shapeNode_; },
        getRotationAngle: function() {},
        isFlippedHorizontal: function() {},
        isFlippedVertical: function() {}
      };

      // Common code to all test cases
      overlayWidget_ = OverlayWidget.create({});
    });

    afterEach(function() {
      shapeNode_ = undefined;
      shapeWidget_ = undefined;
      overlayWidget_ = undefined;
    });


    it('should remove resize pins from handlers node while shape is dragging',
        function() {
          var handlerNode = document.createElement('div');
          handlerNode.setAttribute('qowt-divtype', 'handlers');
          var resizePinW = document.createElement('div');
          resizePinW.setAttribute('location', 'w');
          var resizePinE = document.createElement('div');
          resizePinE.setAttribute('location', 'e');
          var resizePinN = document.createElement('div');
          resizePinN.setAttribute('location', 'n');
          var resizePinS = document.createElement('div');
          resizePinS.setAttribute('location', 's');
          handlerNode.appendChild(resizePinW);
          handlerNode.appendChild(resizePinE);
          handlerNode.appendChild(resizePinN);
          handlerNode.appendChild(resizePinS);

          shapeNode_.appendChild(handlerNode);

          overlayWidget_.update(shapeWidget_);
          overlayWidget_.moveDragImage(shapeWidget_, 100, 100);

          var overlayNode = overlayWidget_.getWidgetElement();
          var shapeGhostNode = overlayNode.firstChild;
          var overlayHandlerNode = shapeGhostNode.firstChild;
          assert.strictEqual(overlayHandlerNode.childElementCount, 0,
              'resize pins removed, childcount for handler is 0');
        });
  });
});
