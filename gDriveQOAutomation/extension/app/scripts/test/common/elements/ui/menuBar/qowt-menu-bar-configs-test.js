define([
      'common/elements/ui/menuBar/qowt-menu-bar/qowt-menu-bar-configs'
  ], function(
      Configs
  ) {

  'use strict';

  describe('qowt-menu-bar configs', function() {

    it('should be an object.', function() {
      assert.isObject(Configs);
    });
    it('should declare many items.', function() {
      assert.isTrue(Object.keys(Configs).length > 0, 'many items');
    });
    it('should declare an action for every item.', function() {
      for (var key in Configs) {
        assert.isDefined(Configs[key].action, 'checking action for ' + key);
        assert.property(Configs[key], 'action', 'checking action for ' + key);
        assert.isString(Configs[key].action, 'action string for ' + key);
      }
    });
  });
});
