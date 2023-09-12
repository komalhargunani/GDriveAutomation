define([
  'qowtRoot/utils/promiseUtils'
], function(PromiseUtils) {

  'use strict';

  describe("TrapFocus", function() {
    var td;
    beforeEach(function() {
      this.stampOutTempl('trap-focus-mixin-test-template');
      td = this.getTestDiv();
    });

    afterEach(function() {
      td = undefined;
    });

    it('should correctly set the start and end positions if focus-start and ' +
        'focus-end are both specified', function() {
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        var node = td.querySelector('#testElement');
        assert.instanceOf(node, window.TrapFocusTestElement,
            'test element registered correctly');

        var start = td.querySelector('#start');
        var end = td.querySelector('#end');
        assert.strictEqual(node.focusStart_, start, '#start is start');
        assert.strictEqual(node.focusEnd_, end, '#end is end');
      });
    });

    it('should set focus-start as the element if not specified', function() {
      return PromiseUtils.waitForNextMacroTurn().then(function() {
        var node = td.querySelector('#testElement2');
        assert.instanceOf(node, window.TrapFocusTestElement,
            'test element registered correctly');

        var end = td.querySelector('#end2');
        assert.strictEqual(node.focusStart_, node, 'element is start');
        assert.strictEqual(node.focusEnd_, end, '#end2 is end');
      });
    });
  });

  return {};
});
