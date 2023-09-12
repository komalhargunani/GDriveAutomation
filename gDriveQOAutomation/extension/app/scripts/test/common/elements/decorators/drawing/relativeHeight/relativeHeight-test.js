define(function() {

  'use strict';

  describe('Relative height mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('relative-height-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#relative-height-test-element');
    });

    afterEach(function() {
      testEl_ = undefined;
      decs_ = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl_.decorate, 'should have decorate function');
      assert.isFunction(testEl_.getComputedDecorations,
        'should have getComputedDecorations function');
    });

    it('Should add support for "relativeHeight"', function() {
      assert(testEl_.supports('relativeHeight'),
        'element supports relativeHeight');
    });

    it('Should be possible to decorate drawing object with negative ' +
      'relativeHeight', function() {
        var unset = {
          relativeHeight: undefined
        };

        var props = {
          relativeHeight: -2
        };

        // Decorate and verify.
        testEl_.decorate(props, true);

        decs_ = testEl_.getComputedDecorations();
        assert.deepEqual(decs_.relativeHeight,
          props.relativeHeight, 'after decorate');

        // Undecorate and verify.
        testEl_.decorate(unset, true);
        assert.equal(testEl_.relativeHeight, undefined,
          'relativeHeight unset correctly');
      });

    it('Should be possible to decorate drawing object with positive ' +
      'relativeHeight', function() {
      var unset = {
        relativeHeight: undefined
      };

      var props = {
        relativeHeight: 1
      };

      // Decorate and verify.
      testEl_.decorate(props, true);

      decs_ = testEl_.getComputedDecorations();
      assert.deepEqual(decs_.relativeHeight,
        props.relativeHeight, 'after decorate');

      // Undecorate and verify.
      testEl_.decorate(unset, true);
      assert.equal(testEl_.relativeHeight, undefined,
        'relativeHeight unset correctly');
    });

  });

  return {};

});
