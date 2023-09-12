define(function() {

  'use strict';

  describe('Vertical position offset mixin', function() {
    var testEl_, decs_;

    beforeEach(function() {
      this.stampOutTempl('vertical-pos-offset-decorator-test-template');
      var td = this.getTestDiv();
      testEl_ = td.querySelector('#vertical-pos-offset-test-element');
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

    it('Should add support for "verticalPosOffset"', function() {
      assert(testEl_.supports('verticalPosOffset'),
          'element supports verticalPosOffset');
    });

    it('Should be possible to decorate drawing with vertical position offset',
        function() {
          var unset = {
            verticalPosOffset: undefined
          };

          var props = {
            verticalPosOffset: 200
          };

          // Decorate and verify.
          testEl_.decorate(props, true);
          decs_ = testEl_.getComputedDecorations();
          assert.deepEqual(decs_.verticalPosOffset,
              props.verticalPosOffset, 'after decorate');
          assert.equal(testEl_.topPos, '10pt', 'top position set correctly');

          // Undecorate and verify.
          testEl_.decorate(unset, true);
          assert.equal(testEl_.topPos, '0pt', 'top position unset correctly');
        });

    it('Should not decorate drawing with invalid vertical position offset',
        function() {
          var invalidHPosOffset = {
            verticalPosOffset: ''
          };

          // Decorate and verify.
          testEl_.decorate(invalidHPosOffset, true);
          decs_ = testEl_.getComputedDecorations();
          assert.equal(decs_.verticalPosOffset, '0',
              'verticalPosOffset set to default');
          assert.equal(testEl_.topPos, '0pt', 'testEl_.topPos set to default');
        });
  });

  return {};

});
