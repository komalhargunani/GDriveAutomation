
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
 * JsDoc description
 */
define([
    'qowtRoot/dcp/unknownObjectHandler'
    ],
    function(UnknownObjectHandler) {

  'use strict';



  /**
   * @private
   * Always points at the current element the handler is processing
   */
  var _div;
  var _api = {
    /**
     * DCP Type Code is used by the DCP Manager to register this Handler
     */
    etp: 'wart',

    /**
     * This is the main Handler function that processes DCP
     * @param dcp {Object} Arbitrary DCP
     * @return {Element || undefined}
     */
    visit: function(dcp) {
      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === _api.etp)) {

        // WordArt not currently supported, create an Unknown Object
        _div = UnknownObjectHandler.buildUO(dcp.el.eid, dcp.el.hgt, dcp.el.wdt);
        return _div;
      } else {
        return undefined;
      }
    }
  };

  return _api;
});
