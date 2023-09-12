define(function() {

  'use strict';

  describe('Wrap text style mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('wrap-text-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#wrap-text-test-element');
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

    it('Should add support for "wrapText"', function() {
      assert(testEl_.supports('wrapText'), 'element supports wrapText');
    });

    it('Should be possible to decorate drawing with wrap text options',
        function() {
          var wrapTextOptions = ['bothSides', 'leftOnly', 'rightOnly',
            'largestOnly'];

          // set horizontal position offset. findLargestAvailableSide_()
          // function access leftPos of drawing element.
          var setLeftPos = {
            horizontalPosOffset: 500
          };

          testEl_.decorate(setLeftPos, true);

          var unset = {
            wrapText: undefined
          };

          for (var i = 0; i < wrapTextOptions.length; i++) {
            var props = {
              wrapText: wrapTextOptions[i]
            };

            // Decorate and verify.
            testEl_.decorate(props, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.wrapText,
                props.wrapText, 'after decorate');

            // Undecorate and verify.
            testEl_.decorate(unset, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.wrapText, unset.wrapText,
                'properties after undecorate');
          }
        });

    it('Should not decorate drawing with invalid wrapping style values',
        function() {
          var invalidWrapText = {
            wrapText: 'invalidWrapText'
          };

          // Decorate and verify.
          testEl_.decorate(invalidWrapText, true);
          decs_ = testEl_.getComputedDecorations();
          assert.deepEqual(decs_.wrapText, undefined, 'after decorate');
        });
  });

  return {};

});
