define([], function() {

  'use strict';

  describe('disallowed-cut-copy-paste-dialog element', function() {
    var dialog;

    beforeEach(function() {
      dialog = new QowtDisallowedCutCopyPasteDialog();
    });

    afterEach(function() {
      dialog.destroy();
    });

    it('should be a QowtDisallowedCutCopyPasteDialog instance', function() {
      assert.instanceOf(dialog, QowtDisallowedCutCopyPasteDialog,
        'be QowtDisallowedCutCopyPasteDialog.');
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
  });
});
