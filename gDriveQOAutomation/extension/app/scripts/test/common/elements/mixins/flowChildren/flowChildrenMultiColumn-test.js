define([], function() {
  'use strict';

  describe('FlowChildren algorithm with multiple columns', function() {

    beforeEach(function() {
      this.stampOutTempl('flow-children-multi-column-test-template');
      var section = document.getElementById('section');
      section.model = {
        col: 2
      };
    });

    xit('should flow its children correctly', function() {
      runFlowTest_();
    });

    it('should not be able to fit another child into flowed element',
        function() {
      var container = document.getElementById('container');
      container.boundingBox = function() {
        return this.getBoundingClientRect();
      };
      var testElement = container.firstElementChild;
      var flowInto = testElement.createFlowInto();
      testElement.flow(container);

      // After flowing, try adding the first element on page 2 and verify
      // that it now overflows
      var extraChild = Polymer.dom(flowInto).firstElementChild;
      testElement.appendChild(extraChild);

      assert.notStrictEqual(
          testElement.childPosition_(testElement.lastElementChild,
          container), testElement.childPositions.ON_PAGE,
          'element too big');

      testElement.removeChild(extraChild);
      testElement.unflow();
    });

    function runFlowTest_() {
      var container, testElement, originalCount, flowInto, total;
      container = document.getElementById('container');
      container.boundingBox = function() {
        return this.getBoundingClientRect();
      };
      testElement = container.firstElementChild;
      originalCount = testElement.childElementCount;
      assert.isTrue(
          testElement.offsetHeight > container.boundingBox().height,
          'element too big');
      flowInto = testElement.createFlowInto();
      testElement.flow(container);
      assert.isTrue(
          testElement.offsetHeight <= container.boundingBox().height,
          'element fits');
      assert.isTrue(
          testElement.childElementCount < originalCount,
          'flowed children');
      total = testElement.childElementCount + flowInto.childElementCount;
      assert.strictEqual(
          total, originalCount,
          'did not lose any elements');
      for (var i = 0; i < originalCount; i++) {
        var node = (i < testElement.childElementCount) ?
            testElement.children[i].firstElementChild :
            testElement.flowInto.children[i - testElement.childElementCount].
            firstElementChild;
        assert.strictEqual(
            node.id, 's' + (i + 1),
            'element order is maintained');
      }
      testElement.unflow();
      assert.strictEqual(
          testElement.childElementCount, originalCount,
          'unflow ok');
      assert.strictEqual(
          flowInto.childElementCount, 0,
          'flowInto empty');
      assert.isFalse(
          testElement.isFlowing(),
          'no longer flowing');
      assert.isUndefined(
          testElement.flowInto,
          'no more flowInto link');
      assert.isUndefined(
          flowInto.flowFrom,
          'no more flowFrom link');
    }
  });

  return {};
});
