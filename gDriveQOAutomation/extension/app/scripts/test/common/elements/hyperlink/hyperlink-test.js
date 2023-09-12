define(['common/elements/hyperlink/hyperlink'], function() {
  'use strict';

  describe('<qowt-hyperlink>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('qowt-hyperlink-test-template');
      element = this.getTestDiv().querySelector('[is="qowt-hyperlink"]');
    });

    afterEach(function() {
      element = undefined;
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should mixin FlowChildren algorithm', function() {
      assert.isTrue(element.supports('flow-children'), 'support flow');
    });

    it('should mixin link', function() {
      assert.isTrue(element.supports('lnk'), 'support link reference');
    });

  });

  return {};
});
