/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Constructor for the GetModifiedCellsCmd DCP Handler.
 * This handler processes the DCP response for a
 * GetModifiedCellsCmd command in its visit() method
 *
 * @constructor
 * @return {object} A GetModifiedCellsCmd DCP handler.
 */
define([],
    function() {

  'use strict';



  var _api = {


    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'mcr',

    /**
     * Processes the DCP response for a 'get modified cells' command.
     * This method does little - more happens in the contained DCP
     *
     * @param {object} v The DCP response as a nested JSON object.
     * @return {undefined} No object is returned.
     */
    visit: function(v) {
      if (!v || !v.el || !v.el.etp || (v.el.etp !== 'mcr')) {
        return undefined;
      }

      return undefined;
    },

    /**
     * Called after all of the child (i.e. cell) elements have been processed
     *
     * @param {object} v A row element in a DCP response.
     */
    postTraverse: function(/* v */) {
      return;
    }
  };

  return _api;
});
