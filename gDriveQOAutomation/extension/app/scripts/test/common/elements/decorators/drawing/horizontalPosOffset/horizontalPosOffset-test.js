define(function() {

  'use strict';

  describe('Horizontal position offset mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('horizontal-pos-offset-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#horizontal-pos-offset-test-element');
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

    it('Should add support for "horizontalPosOffset"', function() {
      assert(testEl_.supports('horizontalPosOffset'),
          'element supports horizontalPosOffset');
    });

    it('Should be possible to decorate drawing with horizontal position offset',
        function() {
          var unset = {
            horizontalPosOffset: undefined
          };

          var props = {
            horizontalPosOffset: 500
          };

          // Decorate and verify.
          testEl_.decorate(props, true);
          decs_ = testEl_.getComputedDecorations();
          assert.deepEqual(decs_.horizontalPosOffset,
              props.horizontalPosOffset, 'after decorate');
          assert.equal(testEl_.leftPos, '25pt', 'left position set correctly');

          // Undecorate and verify.
          testEl_.decorate(unset, true);
          assert.equal(testEl_.leftPos, '0pt', 'left position unset correctly');
        });

    it('Should not decorate drawing with invalid horizontal position offset',
        function() {
          var invalidHPosOffset = {
            horizontalPosOffset: ''
          };

          // Decorate and verify.
          testEl_.decorate(invalidHPosOffset, true);
          decs_ = testEl_.getComputedDecorations();
          assert.equal(decs_.horizontalPosOffset, '0',
              'horizontalPosOffset set to default');
          assert.equal(testEl_.leftPos, '0pt',
              'testEl_.leftPos set to default');
        });
  });

  return {};

});
