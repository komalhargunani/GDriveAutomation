define([
  'qowtRoot/variants/utils/resourceLocator'
], function(ResourceLocator) {
  'use strict';

  describe('Background Image mixin', function() {
    var testEl_, decorators;

    beforeEach(function() {
      this.stampOutTempl('background-image-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#testElement');
      sinon.stub(ResourceLocator, 'pathToUrl').returns('someLocation');
    });

    afterEach(function() {
      testEl_ = undefined;
      decorators = undefined;
      ResourceLocator.pathToUrl.restore();
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl_.decorate, 'should have decorate function');
      assert.isFunction(testEl_.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "src"', function() {
      assert.isTrue(testEl_.supports('src'), 'element should supports' +
          ' background image');
    });

    it('Should be possible to decorate and undecorate background' +
        ' image',function() {
      var props = {
        src: '/img_E13.jpg'
      };

      var unset = {
        src: undefined
      };

      // Decorate and verify.
      testEl_.decorate(props, true);

      decorators = testEl_.getComputedDecorations();
      assert.deepEqual(decorators.src, 'url("someLocation")', 'should set ' +
          'the properties when decorated.');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      decorators = testEl_.getComputedDecorations();
      assert.deepEqual(decorators.src, '', 'should unset the properties' +
          ' when undecorated.');
    });
  });

  return {};
});
