define([
  'qowtRoot/dcp/decorators/shapeDecorator',
  'qowtRoot/dcp/pointHandlers/shapeHandler',
  'qowtRoot/presentation/placeHolder/placeHolderPropertiesManager',
  'qowtRoot/widgets/shape/shape'
], function(ShapeDecorator,
            ShapeHandler,
            PlaceHolderPropertiesManager,
            ShapeWidget) {

  'use strict';

  describe('Shape handler Test', function() {
    it('should not decorate shapeDiv if it does not contain transforms and ' +
        'should set the shape hidden ', function() {
          var shapeDiv = document.createElement('div');

          var parentDiv = {
            appendChild: function() {}
          };
          var visitable = {
            node: parentDiv,
            el: {
              etp: 'sp',
              eid: '123',
              spPr: {},
              nvSpPr: {}
            }
          };

          var shapeDecorator = {
            decorate: function() {
            }
          };
          var shapeWidget = {
            getWidgetElement: function() {},
            setJson: function() {}
          };

          var sandbox = sinon.sandbox.create();
          sandbox.stub(PlaceHolderPropertiesManager,
              'getResolvedShapeProperties');
          sandbox.stub(ShapeWidget, 'create').returns(shapeWidget);
          sandbox.stub(shapeWidget, 'getWidgetElement').returns(shapeDiv);

          sandbox.stub(ShapeDecorator, 'create').returns(shapeDecorator);
          sandbox.stub(shapeDecorator, 'decorate');

          ShapeHandler.visit(visitable);
          assert.isTrue(shapeDecorator.decorate.notCalled,
              'shape not decorated');
          assert.strictEqual(shapeDiv.getAttribute('hidden'), 'true',
              'shape hidden');
          sandbox.restore();
        });
  });
});
