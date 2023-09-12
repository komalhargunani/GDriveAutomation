/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mocha unit test for <qowt-notification-area>
 */

(function() {
  xdescribe('qowt-notification-area element', function() {
    var notification;

    beforeEach(function() {
      this.stampOutTempl('qowt-notification-area-test-template');
      notification = this.getTestDiv().querySelector('qowt-notification-area');
    });

    it('should be a QowtNotificationArea instance.', function() {
      assert.instanceOf(notification, QowtNotificationArea,
        'should be a QowtNotificationArea.');
    });

    it('should have merged the QowtElement mixin.', function() {
      assert.isTrue(notification.isQowtElement, 'should be a QowtElement.');
    });

    it('should have required methods defined.', function() {
      assertHasFunctions(notification, ['show', 'close']);
    });

    it('should be hidden after construction.', function() {
      assert.isFalse(notification.isShown(),
        'notification.isShown() should be false.');
    });

    it('should be visible with provied text after calling show().', function() {
      notification.show('Showing message', function() {});
      assert.isTrue(notification.isShown(),
        'notification.isShown() should be true.');
      assert.strictEqual(notification.$.notificationDiv.textContent,
        'Showing message',
        "messageText should have the value 'Showing message'.");
    });

    it('should be hidden after calling close()', function() {
      notification.close();
      assert.isFalse(notification.isShown(),
        'notification.isShown() should be false.');
    });

    function assertHasFunctions(element, funcList) {
      funcList.forEach(function(funcName) {
        assert.isFunction(element[funcName], funcName);
      });
    }
  });
})();
