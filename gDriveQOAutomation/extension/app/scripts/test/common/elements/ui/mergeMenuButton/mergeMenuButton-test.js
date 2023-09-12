define([
  'common/elements/ui/mergeMenuButton/mergeMenu/mergeMenuButton'
], function(/* mergeMenuButton */) {

  'use strict';

  describe('QowtMergeMenuButton Polymer Element', function() {

    var mergeMenuButton;

    beforeEach(function() {
      mergeMenuButton = new QowtMergeMenuButton();
    });


    afterEach(function() {
      mergeMenuButton = undefined;
    });


    it('should support Polymer constructor creation', function() {
      assert.isTrue(mergeMenuButton instanceof QowtMergeMenuButton);
    });
  });
});
