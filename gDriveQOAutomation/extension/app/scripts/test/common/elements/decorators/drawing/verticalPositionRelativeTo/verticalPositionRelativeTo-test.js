define(function() {

  'use strict';

  describe('Relative vertical position mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('vertical-pos-relative-to-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#vertical-pos-relative-to-test-element');
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

    it('Should add support for "verticalPositionRel"', function() {
      assert(testEl_.supports('verticalPositionRel'),
          'element supports verticalPositionRel');
    });

    it('Should decorate drawing with relative vertical positions',
        function() {
          var vPosRelativeTo = ['line', 'paragraph', 'page', 'margin',
            'insideMargin', 'outsideMargin', 'topMargin', 'bottomMargin'];

          var unset = {
            verticalPositionRel: undefined
          };

          for (var i = 0; i < vPosRelativeTo.length; i++) {
            var props = {
              verticalPositionRel: vPosRelativeTo[i]
            };

            // Decorate and verify.
            testEl_.decorate(props, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.verticalPositionRel,
                props.verticalPositionRel, 'after decorate');

            // Undecorate and verify.
            testEl_.decorate(unset, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.verticalPositionRel,
                unset.verticalPositionRel, 'properties after undecorate');
          }
        });

    it('Should not decorate drawing with invalid vertical position relative' +
        ' to values', function() {
          var invalidVPosRelativeTo = {
            verticalPositionRel: 'invalidHPosRel'
          };

          // Decorate and verify.
          testEl_.decorate(invalidVPosRelativeTo, true);
          decs_ = testEl_.getComputedDecorations();
          assert.deepEqual(decs_.verticalPositionRel,
              undefined, 'after decorate');
        });
  });

  return {};

});
