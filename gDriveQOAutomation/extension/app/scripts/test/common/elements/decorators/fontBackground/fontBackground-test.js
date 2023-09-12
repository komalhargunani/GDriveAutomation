define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'text background mixin:',
      'font-background-decorator', function() {

    var highlight = {
      hgl: '#123456'
    };
    var afterHighlight = {
      hgl: '#123456',
      shading: {
        backgroundColor: 'auto'
      }
    };
    var both = {
      hgl: '#123456',
      shading: {
        backgroundColor: '#654321'
      }
    };
    var shading = {
      shading: {
        backgroundColor: '#654321'
      }
    };
    var afterShading = {
      hgl: 'auto',
      shading: {
        backgroundColor: '#654321'
      }
    };

    var unset = {
      hgl: 'auto',
      shading: {
        backgroundColor: 'auto'
      }
    };

    this.shouldSupport('hgl');

    this.shouldDecorate(
      'Should be possible to decorate text highlight', highlight,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, afterHighlight, 'after decorate');
        assert.equal(el.style.backgroundColor, 'rgb(18, 52, 86)',
            'have font highlight');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.backgroundColor, '', 'have no font highlight');
      }
    );

    this.shouldDecorate(
      'Should be possible to decorate shading', shading,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, afterShading, 'after decorate');
        assert.equal(el.style.backgroundColor, 'rgb(101, 67, 33)',
            'have font highlight');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.backgroundColor, '', 'have no font highlight');
      }
    );

    this.shouldDecorate(
      'Should use hgl over shading', both,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, both, 'after decorate');
        assert.equal(el.style.backgroundColor, 'rgb(18, 52, 86)',
            'have font highlight');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.style.backgroundColor, '', 'have no font highlight');
      }
    );

  });

  return {};
});
