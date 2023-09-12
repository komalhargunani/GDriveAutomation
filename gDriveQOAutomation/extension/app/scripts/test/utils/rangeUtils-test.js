define(['utils/rangeUtils'], function(RangeUtils) {
  'use strict';

  describe('Range Utils', function() {

    var root, atom, ball, coat, desk, range;

    beforeEach(function() {
      /**
       * create small div tree:
       *                      ┌──────┐
       *                      │ root │
       *                      └──┬───┘
       *           ┌────────┬────┴────┬───────┐
       *        ┌──┴───┐ ┌──┴───┐ ┌───┴──┐ ┌──┴───┐
       *        │ atom │ │ ball │ │ coat │ │ desk │
       *        └──────┘ └──────┘ └──────┘ └──────┘
       *
       */
      root = document.createElement('div');
      atom = document.createElement('div');
      ball = document.createElement('div');
      coat = document.createElement('div');
      desk = document.createElement('div');
      root.id = 'root';
      atom.textContent = atom.id = 'atom';
      ball.textContent = ball.id = 'ball';
      coat.textContent = coat.id = 'coat';
      desk.textContent = desk.id = 'desk';
      root.appendChild(atom);
      root.appendChild(ball);
      root.appendChild(coat);
      root.appendChild(desk);
    });


    /**
     * ┌──────────┐
     * │          │   ┌──────┐
     * │  range   │   │ node │
     * │          │   └──────┘
     * └──────────┘
     */
    it('should identify range "before" the node', function() {
      range = select_(atom);

      expect(RangeUtils.compareNode(range, coat))
          .to.equal(RangeUtils.RANGE_BEFORE);
    });


    /**
     *               ┌──────────┐
     *   ┌──────┐    │          │
     *   │ node │    │  range   │
     *   └──────┘    │          │
     *               └──────────┘
     */
    it('should identify range "after" the node', function() {
      range = select_(coat, coat);

      expect(RangeUtils.compareNode(range, atom))
          .to.equal(RangeUtils.RANGE_AFTER);
    });


    /**
     * ┌──────────┐
     * │        ┌─┴────┐
     * │  range │ node │
     * │        └─┬────┘
     * └──────────┘
     */
    it('should identify range "before but intersecting" the node', function() {
      range = selectStartToMiddle_(atom, coat);

      expect(RangeUtils.compareNode(range, coat))
          .to.equal(RangeUtils.RANGE_BEFORE_INTERSECTS);
    });


    /**
     *        ┌──────────┐
     *   ┌────┴─┐        │
     *   │ node │ range  │
     *   └────┬─┘        │
     *        └──────────┘
     */
    it('should identify range "after but intersecting" the node', function() {
      range = selectMiddleToEnd_(atom, coat);

      expect(RangeUtils.compareNode(range, atom))
          .to.equal(RangeUtils.RANGE_AFTER_INTERSECTS);
    });


    /**
     *  ┌───────────────────┐
     *  │   ┌──────┐        │
     *  │   │ node │ range  │
     *  │   └──────┘        │
     *  └───────────────────┘
     */
    it('should identify range "around" the node', function() {
      range = select_(atom, coat);

      expect(RangeUtils.compareNode(range, ball))
          .to.equal(RangeUtils.RANGE_AROUND);
    });


    /**
     *  ┌────────────────────┐
     *  │   ┌───────┐        │
     *  │   │ range │ node   │
     *  │   └───────┘        │
     *  └────────────────────┘
     */
    it('should identify range "inside" the node', function() {
      range = selectChars_(ball, 1, 3);

      expect(RangeUtils.compareNode(range, ball))
          .to.equal(RangeUtils.RANGE_INSIDE);
    });


    /**
     *  ┌──────────────────┐
     *  │                  │
     *  │  range && node   │
     *  │                  │
     *  └──────────────────┘
     */
    it('should identify range "identical to" the node', function() {
      range = select_(ball);

      expect(RangeUtils.compareNode(range, ball))
          .to.equal(RangeUtils.RANGE_IDENTICAL);
    });



    /**
     * ┌──────────┐
     * │          ├──────┐
     * │  range   │ node │
     * │          ├──────┘
     * └──────────┘
     */
    it('should identify range "touching" the node on the left', function() {
      range = selectStartToStart_(atom, ball);

      expect(RangeUtils.compareNode(range, ball))
          .to.equal(RangeUtils.RANGE_TOUCHING_LEFT);
    });


    /**
     *          ┌──────────┐
     *   ┌──────┤          │
     *   │ node │  range   │
     *   └──────┤          │
     *          └──────────┘
     */
    it('should identify range "touching" the node on the right', function() {
      range = selectEndtoEnd_(ball, coat);

      expect(RangeUtils.compareNode(range, ball))
          .to.equal(RangeUtils.RANGE_TOUCHING_RIGHT);
    });


    describe('range iterator', function() {

      it('should include elements and text nodes by default', function() {
        range = selectStartToStart_(ball, desk);
        var iter = RangeUtils.createIterator(range);

        assert.isTrue(iter.nextNode() === root, 'root included');
        assert.isTrue(iter.nextNode() === ball, 'ball included');

        var next = iter.nextNode();
        assert.strictEqual(next.nodeType, Node.TEXT_NODE, 'ball text node');
        assert.strictEqual(next.textContent, 'ball', 'correct text for ball');

        assert.isTrue(iter.nextNode() === coat, 'coat included');

        next = iter.nextNode();
        assert.strictEqual(next.nodeType, Node.TEXT_NODE, 'coat text node');
        assert.strictEqual(next.textContent, 'coat', 'correct text for coat');

        // touching nodes should not be included by default
        assert.strictEqual(iter.nextNode(), null, 'desk not included');
      });


      it('should support changing the filter to elements only', function() {
        range = selectStartToStart_(ball, desk);
        var iter = RangeUtils.createIterator(range, NodeFilter.SHOW_ELEMENT);

        assert.isTrue(iter.nextNode() === root, 'root included');
        assert.isTrue(iter.nextNode() === ball, 'ball included');
        assert.isTrue(iter.nextNode() === coat, 'coat included');

        // touching nodes should not be included by default
        assert.strictEqual(iter.nextNode(), null, 'desk not included');
      });


      it('should support including touching nodes', function() {
        range = selectStartToStart_(ball, desk);
        var iterator =
            RangeUtils.createIterator(range, NodeFilter.SHOW_ELEMENT, true);

        assert.isTrue(iterator.nextNode() === root, 'root included');
        assert.isTrue(iterator.nextNode() === ball, 'ball included');
        assert.isTrue(iterator.nextNode() === coat, 'coat included');
        assert.isTrue(iterator.nextNode() === desk, 'desk included');
      });

    });

  });

  // select from start of nodeA to end of nodeB
  // if nodeB is undefined, then select nodeA completely
  function select_(nodeA, nodeB) {
    var range = document.createRange();
    range.setStart(nodeA, 0);
    var end = nodeB ? nodeB : nodeA;
    range.setEnd(end, end.childNodes.length);
    return range;
  }

  // select from start of nodeA to middle of nodeB
  function selectStartToMiddle_(nodeA, nodeB) {
    var range = document.createRange();
    range.setStart(nodeA, 0);
    range.setEnd(nodeB.firstChild, nodeB.textContent.length/2);
    return range;
  }

  // select from middle of nodeA to end of nodeB
  function selectMiddleToEnd_(nodeA, nodeB) {
    var range = document.createRange();
    range.setStart(nodeA.firstChild, nodeA.textContent.length/2);
    range.setEnd(nodeB.firstChild, nodeB.textContent.length);
    return range;
  }

  function selectStartToStart_(nodeA, nodeB) {
    var range = document.createRange();
    range.setStart(nodeA, 0);
    range.setEnd(nodeB, 0);
    return range;
  }

  function selectEndtoEnd_(nodeA, nodeB) {
    var range = document.createRange();
    range.setStart(nodeA, nodeA.childNodes.length);
    range.setEnd(nodeB, nodeB.childNodes.length);
    return range;
  }

  // select characters inside node
  function selectChars_(node, startOffset, endOffset) {
    var range = document.createRange();
    var textNode = node.firstChild;
    range.setStart(textNode, startOffset);
    range.setEnd(textNode, endOffset);
    return range;
  }

  return {};
});
