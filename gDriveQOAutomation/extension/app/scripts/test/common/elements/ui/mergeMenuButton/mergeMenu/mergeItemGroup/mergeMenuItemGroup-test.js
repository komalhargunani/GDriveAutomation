define([
  'common/elements/ui/mergeMenuButton/mergeMenu/menuItemGroup/' +
      'mergeMenuItemGroup'
], function(/* mergeMenuItemGroup */) {

  'use strict';

  describe('Test QowtMergeMenuItemGroup Polymer Element', function() {

    var mergeMenuItemGroup_;

    beforeEach(function() {
      mergeMenuItemGroup_ = new QowtMergeMenuItemGroup();
    });


    afterEach(function() {
      mergeMenuItemGroup_ = undefined;
    });


    it('should support Polymer constructor creation', function() {
      assert.isTrue(mergeMenuItemGroup_ instanceof QowtMergeMenuItemGroup);
    });
  });
});
