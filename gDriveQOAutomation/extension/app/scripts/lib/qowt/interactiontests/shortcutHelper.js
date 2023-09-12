// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview
 * Provide platform specific shortcut key commands
 * for use in E2E interaction tests.
 *
 * Usage Notes: The execute function must be called inside
 * its own runs() block because it is a separate call to
 * the Keyboard.type() function.
 * The keyboard uses promises to schedule event dispatch
 * so two calls to the type() function in the same runs()
 * block will dispatch the events asynchronously.
 *
 * Example of using the bold shortcut and typing text:
 *
 * runs(function() {
 *   Shortcuts.execute('bold');
 * });
 * // If the selection is collapsed the bold shortcut will not generate
 * // any commands so waiting for eventsHandled will timeout.
 * WaitFor.mockKeyboard();
 * runs(function() {
 *   Keyboard.type(text('in bold'));
 * });
 * WaitFor.eventsHandled();
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/interactiontests/waitHelper',
  'qowtRoot/utils/platform',
  'qowtRoot/utils/mockKeyboard/keyboard',
  'qowtRoot/utils/mockKeyboard/keys'], function(
  WaitFor,
  Platform,
  Keyboard,
  keys) {

  'use strict';

  var api_ = {

    /**
     * Tell the mock keyboard to dispatch events for the key combo for a
     * specific shortcut command, then wait for any events to be handled.
     * @param {String} shortcut The name of the shortcut to execute.
     */
    execute: function(shortcut) {
      if (!keyCombos_[shortcut]) {
        throw(new Error('Unknown shortcut ' + shortcut));
      }
      Keyboard.type(keyCombos_[shortcut]);
      // Events generated for keyboard combos do not actually invoke
      // the command so we force the browser to execute the command.
      switch (shortcut) {
        case 'cut':
          document.execCommand('cut', false);
          break;
        case 'copy':
          document.execCommand('copy', false);
          break;
        case 'paste':
          document.execCommand('paste', false);
          break;
        case 'selectAll':
          document.execCommand('selectAll', false);
          break;
        default:
          // Do nothing.
          break;
      }
    },

    doUndo: function() {
      WaitFor.runsEdit(function() {
        api_.execute('undo');
      }, 'Shortcuts.execute undo');
    },

    doRedo: function() {
      WaitFor.runsEdit(function() {
        api_.execute('redo');
      }, 'Shortcuts.execute redo');
    }

  };

  // PRIVATE ===================================================================

  var metaKey_ = Platform.isOsx ? 'cmd' : 'ctrl',
      metaKeyTopLevel_ = Platform.isOsx ? 'ctrl' : null,
      keyCombos_ = {
        bold:  keys(metaKey_, 'b'),
        italic: keys(metaKey_, 'i'),
        underline: keys(metaKey_, 'u'),
        strikethrough: keys('alt', 'shift', '5'),
        cut: keys(metaKey_, 'x'),
        copy: keys(metaKey_, 'c'),
        paste: keys(metaKey_, 'v'),
        undo: keys(metaKey_, 'z'),
        redo: keys(metaKey_, 'y'),
        save: keys(metaKey_, 's'),
        saveAs: keys(metaKey_, 'shift', 's'),
        selectAll: keys(metaKey_, 'a'),
        zoomIn: keys(metaKey_, '+'),
        zoomOut: keys(metaKey_, '-'),
        zoomReset: keys(metaKey_, '0'),
        hideSlide: keys(metaKey_, 'h'),
        unhideSlide: keys(metaKey_, 'u'),
        duplicateSlide: keys(metaKey_, 'd'),
        moveSlideUp: keys(metaKey_, 'up'),
        moveSlideDown: keys(metaKey_, 'down'),
        moveSlideToStart: keys(metaKey_, 'shift', 'up'),
        moveSlideToEnd: keys(metaKey_, 'shift', 'down'),
        insertSlide: keys(metaKey_, 'm'),
        switchToNextSheet: keys(metaKey_, 'shift', 'pgdn'),
        switchToPreviousSheet: keys(metaKey_, 'shift', 'pgup'),
        alignLeft: keys(metaKey_, 'shift', 'l'),
        alignCenter: keys(metaKey_, 'shift', 'e'),
        alignRight: keys(metaKey_, 'shift', 'r'),
        alignJustified: keys(metaKey_, 'shift', 'j'),
        toggleNumbered: keys(metaKey_, 'shift', '7'),
        toggleBulleted: keys(metaKey_, 'shift', '8'),
        wordCount: keys(metaKey_, 'shift', 'c'),

        /* toplevel menu shortcuts */
        menuFile: keys(metaKeyTopLevel_, 'alt', 'f'),
        menuEdit: keys(metaKeyTopLevel_, 'alt', 'e'),
        menuFormat: keys(metaKeyTopLevel_, 'alt', 'o'),
        menuTools: keys(metaKeyTopLevel_, 'alt', 't'),
        menuHelp: keys(metaKeyTopLevel_, 'alt', 'h')
      };

  return api_;

});
