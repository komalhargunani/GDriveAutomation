/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview PRIOR to allowing any edit from occurring,
 * we need to make sure we:
 *   a- unbalance any widow/orphans at the caret position
 *   b- remove any selected range
 *   c- apply any transient formatting that is stored
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/tools/text/preEdit/transientFormattingHelper',
  'qowtRoot/tools/text/preEdit/widowOrphanHelper'], function(
  TransientFormattingHelper,
  WidowOrphanHelper) {

  'use strict';

  var _api = {
    /**
     * Handle the text input event and blocking the event from
     * continuing if needed. See fileoverview section
     *
     * @param {TextInput Event} evt the text input event fired BEFORE the
     *                          actual edit happens.
     */
    handle: function(evt) {
      WidowOrphanHelper.unbalanceSelection();

      // Check if there is any transient formatting which we
      // might have to apply before accepting the input.
      return TransientFormattingHelper.createRunIfNeeded(evt);
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv

  return _api;

});
