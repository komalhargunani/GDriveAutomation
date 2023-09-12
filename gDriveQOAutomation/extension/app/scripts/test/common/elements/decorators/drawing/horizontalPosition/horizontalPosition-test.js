define(function() {

  'use strict';

  describe('Horizontal position mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('horizontal-position-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#horizontal-pos-test-element');
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

    it('Should add support for "horizontalPosition"', function() {
      assert(testEl_.supports('horizontalPosition'),
          'element supports horizontalPosition');
    });

    it('Should be possible to decorate drawing with horizontal positions',
        function() {
          var hPositions = ['alignmentLeft', 'alignmentCenter',
            'alignmentRight', 'alignmentInside', 'alignmentOutside',
            'absolute'];

          var unset = {
            horizontalPosition: undefined
          };

          for (var i = 0; i < hPositions.length; i++) {
            var props = {
              horizontalPosition: hPositions[i]
            };

            // Decorate and verify.
            testEl_.decorate(props, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.horizontalPosition,
                props.horizontalPosition, 'after decorate');

            // Undecorate and verify.
            testEl_.decorate(unset, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.horizontalPosition, unset.horizontalPosition,
                'properties after undecorate');
          }
        });

    it('Should not decorate drawing with invalid horizontal position values',
        function() {
          var invalidHPosition = {
            horizontalPosition: 'invalidHPos'
          };

          // Decorate and verify.
          testEl_.decorate(invalidHPosition, true);
          decs_ = testEl_.getComputedDecorations();
          assert.deepEqual(decs_.horizontalPosition,
              undefined, 'after decorate');
        });
  });

  return {};

});
