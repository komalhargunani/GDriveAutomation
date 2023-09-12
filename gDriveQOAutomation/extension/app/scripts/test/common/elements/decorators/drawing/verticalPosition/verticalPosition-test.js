define(function() {

  'use strict';

  describe('Vertical position mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('vertical-position-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#vertical-pos-test-element');
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

    it('Should add support for "verticalPosition"', function() {
      assert(testEl_.supports('verticalPosition'),
          'element supports verticalPosition');
    });

    it('Should be possible to decorate drawing with vertical positions',
        function() {
          var vPositions = ['alignmentTop', 'alignmentCentered',
            'alignmentBottom', 'alignmentInside', 'alignmentOutside',
            'absolute'];

          var unset = {
            verticalPosition: undefined
          };

          for (var i = 0; i < vPositions.length; i++) {
            var props = {
              verticalPosition: vPositions[i]
            };

            // Decorate and verify.
            testEl_.decorate(props, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.verticalPosition,
                props.verticalPosition, 'after decorate');

            // Undecorate and verify.
            testEl_.decorate(unset, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.verticalPosition, unset.verticalPosition,
                'properties after undecorate');
          }
        });

    it('Should not decorate drawing with invalid vertical position values',
        function() {
          var invalidVPosition = {
            verticalPosition: 'invalidVPos'
          };

          // Decorate and verify.
          testEl_.decorate(invalidVPosition, true);
          decs_ = testEl_.getComputedDecorations();
          assert.deepEqual(decs_.verticalPosition, undefined, 'after decorate');
        });
  });

  return {};

});
