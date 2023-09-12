
(function() {
  describe('qowt-hyperlink-dialog element', function() {
    var hyperlinkDialog;

    beforeEach(function() {
      this.stampOutTempl('qowt-hyperlink-dialog-test-template');
      hyperlinkDialog =
          this.getTestDiv().querySelector('qowt-hyperlink-dialog');
    });

    it('should be a QowtHyperlinkDialog instance.', function() {
      assert.instanceOf(hyperlinkDialog, QowtHyperlinkDialog, 'should be a ' +
          'QowtHyperlinkDialog.');
    });

    it('should have merged the QowtElement mixin.', function() {
      assert.isTrue(hyperlinkDialog.isQowtElement, 'should be a QowtElement.');
    });

    it('should have required methods defined when upgraded.', function() {
      assertHasFunctions(hyperlinkDialog,
          ['show', 'hide', 'setPosition', 'isShowing']);
    });

    it('should have default empty message text.', function() {
      assert.propertyVal(hyperlinkDialog, 'messageText', '');
    });

    it('should have default empty action text.', function() {
      assert.propertyVal(hyperlinkDialog, 'actionText', '');
    });

    it('should have default msgToActivateLink text.', function() {
      assert.propertyVal(hyperlinkDialog, 'msgToActivateLink',
          'qowt_hyperlink_activate_short_key');
    });

    it('should be hidden after construction.', function() {
      assert.isFalse(hyperlinkDialog.isShowing(),
          'isShowing() should be false.');
    });

    it('should throw if show is called without actionText.', function() {
      assert.throw(function() {
        hyperlinkDialog.show();
      }, Error, /missing action text/);
    });

    it('should be visible with provided link and message text after ' +
        'calling show()', function() {
      hyperlinkDialog.show(true, 'http://www.google.com');
      assert.isTrue(hyperlinkDialog.isShowing(), 'isShowing() should be true.');
      assert.isTrue(hyperlinkDialog.showLinkInNewTab? true: false,
                'showLinkInNewTab should not be empty');
      assert.strictEqual(hyperlinkDialog.actionText, 'http://www.google.com',
          "actionText should have the value 'http://www.google.com'.");
      assert.isTrue(hyperlinkDialog.messageText? true: false,
          'message text should not be empty');
    });

    it('should change action text, if link length exceeds 30 characters ' +
        'after calling show()', function() {
      hyperlinkDialog.show(true, 'http://www.google.com/this/link/is/too/long');
      assert.isTrue(hyperlinkDialog.isShowing(), 'isShowing() should be true.');
      assert.isTrue(hyperlinkDialog.showLinkInNewTab, 'showLinkInNewTab ' +
          'should be true.');
      assert.strictEqual(hyperlinkDialog.actionText,
          'http://www.goog'+'\u2026'+'nk/is/too/long', "actionText should " +
              "have the value 'http://www.goog...nk/is/too/long'.");
      assert.strictEqual(hyperlinkDialog.link,
          'http://www.google.com/this/link/is/too/long',
          "link should have the original link value " +
              "'http://www.google.com/this/link/is/too/long'.");

    });

    it('should be set hidden after calling hide()', function() {
      hyperlinkDialog.hide();
      assert.isFalse(hyperlinkDialog.isShowing(),
          'isShowing() should be false.');
    });

    it('should set the default aria label for shortkey to activate link ' +
        'after calling show(), if value is not passed', function() {
      hyperlinkDialog.show(true, 'http://www.google.com');
      assert.isTrue(hyperlinkDialog.isShowing(), 'isShowing() should be true.');
      assert.isTrue(hyperlinkDialog.showLinkInNewTab ? true : false,
          'showLinkInNewTab should not be empty');
      assert.strictEqual(hyperlinkDialog.msgToActivateLink,
          'qowt_hyperlink_activate_short_key',
          "msgToActivateLink should have the value " +
              "qowt_hyperlink_activate_short_key");
    });

    it('should set correct aria label for shortkey to activate link ' +
        'after calling show(), if value is passed', function() {
      hyperlinkDialog.show(true, 'http://www.google.com',
          'Aria for shortcut message');
      assert.isTrue(hyperlinkDialog.isShowing(), 'isShowing() should be true.');
      assert.isTrue(hyperlinkDialog.showLinkInNewTab ? true : false,
          'showLinkInNewTab should not be empty');
      assert.strictEqual(hyperlinkDialog.msgToActivateLink,
          'Aria for shortcut message',
          "msgToActivateLink should have the value 'Aria for shortcut " +
              "message'");
    });

    function assertHasFunctions(element, funcList) {
      funcList.forEach(function(funcName) {
        assert.isFunction(element[funcName], funcName);
      });
    }
  });
})();
