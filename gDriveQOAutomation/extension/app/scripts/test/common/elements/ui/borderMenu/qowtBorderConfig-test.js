define([
  'common/elements/ui/borderMenu/qowtBorderConfig'
], function(
  Configs) {

  'use strict';

  describe('qowt-border configs', function() {

    it('should be an object.', function() {
      assert.isObject(Configs);
    });
    it('should declare many items.', function() {
      assert.isTrue(Object.keys(Configs).length > 0, 'many items');
    });
    it('should check that all config items are defined.', function() {
      for (var key in Configs) {
        assert.isDefined(Configs[key]);
      }
    });
  });
});
