/**
 * @fileoverview Mocha unit test for <qowt-keyboard-shortcuts-dialog>
 */
require([
    'qowtRoot/utils/platform',
    'common/elements/ui/modalDialog/modalDialog',
    'common/elements/ui/modalDialog/models/keyboardShortcuts/keyboardShortcuts'
    ], function(Platform) {

  'use strict';

  describe('empty qowt-keyboard-shortcuts-dialog', function() {
    var dialog;

    beforeEach(function() {
      dialog = new QowtKeyboardShortcutsDialog();
    });

    afterEach(function() {
      dialog.destroy();
      dialog = undefined;
    });

    it('should be a QowtKeyboardShortcutsDialog instance.', function() {
      assert.instanceOf(dialog, QowtKeyboardShortcutsDialog,
          'be a QowtKeyboardShortcutsDialog.');
    });

    it('should be a HTMLDialogElement instance.', function() {
      assert.instanceOf(dialog, HTMLDialogElement, 'be a HTMLDialogElement.');
    });

    it('should have not found any shortcuts to add', function(done) {
      dialog.addEventListener('qowt-shortcuts-dialog-loaded', function() {
        assert.deepEqual({}, dialog.shortcuts,
            'has an empty shortcuts object.');
        done();
      });
      dialog.show();
    });

    it('should have no groups', function(done) {
      dialog.addEventListener('qowt-shortcuts-dialog-loaded', function() {
        assert.deepEqual([], dialog.getGroups_(dialog.shortcuts),
            'has no group names');
        done();
      });
      dialog.show();
    });

    it('should give an empty list attempting to get items in a group that ' +
       'does not exist' , function(done) {
      dialog.addEventListener('qowt-shortcuts-dialog-loaded', function() {
        assert.isUndefined(dialog.getGroupItems_('Group Name'),
            'has no group names');
        done();
      });
      dialog.show();
    });
  });

  xdescribe('non-empty qowt-keyboard-shortcuts-dialog element', function() {

    var dialog, group, items;
    beforeEach(function() {
      group = 'Text formatting';
      var prefix = Platform.isOsx ? 'Option+' : 'Alt+';
      items = [
        {
          label: 'Bold',
          keys:  prefix + 'B'
        }, {
          label: 'Italic',
          keys: prefix + 'I'
        }, {
          label: 'Underline',
          keys: prefix + 'U'
        }
      ];

      this.stampOutTempl('qowt-keyboard-shortcuts-dialog-test-template');
      dialog = new QowtKeyboardShortcutsDialog();
    });

    afterEach(function() {
      dialog.destroy();
      dialog = undefined;
      group = undefined;
      items = undefined;
    });

    it('should have only added usable elements', function(done) {
      dialog.addEventListener('qowt-shortcuts-dialog-loaded', function() {
        assert.deepEqual(dialog.shortcuts, {
          'Text formatting': items
        }, 'all usable shortcuts added.');
        done();
      });
      dialog.show();
    });

    it('should give all group names with call to getGroups_', function(done) {
      dialog.addEventListener('qowt-shortcuts-dialog-loaded', function() {
        assert.deepEqual([group], dialog.getGroups_(dialog.shortcuts),
            'gave correct list of group names');
        done();
      });
      dialog.show();
    });

    it('should give items in a group with getGroupsItems_', function(done) {
      dialog.addEventListener('qowt-shortcuts-dialog-loaded', function() {
        assert.deepEqual(items, dialog.getGroupItems_(group),
            'gave correct list of keyboard shortcuts within a group');
        done();
      });
      dialog.show();
    });
  });
});
