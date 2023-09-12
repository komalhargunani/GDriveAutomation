define([
  'test/common/elements/decorators/decoratorTestUtils'],
function(DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe('Point Spacing mixin:',
      'point-para-spacing-decorator', function() {

        var propsInPoints = {
          spcBef: {
            format: 'points',
            value: 5400
          },

          spcAft: {
            format: 'points',
            value: 5400
          }
        };
        var propsInPercent = {
          spcBef: {
            format: 'percentage',
            value: 2000000
          },

          spcAft: {
            format: 'percentage',
            value: 2000000
          }
        };
        var unset = {
          spcBef: {
            format: 'points',
            value: 0
          },

          spcAft: {
            format: 'points',
            value: 0
          }
        };

        this.shouldSupport('spcBef');
        this.shouldSupport('spcAft');

        this.shouldDecorate(
            'Should be possible to decorate space before in points',
            propsInPoints, function afterDecorating(el, decs) {
              assert.deepEqual(decs.spcBef, propsInPoints.spcBef,
                  'properties after decorate');
              assert.strictEqual(el.style.paddingTop, '54pt',
                  'has a top padding');
            },
            function afterUndecorating(el, decs) {
              assert.deepEqual(decs.spcBef, unset.spcBef,
                  'properties after undecorate');
              assert.equal(el.style.paddingTop, '', 'has no top padding');
            }
        );

        this.shouldDecorate(
            'Should be possible to decorate space before in percentage',
            propsInPercent, function afterDecorating(el, decs) {
              assert.deepEqual(decs.spcBef, propsInPercent.spcBef,
                  'properties after decorate');
              // Multiply maxParaFontSize by percentage, and the spacing
              // constant to get the expected value of padding
              var padding = 18 * 20 * 1.2;
              assert.strictEqual(el.style.paddingTop, padding + 'pt',
                  'has a top padding');
            },
            function afterUndecorating(el, decs) {
              assert.deepEqual(decs.spcBef, unset.spcBef,
                  'properties after undecorate');
              assert.equal(el.style.paddingTop, '', 'has no top padding');
            }
        );

        this.shouldDecorate(
            'Should be possible to decorate space after in points',
            propsInPoints, function afterDecorating(el, decs) {
              assert.deepEqual(decs.spcAft, propsInPoints.spcAft,
                  'properties after decorate');
              assert.strictEqual(el.style.paddingBottom, '54pt',
                  'has a top padding');
            },
            function afterUndecorating(el, decs) {
              assert.deepEqual(decs.spcAft, unset.spcAft,
                  'properties after undecorate');
              assert.equal(el.style.paddingBottom, '', 'has no top padding');
            }
        );

        this.shouldDecorate(
            'Should be possible to decorate space after in percentage',
            propsInPercent, function afterDecorating(el, decs) {
              assert.deepEqual(decs.spcAft, propsInPercent.spcAft,
                  'properties after decorate');
              // Multiply maxParaFontSize by percentage, and the spacing
              // constant to get the expected value of padding
              var padding = 18 * 20 * 1.2;
              assert.strictEqual(el.style.paddingBottom, padding + 'pt',
                  'has a bottom padding');
            },
            function afterUndecorating(el, decs) {
              assert.deepEqual(decs.spcAft, unset.spcAft,
                  'properties after undecorate');
              assert.equal(el.style.paddingBottom, '', 'has no bottom padding');
            }
        );

      });

  return {};
});
