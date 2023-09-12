define([
  'qowtRoot/utils/promiseUtils',
  'common/elements/text/para/word/wordPara'], function(
  PromiseUtils) {
  'use strict';

  describe('<qowt-word-para>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('para-test-template');
      element = document.querySelector('[is="qowt-word-para"]');
    });

    it('should mixin QowtElement', function() {
      assert.isTrue(element.isQowtElement, 'should mixin QowtElement');
    });

    it('should ignore <br> children from an emptiness perspective', function() {
      assert.isTrue(element.isEmpty(), 'start empty');
      element.appendChild(document.createElement('br'));
      assert.isTrue(element.isEmpty(), 'still empty');
      var lineBreak = new QowtLineBreak();
      Polymer.dom(element).appendChild(lineBreak);
      Polymer.dom(element).flush();
      assert.isFalse(element.isEmpty(), 'no longer empty');
    });

    it('should add a <br> element when its empty', function() {
      assert.equal(element.childElementCount, 1, 'has one child');
      assert.equal(element.children[0].nodeName, 'BR', 'child is <br>');
    });

    it('should remove the <br> element when it gets a child with content',
        function() {
      var x = document.createElement('span');
      x.innerText = 'Hello';
      Polymer.dom(element).appendChild(x);
      Polymer.dom(element).flush();
      // Need to return a promise because AddBrIfNeeded runs on mutation handler
      // thus we need to wait a macro turn before running our verification
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        assert.strictEqual(element.childElementCount, 1, 'still has one child');
        assert.strictEqual(element.children[0].nodeName, 'SPAN', 'is a <span>');
      });
    });

  });

  return {};
});
