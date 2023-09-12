/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/utils/fontManager'], function(
    FontManager) {

  'use strict';


  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     * dfl = Document Font List
     */
    etp: 'dfl',

    /**
     * This is the main Handler function that processes DCP
     * @param {Object} dcp Arbitrary DCP.
     * @return {undefined} Not used currently.
     */
    visit: function(dcp) {
      // Error check to see if this is the correct Handler for this DCP
      if (dcp &&
          dcp.el &&
          dcp.el.etp &&
          (dcp.el.etp === _api.etp) &&
          (dcp.el.fl !== undefined)) {

        var fontNameList = dcp.el.fl;
        FontManager.initFonts(fontNameList);
      }
      return undefined;
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvv

  return _api;
});
