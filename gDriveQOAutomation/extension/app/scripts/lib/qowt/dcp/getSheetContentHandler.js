/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Constructor for the GetSheetContent DCP Handler.
 * This handler processes the DCP response for a
 * GetSheetContent command in its visit() method
 *
 * @constructor
 * @return {object} A GetSheetContent DCP handler.
 */
define([],
    function() {

  'use strict';



  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'gsc',

    /**
     * Processes the DCP response for a 'get sheet content' command.
     * This method does nothing - the 'gsc' (row range) element in the
     * JSON response is really just a container for its child 'srw'
     * (row) objects, which are handled by SheetRowHandler
     *
     * @param {object} v The DCP response as a nested JSON object.
     * @return {undefined} No object is returned.
     */
    visit: function(/* v */) {
      return undefined;
    }
  };


  return _api;
});
