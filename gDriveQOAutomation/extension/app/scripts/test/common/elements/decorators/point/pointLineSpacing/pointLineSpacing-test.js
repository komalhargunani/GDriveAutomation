define(['qowtRoot/utils/converters/converter',
  'test/common/elements/decorators/decoratorTestUtils'],
function(Converter, DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe('Point Line Space mixin:',
      'point-line-spacing-decorator', function() {


        var propsInPoints = {
          lnSpc: {
            format: 'points',
            value: 5400
          }
        };

        var propsInPercentageWithSign = {
          lnSpc: {
            format: 'percentage',
            value: '68%'
          }
        };

        var propsInPercentageWithoutSign = {
          lnSpc: {
            format: 'percentage',
            value: '68000'
          }
        };

        var unset = {
          lnSpc: undefined
        };

        this.shouldSupport('lnSpc');

        this.shouldDecorate(
            'Should be possible to decorate line Spacing in points',
            propsInPoints, function afterDecorating(el, decs) {
              assert.deepEqual(decs, propsInPoints,
                  'properties after decorate');
              var runs = el.querySelectorAll('span[is="qowt-run');
              _.forEach(runs, function(run) {
                var computedlnHeight = window.getComputedStyle(run).lineHeight;
                computedlnHeight = Math.round(Converter.cssSize2pt(
                    computedlnHeight));
                var appliedLnHeight = 54;
                assert.strictEqual(computedlnHeight, appliedLnHeight);
              });
            },
            function afterUndecorating(el, decs) {
              assert.deepEqual(decs, unset, 'properties after undecorate');
              var runs = el.querySelectorAll('span[is="qowt-run');
              _.forEach(runs, function(run) {
                var computedlnHeight = window.getComputedStyle(run).lineHeight;
                assert.strictEqual(computedlnHeight, 'normal');
              });
            }
        );

        this.shouldDecorate(
            'Should decorate line Spacing in percentage with "%"',
            propsInPercentageWithSign, function afterDecorating(el, decs) {
              assert.deepEqual(decs, propsInPercentageWithSign,
                  'properties after decorate');
              var runs = el.querySelectorAll('span[is="qowt-run');
              _.forEach(runs, function(run) {
                var computedlnHeight = window.getComputedStyle(run).lineHeight;
                computedlnHeight = Math.round(Converter.cssSize2pt(
                    computedlnHeight));
                var fontSize = window.getComputedStyle(run).fontSize;
                fontSize = Converter.cssSize2pt(fontSize);
                var appliedLnHeight = Math.round(fontSize * 0.68 * 0.80 * 1.2);
                assert.strictEqual(computedlnHeight, appliedLnHeight);
              });
            },
            function afterUndecorating(el, decs) {
              assert.deepEqual(decs, unset, 'properties after undecorate');
              var runs = el.querySelectorAll('span[is="qowt-run');
              _.forEach(runs, function(run) {
                var computedlnHeight = window.getComputedStyle(run).lineHeight;
                assert.strictEqual(computedlnHeight, 'normal');
              });
            }
        );

        this.shouldDecorate(
            'Should decorate line Spacing in percentage without "%"',
            propsInPercentageWithoutSign, function afterDecorating(el, decs) {
              assert.deepEqual(decs, propsInPercentageWithoutSign,
                  'properties after decorate');
              var runs = el.querySelectorAll('span[is="qowt-run');
              _.forEach(runs, function(run) {
                var computedlnHeight = window.getComputedStyle(run).lineHeight;
                computedlnHeight = Math.round(Converter.cssSize2pt(
                    computedlnHeight));
                var fontSize = window.getComputedStyle(run).fontSize;
                fontSize = Converter.cssSize2pt(fontSize);
                var appliedLnHeight = Math.round(fontSize * 0.68 * 0.80 * 1.2);
                assert.strictEqual(computedlnHeight, appliedLnHeight);
              });
            },
            function afterUndecorating(el, decs) {
              assert.deepEqual(decs, unset, 'properties after undecorate');
              var runs = el.querySelectorAll('span[is="qowt-run');
              _.forEach(runs, function(run) {
                var computedlnHeight = window.getComputedStyle(run).lineHeight;
                assert.strictEqual(computedlnHeight, 'normal');
              });
            }
        );
      });

  return {};
});
