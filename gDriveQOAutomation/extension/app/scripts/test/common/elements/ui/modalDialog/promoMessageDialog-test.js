define([], function() {

  'use strict';

  describe('promo-message-dialog element', function() {
    var dialog;

    beforeEach(function() {
      dialog = new QowtPromoMessageDialog();
    });

    afterEach(function() {
      dialog.destroy();
    });

    it('should be a QowtPromoMessageDialog instance', function() {
      assert.instanceOf(dialog, QowtPromoMessageDialog,
        'be QowtPromoMessageDialog.');
    });

    it('should be a HTMLDialogElement instance.', function() {
      assert.instanceOf(dialog, HTMLDialogElement, 'be a HTMLDialogElement.');
    });

    it('should be in the body after being shown', function(done) {
      assert.isNull(dialog.parentNode, 'dialog is not in DOM');
      dialog.addEventListener('dialog-shown', function() {
        assert.isNotNull(dialog.parentNode, 'dialog is in DOM');
        done();
      });
      dialog.show();
    });

    it('should show expected notification message in promo dialog',
      function(done) {
        dialog.headerText = 'Sample Promo Dialog';
        dialog.messageText = 'This notification is shown only once to user.';

        dialog.addEventListener('dialog-shown', function() {
          var header =
            Polymer.dom(dialog.root).querySelector('header');
          assert.equal(header.textContent, dialog.headerText,
            'Title is set in promo dialog');

          var msgElm =
            Polymer.dom(dialog.root).querySelector('#message');
          assert.equal(msgElm.textContent, dialog.messageText,
            'Notification message is set in promo dialog');
          done();
        });
        dialog.show();
      });

    it('should take expected action clicking learn more link in promo dialog',
      function(done) {
        dialog.additionalAction = function() {
          assert(true);
          done();
        };

        dialog.addEventListener('dialog-shown', function() {
          var event_ = document.createEvent('Event');
          event_.initEvent('click', true, false);
          Polymer.dom(dialog.root).querySelector('#action').
            dispatchEvent(event_);
        });
        dialog.show();
      });
  });
});
