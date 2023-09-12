/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Prior to an edit that is caused by a keydown event, we need
 * to check that the edit is valid and take appropriate actions.
 *
 * @author dtilley@google.com (Dan Tilley)
 */
define([
  'qowtRoot/tools/text/preEdit/widowOrphanHelper'], function(
    WidowOrphanHelper) {

  'use strict';

  var _api = {

    /**
     * Handle the keydown event and block the event from
     * continuing if needed.
     * @param {keydown Event} evt The keydown event fired before the
     *                            actual edit happens.
     */
    handle: function(evt) {
      if (evt && evt.keyCode && (evt.keyCode === 13)) {

        WidowOrphanHelper.unbalanceSelection();

        if (evt.shiftKey) {
          // CRBUG 273071 Shift + Enter causes a new line character to be
          // inserted instead of the standard enter character which would cause
          // the paragraph to be split.
          // TODO (dtilley) This is a temporary resolution to the above bug.
          // We should replace this with proper soft line break support.
          evt.preventDefault();
        }
      }
    }

  };

  return _api;

});