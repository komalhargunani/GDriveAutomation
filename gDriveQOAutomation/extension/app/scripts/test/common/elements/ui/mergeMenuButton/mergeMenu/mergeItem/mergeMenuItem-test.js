define([
  'common/elements/ui/mergeMenuButton/mergeMenu/menuItem/mergeMenuItem'
], function(/* mergeMenuItem */) {

  'use strict';

  describe('Test QowtMergeMenuItem Polymer Element', function() {

    var mergeMenuItem_;

    beforeEach(function() {
      mergeMenuItem_ = new QowtMergeMenuItem();
    });


    afterEach(function() {
      mergeMenuItem_ = undefined;
    });


    it('should support Polymer constructor creation', function() {
      assert.isTrue(mergeMenuItem_ instanceof QowtMergeMenuItem);
    });


    it('should have the role as menuitem', function() {
      assert.strictEqual(mergeMenuItem_.getAttribute('role'), 'menuitem');
    });
  });
});
