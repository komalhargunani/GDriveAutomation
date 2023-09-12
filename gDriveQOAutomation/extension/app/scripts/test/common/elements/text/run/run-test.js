define([
  'qowtRoot/utils/promiseUtils',
  'common/elements/text/run/run'], function(
  PromiseUtils) {
  'use strict';

  describe('<qowt-word-run>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('run-test-template');
      element = document.querySelector('[is="qowt-word-run"]');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should NOT add a <br> when its empty and has a sibling', function() {
      var dummySibling = document.createElement('span');
      dummySibling.innerText = 'foobar';
      element.parentNode.appendChild(dummySibling);
      element.textContent = '';
      // Need to return a promise because AddBrIfNeeded runs on mutation handler
      // thus we need to wait a macro turn before running our verification
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        assert.strictEqual(element.childElementCount, 0, 'has no br child');
      });
    });

    it('should remove the <br> element when it gets a child', function() {
      element.textContent = 'foobar';
      // Need to return a promise because AddBrIfNeeded runs on mutation handler
      // thus we need to wait a macro turn before running our verification
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        assert.strictEqual(element.childElementCount, 0, 'no br child');
      });
    });

    it('should be possible to break a run in to two', function() {
      var originalText = element.textContent;
      var newEl = element.breakRun(3);
      assert.strictEqual(element.textContent, originalText.substring(0, 3),
          'element text equals part before the break');
      assert.strictEqual(newEl.textContent, originalText.substring(3),
          'element text equals part after the break');
    });

    it('should ensure the broken/new run has the same styling', function() {
      var newEl = element.breakRun(3);
      assert.strictEqual(element.style.cssText, newEl.style.cssText,
          'new element style equals original element');
    });

    it('should ensure the broken/new run has a unique ID', function() {
      var newEl = element.breakRun(3);
      assert.notEqual(element.getEid(), newEl.getEid(),
          'new element ID is different from original element ID');
    });
  });

  return {};
});
