/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mocha unit test for <qowt-butter-bar>
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

(function() {
  describe('qowt-butter-bar element', function() {
    var bar;

    beforeEach(function() {
      this.stampOutTempl('qowt-butter-bar-test-template');
      bar = this.getTestDiv().querySelector('qowt-butter-bar');
    });

    it('should be a QowtButterBar instance.', function() {
      assert.instanceOf(bar, QowtButterBar, 'should be a QowtButterBar.');
    });

    it('should have merged the QowtElement mixin.', function() {
      assert.isTrue(bar.isQowtElement, 'should be a QowtElement.');
    });

    it('should have required methods defined when upgraded.', function() {
      assertHasFunctions(bar, ['show', 'hide']);
    });

    xit('should have default empty message text.', function() {
      assert.propertyVal(bar, 'messageText', '');
    });

    xit('should have default empty action text.', function() {
      assert.propertyVal(bar, 'actionText', '');
    });

    xit('should be hidden after construction.', function() {
      assert.isFalse(bar.isShown(), 'bar.isShown() should be false.');
    });

    it('should default to a 10 second melt timer.', function() {
      assert.strictEqual(bar.meltTimer, 10000, 'oops');
    });

    xit('should be visible with provied text after calling show().',
     function() {
      bar.show('Dynamic', 'link', function() {});
      assert.isTrue(bar.isShown(), 'bar.isShown() should be true.');
      assert.strictEqual(bar.messageText, 'Dynamic',
          "messageText should have the value 'Dynamic'.");
      assert.strictEqual(bar.actionText, 'link',
          "actionText should have the value 'link'.");
    });

    xit('should be hidden after calling hide()', function() {
      bar.hide();
      assert.isFalse(bar.isShown(), 'bar.isShown() should be false.');
    });

    function assertHasFunctions(element, funcList) {
      funcList.forEach(function(funcName) {
        assert.isFunction(element[funcName], funcName);
      });
    }
  });
})();
