define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Alignment decorator mixin',
      'alignment-decorator', function() {

    var alignLeft = {jus: 'L'};
    var alignCenter = {jus: 'C'};
    var alignRight = {jus: 'R'};
    var alignJustify = {jus: 'J'};

    this.shouldSupport('jus');

    this.shouldDecorate(
      'Should be possible to decorate left alignment', alignLeft,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, alignLeft, 'properties after decorate');
        assert.equal(el.style.textAlign, 'left');
      },
      function afterUndecorating(el, decs) {
        // After unsetting we should have decorations set as left (default)
        assert.deepEqual(decs, alignLeft, 'properties after undecorate');
        assert.equal(el.style.textAlign, '');
      }
    );

    this.shouldDecorate(
      'Should be possible to decorate center alignment', alignCenter,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, alignCenter, 'properties after decorate');
        assert.equal(el.style.textAlign, 'center');
      },
      function afterUndecorating(el, decs) {
        // After unsetting we should have decorations set as left (default)
        assert.deepEqual(decs, alignLeft, 'properties after undecorate');
        assert.equal(el.style.textAlign, '');
      }
    );

    this.shouldDecorate(
      'Should be possible to decorate right alignment', alignRight,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, alignRight, 'properties after decorate');
        assert.equal(el.style.textAlign, 'right');
      },
      function afterUndecorating(el, decs) {
        // After unsetting we should have decorations set as left (default)
        assert.deepEqual(decs, alignLeft, 'properties after undecorate');
        assert.equal(el.style.textAlign, '');
      }
    );

    this.shouldDecorate(
      'Should be possible to decorate justified alignment', alignJustify,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, alignJustify, 'properties after decorate');
        assert.equal(el.style.textAlign, 'justify');
      },
      function afterUndecorating(el, decs) {
        // After unsetting we should have decorations set as left (default)
        assert.deepEqual(decs, alignLeft, 'properties after undecorate');
        assert.equal(el.style.textAlign, '');
      }
    );

  });

  return {};
});
