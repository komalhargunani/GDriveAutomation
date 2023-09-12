define([
  'qowtRoot/configs/buttonConfigs/drawing/addShapeButton'
], function(AddShapeButton) {

  'use strict';

  describe('Point: "addShapeButton" buttonConfig', function() {
    describe('Basic configuration.', function() {
      it('should subscribe to presentation empty, non empty signals.',
          function() {
            assert.isDefined(AddShapeButton.
                subscribe['qowt:presentationNonEmpty'], 'subscribes to ' +
                'presentation non empty signal');
            assert.isDefined(AddShapeButton.
                subscribe['qowt:presentationEmpty'], 'subscribes to ' +
                'presentation empty signal');
          });
    });
  });
});
