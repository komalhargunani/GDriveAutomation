define(['common/elements/customSelector'], function(CustomSelector) {
  'use strict';

  describe('customSelector', function() {

    var root_, atom_, ball_, coat_, desk_, node, nodes, testDiv_;
    beforeEach(function() {
      this.stampOutTempl('custom-selector-test-template');
      testDiv_ = this.getTestDiv();
      testDiv_.style['-webkit-user-modify'] = 'read-write';

      root_ = document.getElementById('root');
      atom_ = document.getElementById('atom');
      ball_ = document.getElementById('ball');
      coat_ = document.getElementById('coat');
      desk_ = document.getElementById('desk');

      root_.supports_.push('foo', 'root');
      atom_.supports_.push('foo', 'atom');
      ball_.supports_.push('foo', 'ball');
      coat_.supports_.push('foo', 'coat');
      desk_.supports_.push('foo', 'desk');
    });

    describe('querySelectorByAction', function() {

      it('should find an element supporting foo', function() {
        node = CustomSelector.querySelectorByAction('#ball', 'foo');
        assert(ball_ === node, 'should find ball');
      });

      it('should find an element supporting ball', function() {
        node = CustomSelector.querySelectorByAction('#ball', 'ball');
        assert(ball_ === node, 'should find ball');
      });

      it('should return undefined if node does not support eggs', function() {
        node = CustomSelector.querySelectorByAction('#ball', 'eggs');
        assert.isUndefined(node, 'should not find anything');
      });

      it('should return FIRST node that supports x in nodeList', function() {
        node = CustomSelector.querySelectorByAction(
            'custom-selector-test-element', 'foo');
        assert(root_ === node, 'should find root');

        node = CustomSelector.querySelectorByAction(
            'custom-selector-test-element', 'coat');
        assert(coat_ === node, 'should find coat');
      });

      it('should not walk up to find nodes', function() {
        node = CustomSelector.querySelectorByAction('#ball', 'root');
        assert.isUndefined(node, 'should not find anything');
      });
    });

    describe('querySelectorAllByAction', function() {

      it('should find an element supporting foo', function() {
        nodes = CustomSelector.querySelectorAllByAction('#ball', 'foo');
        assert(nodes.length === 1, 'should find one node only');
        assert(ball_ === nodes[0], 'should find ball');
      });

      it('should find an element supporting ball', function() {
        nodes = CustomSelector.querySelectorAllByAction('#ball', 'ball');
        assert(nodes.length === 1, 'should find one node only');
        assert(ball_ === nodes[0], 'should find ball');
      });

      it('should return undefined if node does not support eggs', function() {
        nodes = CustomSelector.querySelectorAllByAction('#ball', 'eggs');
        assert(nodes.length === 0, 'should not find anything');
      });

      it('should return all nodes that supports x in nodeList', function() {
        nodes = CustomSelector.querySelectorAllByAction(
            'custom-selector-test-element', 'foo');
        assert(nodes.length === 5, 'should find all nodes');
        assert(root_ === nodes[0], 'should find root');
        assert(atom_ === nodes[1], 'should find atom');
        assert(ball_ === nodes[2], 'should find ball');
        assert(coat_ === nodes[3], 'should find coat');
        assert(desk_ === nodes[4], 'should find desk');

        nodes = CustomSelector.querySelectorAllByAction(
            'custom-selector-test-element', 'coat');
        assert(nodes.length === 1, 'should find one node');
        assert(coat_ === nodes[0], 'should find coat');
      });

      it('should not walk up to find nodes', function() {
        nodes = CustomSelector.querySelectorAllByAction('#ball', 'root');
        assert(nodes.length === 0, 'should not find anything');
      });
    });

    describe('findInPath', function() {

      it('should find an element supporting foo', function() {
        node = CustomSelector.findInPath('#ball', 'foo');
        assert(ball_ === node, 'should find ball');
      });

      it('should find an element when starting point is a node', function() {
        node = CustomSelector.findInPath(ball_, 'foo');
        assert(ball_ === node, 'should find ball');
      });

      it('should find an element supporting ball', function() {
        node = CustomSelector.findInPath('#ball', 'ball');
        assert(ball_ === node, 'should find ball');
      });

      it('should return undefined if node does not support eggs', function() {
        node = CustomSelector.findInPath('#ball', 'eggs');
        assert.isUndefined(node, 'should not find anything');
      });

      it('should return FIRST node that supports x in nodeList', function() {
        node = CustomSelector.findInPath(
            'custom-selector-test-element', 'foo');
        assert(root_ === node, 'should find root');
      });

      it('should walk up to find nodes', function() {
        node = CustomSelector.findInPath('#ball', 'root');
        assert(root_ === node, 'should find root');
      });

    });

    describe('findAllInPath', function() {

      it('should find an element supporting foo', function() {
        nodes = CustomSelector.findAllInPath('#ball', 'foo');
        assert(nodes.length === 2, 'should find two nodes');
        assert(ball_ === nodes[0], 'should find ball');
        assert(root_ === nodes[1], 'should find root');
      });

      it('should find an element when starting point is a node', function() {
        nodes = CustomSelector.findAllInPath(ball_, 'foo');
        assert(nodes.length === 2, 'should find two nodes');
        assert(ball_ === nodes[0], 'should find ball');
        assert(root_ === nodes[1], 'should find root');
      });

      it('should find an element supporting ball', function() {
        nodes = CustomSelector.findAllInPath('#ball', 'ball');
        assert(nodes.length === 1, 'should find one node only');
        assert(ball_ === nodes[0], 'should find ball');
      });

      it('should return undefined if node does not support eggs', function() {
        nodes = CustomSelector.findAllInPath('#ball', 'eggs');
        assert(nodes.length === 0, 'should not find anything');
      });

      it('should return all nodes that supports x in nodeList', function() {
        nodes = CustomSelector.findAllInPath(
            'custom-selector-test-element', 'foo');
        assert(nodes.length === 1, 'should find only one node');
        assert(root_ === nodes[0], 'should find root');
      });

      it('should walk up to find nodes', function() {
        nodes = CustomSelector.findAllInPath('#ball', 'foo');
        assert(nodes.length === 2, 'should find two nodes');
        assert(ball_ === nodes[0], 'should find ball');
        assert(root_ === nodes[1], 'should find root');
      });

    });

    describe('findInSelection', function() {

      it('should find elements if caret is inside of them', function() {
        placeCaretInside_(coat_);
        node = CustomSelector.findInSelection('foo');
        assert(coat_ === node, 'should find coat');
      });

      it('should find elements if caret is "touching" them', function() {
        placeCaretAtStart_(desk_);
        node = CustomSelector.findInSelection('foo');
        assert(desk_ === node, 'should find desk');
      });

      it('should not find anything if caret in unsupported node', function() {
        placeCaretInside_(coat_);
        node = CustomSelector.findInSelection('atom');
        assert.isUndefined(node, 'should not find anything');
      });

      it('should find specific element inside a range selection', function() {
        selectAllNodes_();
        node = CustomSelector.findInSelection('coat');
        assert(coat_ === node, 'should find coat');
      });

      it('should find FIRST element inside a range selection', function() {
        selectAllNodes_();
        node = CustomSelector.findInSelection('atom');
        assert(atom_ === node, 'should find atom');
      });

      it('should not find anything if unsupported node is available inside a ' +
          'range selection', function() {
            root_.style['-webkit-user-modify'] = 'read-only';
            selectAllNodes_();
            node = CustomSelector.findInSelection('atom');
            assert.isUndefined(node, 'should not find anything');
            root_.style.removeProperty('-webkit-user-modify');
          });
    });

    describe('findAllInSelection', function() {

      it('should find elements if caret is inside of them', function() {
        placeCaretInside_(coat_);
        nodes = CustomSelector.findAllInSelection('foo');
        assert(nodes.length === 1, 'should find one node only');
        assert(coat_ === nodes[0], 'should find coat');
      });

      it('should find elements if caret is "touching" them', function() {
        placeCaretAtStart_(desk_);
        nodes = CustomSelector.findAllInSelection('foo');
        assert(nodes.length === 1, 'should find one node only');
        assert(desk_ === nodes[0], 'should find desk');
      });

      it('should not find anything if caret in unsupported node', function() {
        placeCaretInside_(coat_);
        nodes = CustomSelector.findAllInSelection('desk');
        assert(nodes.length === 0, 'should not find anything');
      });

      it('should find specific element inside a range selection', function() {
        selectAllNodes_();
        nodes = CustomSelector.findAllInSelection('coat');
        assert(nodes.length === 1, 'should find one node only');
        assert(coat_ === nodes[0], 'should find coat');
      });

      it('should find FIRST element inside a range selection', function() {
        selectAllNodes_();
        nodes = CustomSelector.findAllInSelection('coat');
        assert(nodes.length === 1, 'should find only one node');
        assert(coat_ === nodes[0], 'should find coat');
      });

      it('should not find anything if unsupported node is available inside a ' +
          'range selection', function() {
            root_.style['-webkit-user-modify'] = 'read-only';
            selectAllNodes_();
            nodes = CustomSelector.findAllInSelection('desk');
            assert(nodes.length === 0, 'should not find anything');
            root_.style.removeProperty('-webkit-user-modify');
          });
    });

    describe('findInSelectionChain', function() {

      it('should find elements if caret is inside of them', function() {
        placeCaretInside_(coat_);
        node = CustomSelector.findInSelectionChain('foo');
        assert(coat_ === node, 'should find coat');
      });

      it('should walk to find elements', function() {
        placeCaretAtStart_(desk_);
        node = CustomSelector.findInSelectionChain('root');
        assert(root_ === node, 'should find root');
      });

      it('should not find anything if caret in unsupported node', function() {
        placeCaretInside_(coat_);
        node = CustomSelector.findInSelectionChain('atom');
        assert.isUndefined(node, 'should not find anything');
      });

      it('should find specific element inside a range selection', function() {
        selectAllNodes_();
        node = CustomSelector.findInSelectionChain('coat');
        assert(coat_ === node, 'should find coat');
      });

      it('should find FIRST element inside a range selection', function() {
        selectAllNodes_();
        node = CustomSelector.findInSelectionChain('atom');
        assert(atom_ === node, 'should find atom');
      });

      it('should not find anything if unsupported node is available inside a ' +
          'range selection', function() {
            root_.style['-webkit-user-modify'] = 'read-only';
            selectAllNodes_();
            node = CustomSelector.findInSelectionChain('atom');
            assert.isUndefined(node, 'should not find anything');
            root_.style.removeProperty('-webkit-user-modify');
          });
    });

    describe('findAllInSelectionChain', function() {

      it('should find elements if caret is inside of them', function() {
        placeCaretInside_(coat_);
        nodes = CustomSelector.findAllInSelectionChain('foo');
        assert(nodes.length === 2, 'should find two nodes');
        assert(coat_ === nodes[0], 'should find coat');
        assert(root_ === nodes[1], 'should find root');
      });

      it('should walk to find elements', function() {
        placeCaretAtStart_(desk_);
        nodes = CustomSelector.findAllInSelectionChain('foo');
        assert(nodes.length === 2, 'should find two nodes');
        assert(desk_ === nodes[0], 'should find desk');
        assert(root_ === nodes[1], 'should find root');
      });

      it('should not find anything if caret in unsupported node', function() {
        placeCaretInside_(coat_);
        nodes = CustomSelector.findAllInSelectionChain('atom');
        assert(nodes.length === 0, 'should not find anything');
      });

      it('should find specific element inside a range selection', function() {
        selectAllNodes_();
        nodes = CustomSelector.findAllInSelectionChain('coat');
        assert(nodes.length === 1, 'should find one node only');
        assert(coat_ === nodes[0], 'should find coat');
      });

      it('should find ALL elements inside a range selection', function() {
        selectAllNodes_();
        nodes = CustomSelector.findAllInSelectionChain('coat');
        assert(nodes.length === 1, 'should find one node only');
        assert(coat_ === nodes[0], 'should find coat');
      });

      it('should not find anything if unsupported node is available inside a ' +
          'range selection', function() {
            root_.style['-webkit-user-modify'] = 'read-only';
            selectAllNodes_();
            nodes = CustomSelector.findAllInSelectionChain('atom');
            assert(nodes.length === 0, 'should not find anything');
            root_.style.removeProperty('-webkit-user-modify');
          });
    });

    // assumes node has one child which is a TEXT_NODE with 4 characters
    function placeCaretInside_(node) {
      var range = document.createRange();
      range.setStart(node.firstChild, 2);
      range.setEnd(node.firstChild, 2);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }

    // assumes node has one child which is a TEXT_NODE with 4 characters
    function placeCaretAtStart_(node) {
      var range = document.createRange();
      range.setStart(node.firstChild, 0);
      range.setEnd(node.firstChild, 0);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }

    function selectAllNodes_() {
      var range = document.createRange();
      range.selectNode(root_);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }

  });

  return {};
});
