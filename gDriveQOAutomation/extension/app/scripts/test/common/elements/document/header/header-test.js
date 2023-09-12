define(['common/elements/document/header/header'], function() {
  'use strict';

  describe('<qowt-header>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('header-test-template');
      element = document.querySelector('qowt-header');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

  });

  return {};
});
