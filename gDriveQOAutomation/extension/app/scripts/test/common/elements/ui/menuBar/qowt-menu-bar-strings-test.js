define([
      'common/elements/ui/menuBar/qowt-menu-bar/qowt-menu-bar-strings'
  ], function(
      Strings
  ) {

  'use strict';

  describe('qowt-menu-bar strings', function() {

    it('should be an object.', function() {
      assert.isObject(Strings);
    });

    it('should declare many items.', function() {
      assert.isTrue(Object.keys(Strings).length > 0, 'many items');
    });
  });
});
