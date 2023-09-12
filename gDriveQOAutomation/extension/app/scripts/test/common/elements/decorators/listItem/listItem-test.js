define([
  'qowtRoot/utils/listFormatManager',
  'test/common/elements/decorators/decoratorTestUtils'], function(
  ListFormatManager,
  DecoratorsTestUtils) {
  'use strict';

  DecoratorsTestUtils.describe(
      'ListItem decorator mixin:',
      'list-item-decorator', function() {

    beforeEach(function() {
      sinon.stub(ListFormatManager, 'getTemplateId').returns('fakeTemplateId');
      sinon.stub(ListFormatManager, 'getListType').returns('fakeListType');
      sinon.stub(ListFormatManager, 'get').returns('fakeClassName');
    });

    afterEach(function() {
      ListFormatManager.getTemplateId.restore();
      ListFormatManager.getListType.restore();
      ListFormatManager.get.restore();
    });

    var props = {
      lvl: 4,
      lfeID: 1234
    };
    var unset = {
      lvl: undefined,
      lfeID: undefined
    };

    this.shouldSupport(['lvl', 'lfeID']);

    this.shouldDecorate(
      'Should be possible to decorate list items', props,
      function afterDecorating(el, decs) {
        assert.deepEqual(decs, props, 'after decorate');
        assert.equal(el.getAttribute('qowt-lvl'), props.lvl, 'lvl match');
        assert.equal(el.getAttribute('qowt-entry'), props.lfeID, 'lfeID match');
        assert.notEqual(el.getAttribute('qowt-template'), null, 'has template');
        assert.notEqual(el.getAttribute('qowt-list-type'), null, 'has type');
        assert(el.classList.length > 0, 'should have classes set');
      },
      function afterUndecorating(el, decs) {
        assert.deepEqual(decs, unset, 'properties after undecorate');
        assert.equal(el.getAttribute('qowt-lvl'), 'undefined', 'lvl unset');
        assert.equal(el.getAttribute('qowt-entry'), 'undefined', 'lfeID unset');
        assert.equal(el.getAttribute('qowt-template'), null, 'template unset');
        assert.equal(el.getAttribute('qowt-list-type'), null, 'type unset');
        assert(el.classList.length === 0, 'should have zero classes set');
      }
    );

  });

  return {};
});
