define([
  'common/elements/text/run/point/pointRun'], function() {
  'use strict';

  describe('<qowt-point-run>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('point-run-test-template');
      element = document.querySelector('[is="qowt-point-run"]');
    });

    it('should return correct element type', function() {
      assert.equal(element.etp, 'txrun', 'should have correct element type');
    });

  });

  return {};
});
