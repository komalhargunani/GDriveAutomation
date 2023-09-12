/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Mocha unit test for <qowt-modal-dialog>
 *
 * @author cuiffo@google.com (Eric Cuiffo)
 */


require([], function() {

  'use strict';

  describe('qowt-modal-dialog element', function() {
    var dialog;

    beforeEach(function() {
      this.stampOutTempl('modal-dialog-test-template');
      dialog = document.querySelector('dialog');
    });

    afterEach(function() {
      dialog.destroy();
      dialog = undefined;
    });

    it('should not be open after creation.', function() {
      assert.isFalse(dialog.open, 'open should be false.');
    });

    it('should fire a "dialog-shown" event on show()', function(done) {
      dialog.addEventListener('dialog-shown', function() {
        assert(true);
        done();
      });
      dialog.show();
    });

    xit('should fire a "dialog-closed" event after close()', function(done) {
      dialog.addEventListener('dialog-closed', function() {
        assert(true);
        done();
      });
      dialog.addEventListener('dialog-shown', function() {
        dialog.close();
      });
      dialog.show();
    });

    it('should suppress default action of an event', function() {
      var event = { preventDefault: function () {} };
      var spy = sinon.spy(event, "preventDefault");
      dialog.suppressEvent_(event);
      assert(spy.calledOn(event));
    });
  });

  describe('qowt-remember-dialog template', function() {

    var dialog, storageKey;

    beforeEach(function() {
      dialog = new QowtRememberDialog();
      dialog.subtype = 'fake_subtype';
      storageKey = 'do_not_open_' + dialog.subtype + '_dialog';
    });

    afterEach(function() {
      dialog.destroy();
      dialog = undefined;
      storageKey = undefined;
    });

    it('should open if it has not been previously opened', function(done) {
      window.localStorage.removeItem(storageKey);
      dialog.addEventListener('dialog-shown', function() {
        assert.isTrue(true, 'dialog has been opened');
        done();
      });
      dialog.showRememberDialog();
    });

    it('should not open if it has been previously opened', function() {
      window.localStorage.setItem(storageKey, true);
      dialog.showRememberDialog();
      assert.isFalse(dialog.open);
    });

    it('should be in the body after being shown', function(done) {
      window.localStorage.removeItem(storageKey);
      assert.isNull(dialog.parentNode, 'dialog is not in DOM');
      dialog.addEventListener('dialog-shown', function() {
        assert.isNotNull(dialog.parentNode, 'dialog is in DOM');
        done();
      });
      dialog.showRememberDialog();
    });
  });
});
