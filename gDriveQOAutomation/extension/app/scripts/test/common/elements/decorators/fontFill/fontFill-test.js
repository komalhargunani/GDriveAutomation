define([], function() {

  'use strict';

  describe('Font fill mixin', function() {
    var testEl, decs;

    beforeEach(function() {
      this.stampOutTempl('font-fill-test-template');
      var td = this.getTestDiv();
      testEl = td.querySelector('#font-fill-test-element');
    });

    afterEach(function() {
      testEl = undefined;
    });

    it('Should extend the decoratorBase mixin', function() {
      assert.isFunction(testEl.decorate, 'should have decorate function');
      assert.isFunction(testEl.getComputedDecorations,
          'should have getComputedDecorations function');
    });

    it('Should add support for "fill"', function() {
      assert(testEl.supports('fill'), 'element supports fill');
    });

    it('Should be possible to decorate font fill', function() {
      var props = {
        fill: {
          type: 'solidFill',
          color: {type: 'srgbClr', clr: '#123456'}
        }
      };

      var unset = {
        fill: {
          type: 'solidFill',
          color: {type: 'srgbClr', clr: '#000000'}
        }
      };

      // Decorate and verify.
      testEl.decorate(props, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs, props, 'after decorate');
      assert.equal(testEl.style.color, 'rgb(18, 52, 86)', 'have font color');

      // Undecorate and verify.
      testEl.decorate({fill: undefined}, true);
      decs = testEl.getComputedDecorations();
      assert.deepEqual(decs, unset, 'properties after undecorate');
      assert.equal(testEl.style.color, '', 'have no font color');
    });

  });

  return {};

});
