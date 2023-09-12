define([
  'common/elements/document/tableCell/tableCell',
  'common/elements/document/tableRow/tableRow'], function() {
  'use strict';

  describe('<qowt-table-row>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('tablerow-test-template');
      element = document.querySelector('[is="qowt-table-row"]');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should mixin FlowCells algorithm', function() {
      assert.isTrue(element.supports('flow-cells'), 'support flow');
    });

    xit('should defer emptiness to state of its children', function() {
      assert.isTrue(element.isEmpty(), 'children are empty');
      var child = element.lastElementChild;
      child.innerText = 'not empty';
      assert.isFalse(element.isEmpty(), 'one child not empty');
    });

    it('should forceRemoveFromFlow its children', function() {
      var flowInto = element.createFlowInto();
      assert.isTrue(element.flowInto === flowInto, 'correct flowInto');
      var child = element.firstElementChild;
      sinon.spy(child, 'forceRemoveFromFlow');
      element.removeFromFlow();
      assert.isUndefined(flowInto.flowFrom, 'flowFrom has been removed');
      assert.isTrue(child.forceRemoveFromFlow.called,
          'child forceRemoveFromFlow was called');
    });

  });

  return {};
});
