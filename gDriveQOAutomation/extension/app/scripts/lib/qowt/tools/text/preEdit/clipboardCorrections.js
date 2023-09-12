/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview make corrections on the clipboard before accepting
 * the edits.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/tools/text/preEdit/widowOrphanHelper',
  ], function(WidowOrphanHelper) {

  'use strict';

  var _api = {

    /**
     * In particular for paste we stop normal paste from happening,
     * since it will default to pasting HTML, which can cause spans
     * inside spans and cause all sorts of problems for us.
     * Instead, just insert the plain text at the caret position
     */
    handle: function(evt) {
      if (evt && evt.type) {
        switch(evt.type) {

        case 'cut':
          // unbalance our content so we get something sensible on the clipboard
          WidowOrphanHelper.unbalanceSelection();
          break;

        case 'paste':
          if(evt.clipboardData && evt.clipboardData.getData) {
            var plainText = evt.clipboardData.getData('text/plain');
            if(plainText) {
              // (363288) Delay the execution of 'insertText' until after the
              // current call stack has finished. This avoids triggering
              // Chromium code that prevents nested (recursive) invocations
              // of execCommand(). In this case, we avoid execCommand('paste')
              // calling execCommand('insertText').
              window.setTimeout(function() {
                document.execCommand('insertText', false, plainText);}, 0);
            }
          }
          evt.preventDefault();
          break;

        default:
          break;
        }
      }
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});

