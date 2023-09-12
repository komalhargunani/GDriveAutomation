// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview This is the handler for a Timing node (object animation data).
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([], function() {

  'use strict';

  /**
   * Public interface
   */
  var _api = {

    /**
     * DCP Type Code.
     * This is used by the DCP Manager to register this handler.
     */
    etp: 'tm',

    /**
     * Processes a 'tm' (Timing) element from a DCP response.
     *
     * @param {object} v A tm element from a DCP response.
     * @return {object} An animation object.
     */
    visit: function(/* v */) {
      return undefined;
    }
  };

  return _api;
});
