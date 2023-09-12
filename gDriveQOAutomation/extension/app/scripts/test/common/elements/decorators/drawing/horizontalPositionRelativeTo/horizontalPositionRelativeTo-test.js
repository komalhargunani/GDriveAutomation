define(function() {

  'use strict';

  describe('Relative horizontal position mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('horizontal-pos-relative-to-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#horizontal-pos-relative-to-test-element');
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

    it('Should add support for "horizontalPositionRel"', function() {
      assert(testEl_.supports('horizontalPositionRel'),
          'element supports horizontalPositionRel');
    });

    it('Should decorate drawing with relative horizontal positions',
        function() {
          var hPosRelativeTo = ['character', 'column', 'page', 'margin',
            'leftMargin', 'rightMargin', 'insideMargin', 'outsideMargin'];

          var unset = {
            horizontalPositionRel: undefined
          };

          for (var i = 0; i < hPosRelativeTo.length; i++) {
            var props = {
              horizontalPositionRel: hPosRelativeTo[i]
            };

            // Decorate and verify.
            testEl_.decorate(props, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.horizontalPositionRel,
                props.horizontalPositionRel, 'after decorate');

            // Undecorate and verify.
            testEl_.decorate(unset, true);
            decs_ = testEl_.getComputedDecorations();
            assert.deepEqual(decs_.horizontalPositionRel,
                unset.horizontalPositionRel, 'properties after undecorate');
          }
        });

    it('Should not decorate drawing with invalid horizontal position relative' +
        ' to values',
        function() {
          var invalidHPosRelativeTo = {
            horizontalPositionRel: 'invalidHPosRel'
          };

          // Decorate and verify.
          testEl_.decorate(invalidHPosRelativeTo, true);
          decs_ = testEl_.getComputedDecorations();
          assert.deepEqual(decs_.horizontalPosition,
              undefined, 'after decorate');
        });
  });

  return {};

});
