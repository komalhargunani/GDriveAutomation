/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mocha unit test for <qowt-message-bar>
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

(function() {
  xdescribe('qowt-message-bar element', function() {
    var bar;

    beforeEach(function() {
      this.stampOutTempl('qowt-message-bar-test-template');
      bar = this.getTestDiv().querySelector('qowt-message-bar');
    });

    it('should be a QowtMessageBar instance.', function() {
      assert.instanceOf(bar, QowtMessageBar, 'should be a QowtMessageBar.');
    });

    it('should have merged the QowtElement mixin.', function() {
      assert.isTrue(bar.isQowtElement, 'should be a QowtElement.');
    });

    it('should have required methods defined when upgraded.', function() {
      assertHasFunctions(bar, ['show', 'hide', 'isShown']);
    });

    it('should have default empty message text.', function() {
      assert.propertyVal(bar, 'messageText', '');
    });

    it('should have default empty action text.', function() {
      assert.propertyVal(bar, 'actionText', '');
    });

    it('should be hidden after construction.', function() {
      assert.isFalse(bar.isShown(), 'isShown() should be false.');
    });

    it('should throw if show is called without 3 arguments.',
        function() {
      assert.throw(function() {
        bar.show();
      }, Error, /missing message or action text/);
    });

    it('should throw if show is called without a callback function.',
        function() {
      assert.throw(function() {
        bar.show('message', 'action');
      }, Error, /missing callback/);
    });

    it('should throw if show is called with a non-function callback arugment.',
        function() {
      assert.throw(function() {
        bar.show('message', 'action', 'callback');
      }, Error, /missing callback/);
    });

    it('should be visible with provied text after calling show().', function() {
      bar.show('Dynamic', 'link', function() {});
      assert.isTrue(bar.isShown(), 'isShown() should be true.');
      assert.strictEqual(bar.messageText, 'Dynamic',
          "messageText should have the value 'Dynamic'.");
      assert.strictEqual(bar.actionText, 'link',
          "actionText should have the value 'link'.");
    });

    it('should be hidden setafter calling hide()', function() {
      bar.hide();
      assert.isFalse(bar.isShown(), 'isShown() should be false.');
    });

    it('should have correct ARIA attributes set to message bar when it is ' +
        'shown.', function() {
      bar.show('Message', 'Action', function() {});
      assert.isTrue(bar.isShown(), 'isShown() should be true.');
      assert.strictEqual(bar.$.action.getAttribute('role'), 'button',
          'role is button');
      assert.strictEqual(bar.$.action.getAttribute('aria-disabled'), 'false');
      assert.strictEqual(bar.$.action.getAttribute('aria-hidden'), 'false');
      assert.strictEqual(bar.$.action.getAttribute('aria-label'),
          'Message Action', 'Label is message + action');
    });

    it('should have correct ARIA attributes set to message bar when it is ' +
        'hidden.', function() {
      bar.hide();
      assert.isFalse(bar.isShown(), 'isShown() should be false.');
      assert.strictEqual(bar.$.action.getAttribute('role'), 'button',
          'role is button');
      assert.strictEqual(bar.$.action.getAttribute('aria-disabled'), 'true');
      assert.strictEqual(bar.$.action.getAttribute('aria-hidden'), 'true');
    });

    function assertHasFunctions(element, funcList) {
      funcList.forEach(function(funcName) {
        assert.isFunction(element[funcName], funcName);
      });
    }
  });
})();
