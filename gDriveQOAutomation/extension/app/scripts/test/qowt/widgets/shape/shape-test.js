define([
  'qowtRoot/models/point',
  'qowtRoot/presentation/placeHolder/placeHolderManager',
  'qowtRoot/widgets/shape/shape'
], function(
    PointModel,
    PlaceHolderManager,
    ShapeWidget) {

  'use strict';

  describe('Shape Widget Test', function() {

    var shapeWidget_, sandbox_;

    beforeEach(function() {
      var shapeTextBodyNode = document.createElement('div');
      shapeWidget_ = ShapeWidget.create({fromNode: shapeTextBodyNode});
      sandbox_ = sinon.sandbox.create();
    });

    afterEach(function() {
      shapeWidget_ = undefined;
      sandbox_.restore();
    });

    it('should update the placeholder properties', function() {
      sandbox_.stub(shapeWidget_, 'isPlaceholderShape').returns(true);
      sandbox_.stub(shapeWidget_, 'getPlaceholderType').returns('title');
      sandbox_.stub(shapeWidget_, 'getPlaceholderIndex').returns('1');
      sandbox_.stub(PlaceHolderManager, 'updateCurrentPlaceHolderForShape');

      shapeWidget_.updatePlaceholderProperties();
      assert.isTrue(PlaceHolderManager.updateCurrentPlaceHolderForShape.
          calledWith('title', '1'), 'update placeholder properties');
    });

    it('should reset the placeholder properties if shape is not a placeholder' +
        ' shape', function() {
          sandbox_.stub(shapeWidget_, 'isPlaceholderShape').returns(false);
          sandbox_.stub(PlaceHolderManager, 'resetCurrentPlaceHolderForShape');

          shapeWidget_.updatePlaceholderProperties();
          assert.isTrue(PlaceHolderManager.resetCurrentPlaceHolderForShape.
              calledOnce, 'reset placeholder properties');
        });

    it('should update the layout ID for placeholders', function() {
      var slideElement = document.createElement('div');
      slideElement.setAttribute('qowt-divtype', 'slide');
      slideElement.setAttribute('sldlt', 'E111');
      slideElement.appendChild(shapeWidget_.getWidgetElement());

      sandbox_.stub(shapeWidget_, 'isPlaceholderShape').returns(true);
      sandbox_.stub(PlaceHolderManager, 'updateCurrentPlaceHolderForShape');

      assert.isUndefined(PointModel.SlideLayoutId, 'initial layout ID value');
      shapeWidget_.updatePlaceholderProperties();
      assert.strictEqual(PointModel.SlideLayoutId, 'E111', 'updated layout ID');
    });

  });
});
