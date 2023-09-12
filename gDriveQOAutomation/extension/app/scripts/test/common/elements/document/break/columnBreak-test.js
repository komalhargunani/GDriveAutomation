define(['common/elements/document/break/columnBreak'], function() {
  'use strict';

  describe('Column Break', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('column-break-test-template');
      element = document.querySelector('[is="qowt-column-break"]');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

  });

  return {};
});
