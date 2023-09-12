define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'LineSpacing decorator mixin',
      'line-spacing-decorator', function() {

    var minimumLineSpacing = {
      lsp: {
        m: 'minimum',
        v: 0
      }
    };
    var exactLineSpacing = {
      lsp: {
        m: 'exact',
        v: 240
      }
    };
    var multiplierLineSpacing = {
      lsp: {
        m: 'multiplier',
        v: 400
      }
    };
    var unset = {
      lsp: undefined
    };

    this.shouldSupport('lsp');

    this.shouldDecorate(
      'Should be possible to decorate minimum line spacing', minimumLineSpacing,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, minimumLineSpacing, 'after decorate');
        assert.notEqual(el.style.lineHeight, '', 'after decorate');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'after undecorate');
        assert.equal(el.style.lineHeight, '', 'after undecorate');
      }
    );

    this.shouldDecorate(
      'Should be possible to decorate exact line spacing', exactLineSpacing,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, exactLineSpacing, 'after decorate');
        assert.notEqual(el.style.lineHeight, '', 'after decorate');
        assert.notEqual(el.style.lineHeight, 'normal', 'after decorate');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'after undecorate');
        assert.equal(el.style.lineHeight, '', 'after undecorate');
      }
    );

    this.shouldDecorate(
      'Should be possible to decorate multiplier line ', multiplierLineSpacing,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, multiplierLineSpacing, 'after decorate');
        assert.notEqual(el.style.lineHeight, '', 'after decorate');
        assert.notEqual(el.style.lineHeight, 'normal', 'after decorate');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'after undecorate');
        assert.equal(el.style.lineHeight, '', 'after undecorate');
      }
    );

  });

  return {};
});
