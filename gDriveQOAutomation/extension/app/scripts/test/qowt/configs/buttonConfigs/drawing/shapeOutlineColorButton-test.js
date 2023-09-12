define([
  'qowtRoot/configs/buttonConfigs/drawing/shapeOutlineColorButton'
], function(
    Button) {

  'use strict';

  describe('Point: "shapeOutlineColor" Button', function() {

    describe('Button configuration', function() {

      it('should be type colorDropdown', function() {
        assert.strictEqual(Button.type, 'colorDropdown');
      });

      it('should define the correct action', function() {
        assert.strictEqual(Button.action, 'modifyShapeOutlineColor');
      });

      it('should define the correct values', function() {
        assert.isDefined(Button.items, 'items are defined');
      });

      it('should define the correct transformFunction', function() {
        assert.isDefined(Button.transformFunction, 'transformFunction defined');
        assert.isFunction(Button.transformFunction, 'transformFunction is ' +
            'function');
      });

      it('should subscribe to selection changed signals', function() {
        assert.isDefined(Button.subscribe, 'subscribe is defined');
        assert.isDefined(Button.subscribe['qowt:selectionChanged'],
            'selectionChanged event is subscribed');
        assert.isDefined(Button.subscribe['qowt:formattingChanged'],
            'formattingChanged event is subscribed');
      });
    });
  });
});
