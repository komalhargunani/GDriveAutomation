define(['common/elements/document/tableCell/tableCell'], function() {
  'use strict';

  describe('<qowt-table-cell>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('tablecell-test-template');
      element = document.querySelector('[is="qowt-table-cell"]');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should mixin FlowChildren algorithm', function() {
      assert.isTrue(element.supports('flow-children'), 'support flow');
    });

    it('should have a contentHeight function', function() {
      assert.isFunction(element.contentHeight, 'provide contentHeight func');
    });

    it('should not remove a node from flow normally', function() {
      var flowInto = element.createFlowInto();
      assert.isTrue(element.flowInto === flowInto, 'correct flowInto');
      flowInto.removeFromFlow();
      assert.isTrue(element.flowInto === flowInto, 'still correct');
    });

    it('should provide a force remove that does remove the node', function() {
      var flowInto = element.createFlowInto();
      assert.isTrue(element.flowInto === flowInto, 'correct flowInto');
      flowInto.forceRemoveFromFlow();
      assert.isUndefined(element.flowInto, 'flow node has been removed');
    });

  });

  return {};
});
