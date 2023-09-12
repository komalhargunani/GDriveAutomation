define(['common/elements/image/wordImage'], function() {
  'use strict';

  describe('QowtWordImage', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('qowt-word-image-test-template');
      assert.isDefined(this.getTestDiv(), 'test div should be defined');
      element = this.getTestDiv().querySelector('[is="qowt-word-image"]');
    });

    afterEach(function() {
      element = undefined;
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'element should be QowtElement');
    });

    it('should mixin background image', function() {
      assert.isTrue(element.supports('src'), 'should support background image');
    });

    it('should mixin image height', function() {
      assert.isTrue(element.supports('hgt'), 'should support image height');
    });

    it('should mixin image width', function() {
      assert.isTrue(element.supports('wdt'), 'should support image width');
    });

    it('should mixin crop image', function() {
      assert.isTrue(element.supports('crop'), 'should support crop image');
    });
  });

  return {};
});
