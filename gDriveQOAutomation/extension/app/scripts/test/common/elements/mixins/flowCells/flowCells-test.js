define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/flowCells',
  'common/mixins/flowChildren'
], function(
    MixinUtils,
    QowtElement,
    FlowCells,
    FlowChildren
  ) {
  'use strict';

  describe('FlowCell algorithm', function() {

    before(function() {
      Polymer(MixinUtils.mergeMixin(
        QowtElement, FlowCells,
        { is: 'flow-children-as-cells' }));
      Polymer(MixinUtils.mergeMixin(
        QowtElement, FlowChildren,
        { is: 'flow-children-as-elements' }));
    });


    beforeEach(function() {
      this.stampOutTempl('flow-cells-mixin-test-template');
    });

    it('should flow children within each cell correctly', function() {
      var i, container, flowCellEl, cellCount;
      container = document.getElementById('container');
      container.boundingBox = function() {
        return this.getBoundingClientRect();
      };
      flowCellEl = container.firstElementChild;
      cellCount = flowCellEl.childElementCount;
      assert.isTrue(
          flowCellEl.offsetHeight > container.boundingBox().height,
          'element should be too big');
      flowCellEl.createFlowInto();
      flowCellEl.flow(container);
      assert.isTrue(
          flowCellEl.offsetHeight <= container.boundingBox().height,
          'element should fit');
      for (i = 0; i < cellCount; i++) {
        assert.isTrue(
            flowCellEl.children[i].isFlowing(),
            'cell should flow');
      }
      flowCellEl.unflow();
      for (i = 0; i < cellCount; i++) {
        assert.isFalse(
            flowCellEl.children[i].isFlowing(),
            'should no longer flow');
      }
    });

    xit('should reflow from more than one flowInto node if needed', function() {
      var numberOfCells, phrase, words, cells, cell, para, i,
          cellFlowNodeIter, paraFlowNodeIter;
      var container = document.getElementById('container');
      numberOfCells = 2;
      phrase = 'hello world how are you doing?';
      words = phrase.split(/\b/);
      cells = [];
      // create the cells each with a para
      for (i = 0; i < numberOfCells; i++) {
        cell = document.createElement('flow-children-as-cells');
        para = document.createElement('flow-children-as-elements');
        cell.appendChild(para);
        cells.push(cell);
        para.innerText = words[0];
      }
      // create flowInto's FOR THE SECOND CELL ONLY & put one word in each para
      cellFlowNodeIter = cell;
      paraFlowNodeIter = para;
      for (i = 1; i < words.length; i++) {
        cellFlowNodeIter = cellFlowNodeIter.createFlowInto();
        paraFlowNodeIter = paraFlowNodeIter.createFlowInto();
        cellFlowNodeIter.appendChild(paraFlowNodeIter);
        paraFlowNodeIter.innerText = words[i];
      }
      assert.strictEqual(
          cells[0].flowLength(), 1,
          'first cell does not flow');
      assert.strictEqual(
          cells[1].flowLength(), 12,
          '2nd cell flow length correct');
      assert.strictEqual(
          para.flowLength(), 12,
          '2nd para flow length is correct');
      container.boundingBox = function() {
        return {
          top: 0,
          left: 0,
          right: 10000,
          bottom: 10000,
          height: 10000,
          width: 10000
        };
      };
      cell.flow(container);
      assert.strictEqual(
          cell.flowLength(), 1,
          '2nd flow length is correct');
      assert.strictEqual(
          para.innerText, phrase,
          'para contains phrase');
    });
  });

  return {};
});
