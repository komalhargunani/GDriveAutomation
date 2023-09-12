define(['test/common/elements/decorators/decoratorTestUtils'],
    function(DecoratorsTestUtils) {

      'use strict';

      DecoratorsTestUtils.describe('Cap text decorator mixin',
         'cap-text-decorator', function() {

            var propsAll = {
              cap: 'all'
            };
            var propsSmall = {
              cap: 'small'
            };
            var unset = {
              cap: 'none'
            };

            this.shouldSupport('cap');

            this.shouldDecorate(
                'Should be possible to decorate text as all Capitals',
                propsAll,
                function afterDecorating(el, decs) {
                  var elmStyle = el && el.style;
                  assert.deepEqual(decs, propsAll, 'after decorate');
                  assert.strictEqual(elmStyle.textTransform, 'uppercase',
                      'textTransform set correctly for all cap');

                  var fontVariant = elmStyle.fontVariantCaps ||
                                    elmStyle.fontVariant;
                  assert.strictEqual(fontVariant, 'normal',
                      'fontVariant set correctly for all cap');
                },
                function afterUndecorating(el, decs) {
                  var elmStyle = el && el.style;
                  assert.deepEqual(decs, unset, 'properties after undecorate');
                  assert.strictEqual(elmStyle.textTransform, '',
                      'textTransform set correctly after undecorate');

                  var fontVariant = elmStyle.fontVariantCaps ||
                                    elmStyle.fontVariant;
                  assert.strictEqual(fontVariant, '',
                      'fontVariant set correctly after undecorate');
                }
            );

            this.shouldDecorate(
                'Should be possible to decorate text as small Capitals',
                propsSmall,
                function afterDecorating(el, decs) {
                  var elmStyle = el && el.style;
                  assert.deepEqual(decs, propsSmall, 'after decorate');
                  assert.strictEqual(elmStyle.textTransform, 'none',
                      'textTransform set correctly for small caps');
                  var fontVariant = elmStyle.fontVariantCaps ||
                                    elmStyle.fontVariant;
                  assert.strictEqual(fontVariant, 'small-caps',
                      'fontVariant set correctly for small-caps');
                },
                function afterUndecorating(el, decs) {
                  var elmStyle = el && el.style;
                  assert.deepEqual(decs, unset, 'properties after undecorate');
                  assert.strictEqual(elmStyle.textTransform, '',
                      'textTransform set correctly after undecorate');
                  var fontVariant = elmStyle.fontVariantCaps ||
                                    elmStyle.fontVariant;
                  assert.strictEqual(fontVariant, '',
                      'fontVariant set correctly after undecorate');
                }
            );

          });

      return {};

    });
