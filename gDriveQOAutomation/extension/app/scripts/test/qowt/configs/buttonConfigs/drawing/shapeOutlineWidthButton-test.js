define([
  'qowtRoot/configs/buttonConfigs/drawing/shapeOutlineWidthButton'
], function(
    Button) {

  'use strict';

  describe('Point: "shapeOutlineWidth" Button', function() {

    describe('Button configuration', function() {

      it('should be type dropdown', function() {
        assert.strictEqual(Button.type, 'dropdown');
      });

      it('should define the correct action', function() {
        assert.strictEqual(Button.action, 'modifyShapeOutlineWidth');
      });

      it('should define the correct values', function() {
        assert.isDefined(Button.items, 'items are defined');
      });

      it('should define the correct formatter', function() {
        assert.isDefined(Button.formatter, 'formatter is defined');
        assert.isFunction(Button.formatter, 'formatter is function');
      });

      it('should subscribe to selection changed signals', function() {
        assert.isDefined(Button.subscribe, 'subscribe is defined');
        assert.isDefined(Button.subscribe['qowt:selectionChanged'],
            'selectionChanged event is subscribed');
      });
    });
  });
});
