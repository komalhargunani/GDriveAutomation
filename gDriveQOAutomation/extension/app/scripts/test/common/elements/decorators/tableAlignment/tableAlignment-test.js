define([
  'test/common/elements/decorators/decoratorTestUtils'], function(
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'Table alignment decorator mixin',
      'table-alignment-decorator', function() {

    var alignLeft = {align: 'left'};
    var alignCenter = {align: 'center'};
    var alignRight = {align: 'right'};

    this.shouldSupport('align');

    this.shouldDecorate(
      'Should be possible to decorate left alignment', alignLeft,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, alignLeft, 'properties after decorate');
        assert.equal(el.style.marginLeft, '');
        assert.equal(el.style.marginRight, 'auto');
      },
      function afterUndecorating(el, decs) {
        // after unsetting we should have decorations set as left (default)
        assert.deepEqual(decs, alignLeft, 'properties after undecorate');
        assert.equal(el.style.marginLeft, '0px');
        assert.equal(el.style.marginRight, '0px');
      }
    );

    this.shouldDecorate(
      'Should be possible to decorate center alignment', alignCenter,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, alignCenter, 'properties after decorate');
        assert.equal(el.style.marginLeft, 'auto');
        assert.equal(el.style.marginRight, 'auto');
      },
      function afterUndecorating(el, decs) {
        // after unsetting we should have decorations set as left (default)
        assert.deepEqual(decs, alignLeft, 'properties after undecorate');
        assert.equal(el.style.marginLeft, '0px');
        assert.equal(el.style.marginRight, '0px');
      }
    );

    this.shouldDecorate(
      'Should be possible to decorate right alignment', alignRight,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, alignRight, 'properties after decorate');
        assert.equal(el.style.marginLeft, 'auto');
      },
      function afterUndecorating(el, decs) {
        // after unsetting we should have decorations set as left (default)
        assert.deepEqual(decs, alignLeft, 'properties after undecorate');
        assert.equal(el.style.marginLeft, '0px');
        assert.equal(el.style.marginRight, '0px');
      }
    );

  });

  return {};
});
