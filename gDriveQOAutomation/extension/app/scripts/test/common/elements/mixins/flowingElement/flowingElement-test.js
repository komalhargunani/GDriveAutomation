define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/flowingElement'
], function(
  MixinUtils,
  QowtElement,
  FlowingElement
  ) {
  'use strict';

  describe('Flowing Element', function() {

    var i, nodes = [], ID = 'E4', api_;

    before(function() {
      api_ = { is: 'flowing-element-test-element' };
      Polymer(MixinUtils.mergeMixin(QowtElement, FlowingElement, api_));
    });

    after(function() {
       api_ = undefined;
    });

    beforeEach(function() {
      this.stampOutTempl('flowing-element-mixin-test-template');
      // create a flow
      nodes.push(document.createElement('flowing-element-test-element'));
      assert.isFunction(
          nodes[0].supports,
          'should be a QowtElement');
      assert.isTrue(
          nodes[0].supports('flow'),
          'should support flowing');
      nodes[0].setEid(ID);
      nodes.push(nodes[nodes.length-1].createFlowInto());
      nodes.push(nodes[nodes.length-1].createFlowInto());
      nodes.push(nodes[nodes.length-1].createFlowInto());
      nodes.push(nodes[nodes.length-1].createFlowInto());
      nodes.push(nodes[nodes.length-1].createFlowInto());
    });

    afterEach(function() {
      nodes = [];
    });

    it('should ensure all flow nodes have eid, but only ' +
       'the flowStart element should have an ID attribute', function() {
      for (var i = 0; i < nodes.length; i++) {
        if (i === 0) {
          assert.strictEqual(
              nodes[i].getAttribute('id'), ID,
              'flow start node should have id attribute');
        } else {
          assert.isNull(
              nodes[i].getAttribute('id'),
              'other nodes not');
        }
        assert.strictEqual(
            nodes[i].getEid(), ID,
            'all nodes should have eid');
      }
    });

    it('should be a linked list', function() {
      assert.isUndefined(
          nodes[0].flowFrom,
          'correct first flowFrom');
      assert.isUndefined(
          nodes[nodes.length-1].flowInto,
          'correct last flowInto');
      for (i = 1; i < nodes.length - 1; i++) {
        assert.strictEqual(
            nodes[i].flowFrom, nodes[i-1],
            'correct flowFrom');
        assert.strictEqual(
            nodes[i].flowInto, nodes[i+1],
            'correct flowInto');
      }
    });

    it('should have a unique named flow', function() {
      var flowName = nodes[0].namedFlow();
      assert.isDefined(
          flowName,
          'has a named flow');
      for (i = 0; i < nodes.length; i++) {
        assert.strictEqual(
            nodes[i].namedFlow(), flowName,
            'all nodes same flowname');
      }
    });

    it('should have all nodes as "flowing"', function() {
      for (i = 0; i < nodes.length; i++) {
        assert.isTrue(
            nodes[i].isFlowing(),
            'all nodes flowing');
      }
    });

    it('should return the correct flow start and end nodes', function() {
      for (i = 0; i < nodes.length; i++) {
        assert.strictEqual(
            nodes[i].flowStart(), nodes[0],
            'correct flow start node');
        assert.strictEqual(
            nodes[i].flowEnd(), nodes[nodes.length-1],
            'correct flow end node');
      }
    });

    it('should be possible to remove a node from the flow', function() {
      nodes[4].removeFromFlow();
      assert.strictEqual(
          nodes[3].flowInto, nodes[5],
          'correct new flowInto');
      assert.strictEqual(
          nodes[5].flowFrom, nodes[3],
          'correct new flowInto');
    });
  });

  return {};
});
