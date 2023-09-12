define(['qowtRoot/utils/domUtils'], function(DomUtils) {
  'use strict';

  describe('FlowChildren algorithm', function() {

    beforeEach(function() {
      this.stampOutTempl('flow-children-mixin-test-template');
    });

    it('should flow its children correctly', function() {
      runFlowTest_();
    });

    // imagine a tiny span in between big spans; where the big
    // spans all bursts out of the container, but the tiny span
    // in between the big guys fits in the container. We should still
    // flow all elements correctly (and not accidentally leave the
    // tiny child)
    it('should flow children correctly, even if some children flow ' +
       'out of the container box, whilst others dont', function() {
      // find the children which are ON the edge
      var edgeChildren, container;
      container = document.getElementById('container');
      container.boundingBox = function() {
        return this.getBoundingClientRect();
      };
      edgeChildren = getEdgeChildren_();
      assert.isTrue(
          edgeChildren.length >= 3,
          'should have at least 3 edge children');
      // make the middle edge child tiny so it no
      // longer bursts out of the container
      edgeChildren[1].style.fontSize = '1pt';
      edgeChildren[1].style.verticalAlign = 'top';
      assert.isTrue(
          isOnEdge_(edgeChildren[0], container.boundingBox()),
          'edge child 1 overflows');
      assert.isFalse(
          isOnEdge_(edgeChildren[1], container.boundingBox()),
          'edge child 2 fits');
      assert.isTrue(
          isOnEdge_(edgeChildren[2], container.boundingBox()),
          'edge child 3 overflows');
      runFlowTest_();
    });

    it('should reflow from more than one flowInto node if needed', function() {
      var para, flow1, flow2, flow3, flow4;
      var container = document.getElementById('container');
      para = document.createElement('flow-children-test-element');
      flow1 = para.createFlowInto();
      flow2 = flow1.createFlowInto();
      flow3 = flow2.createFlowInto();
      flow4 = flow3.createFlowInto();
      assert.strictEqual(
          para.flowLength(), 5,
          'flow length is correct');
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
      para.appendChild(document.createElement('span'));
      flow1.appendChild(document.createElement('span'));
      flow2.appendChild(document.createElement('span'));
      flow3.appendChild(document.createElement('span'));
      flow4.appendChild(document.createElement('span'));
      para.flow(container);
      assert.strictEqual(
          para.childElementCount, 5,
          'all children in para');
      assert.strictEqual(
          para.flowLength(), 1,
          'flow length is correct');
      assert.isFalse(
          para.isFlowing(),
          'no longer flowing');
    });

    it('should insert child to the node while ensuring page is not left ' +
        'empty from flowInto if a child exists', function() {
          var container = document.getElementById('container');
          container.boundingBox = function() {
            return this.getBoundingClientRect();
          };
          var testElement = container.firstElementChild;
          var sandbox = sinon.sandbox.create();
          sandbox.stub(testElement, 'reflowEdgeChild_').returns(false);
          sandbox.spy(testElement, 'ensurePageNotLeftEmpty_');
          sandbox.stub(DomUtils, 'insertAtEnd');
          testElement.createFlowInto();
          testElement.flow(container);
          assert.isTrue(testElement.ensurePageNotLeftEmpty_.called,
              'ensurePageNotLeftEmpty_ called');
          assert.isTrue(DomUtils.insertAtEnd.notCalled,
              'insertAtEnd not called');
          sandbox.restore();
        });

    function getEdgeChildren_() {
      var edgeChildren, container, boundingBox, testElement;
      edgeChildren = [];
      container = document.getElementById('container');
      boundingBox = container.boundingBox();
      testElement = container.firstElementChild;
      for (var i = 0; i < testElement.children.length; i++) {
        var child = testElement.children[i];
        if (isOnEdge_(child, boundingBox)) {
          edgeChildren.push(child);
        }
      }
      return edgeChildren;
    }


    function isOnEdge_(node, box) {
      var nodeBox = node.getBoundingClientRect();
      return (nodeBox.top < box.bottom &&
              nodeBox.bottom > box.bottom);
    }


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
            testElement.children[i] :
            testElement.flowInto.children[i - testElement.childElementCount];
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

  describe('FlowChildren edge calculations', function() {

    beforeEach(function() {
      this.stampOutTempl('flow-children-mixin-test-template');
    });

    it('should consider over edge if client.top === bounding.bottom',
        function() {
      var container = document.getElementById('container');
      var testElement = container.firstElementChild;
      var span = testElement.firstElementChild;
      container.boundingBox = function() {
        return {
          top: 1,
          bottom: span.getBoundingClientRect().top,
          left: 3,
          right: 4
        };
      };
      assert.strictEqual(testElement.childPosition_(span, container),
                         testElement.childPositions.BEYOND_PAGE);
    });
   });

  return {};
});
