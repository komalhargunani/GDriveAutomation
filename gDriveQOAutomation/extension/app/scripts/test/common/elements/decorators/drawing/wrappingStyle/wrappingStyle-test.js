define(function() {

  'use strict';

  describe('Wrapping style mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('wrapping-style-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#wrapping-style-test-element');
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

    it('Should add support for "wrappingStyle"', function() {
      assert(testEl_.supports('wrappingStyle'),
          'element supports wrappingStyle');
    });

    it('Should be possible to decorate drawing with wrapping styles',
        function() {
          var wrappingStyles = ['square', 'tight', 'through', 'topAndBottom',
            'behindText', 'inFrontOfText', 'inlineWithText'];

          var unset = {
            wrappingStyle: undefined
          };

          for (var i = 0; i < wrappingStyles.length; i++) {
            var props = {
              wrappingStyle: wrappingStyles[i]
            };

            // Decorate and verify.
            testEl_.decorate(props, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.wrappingStyle,
                props.wrappingStyle, 'after decorate');

            // Undecorate and verify.
            testEl_.decorate(unset, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.wrappingStyle, unset.wrappingStyle,
                'properties after undecorate');
          }
        });

    it('Should not decorate drawing with invalid wrapping style values',
        function() {
          var invalidWrappingStyle = {
            wrappingStyle: 'invalidWrappingStyle'
          };

          // Decorate and verify.
          testEl_.decorate(invalidWrappingStyle, true);
          decs_ = testEl_.getComputedDecorations();
          assert.deepEqual(decs_.wrappingStyle,
              undefined, 'after decorate');
        });
  });

  return {};

});
