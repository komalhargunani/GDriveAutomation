define(['common/elements/document/break/pageBreak'], function() {
  'use strict';

  describe('Page Break', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('page-break-test-template');
      element = document.querySelector('[is="qowt-page-break"]');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should return correct element type', function() {
      assert.equal(element.etp, 'brk', 'should have correct element type');
    });
  });

  return {};
});
