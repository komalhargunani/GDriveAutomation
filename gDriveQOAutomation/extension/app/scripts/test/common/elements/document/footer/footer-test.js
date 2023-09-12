define(['common/elements/document/footer/footer'], function() {
  'use strict';

  describe('<qowt-footer>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('footer-test-template');
      element = document.querySelector('qowt-footer');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

  });

  return {};
});
