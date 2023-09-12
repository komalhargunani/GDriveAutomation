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
 * Point table row handler
 *
 * JSON --
 *
 * {
 * "etp" : "pTbleR",
 * "eid" : <id>,
 * "h" :  <row height in EMU>
 * "elm" :  [array of table cells JSON] // sequence matters
 * }
 *  *
 */
define([
  'qowtRoot/utils/idGenerator'
], function(IdGenerator) {

  'use strict';


  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'pTbleR',

    /**
     * Visit method which contribute in DCP manager's visitor pattern for
     * rendering table row
     * @param v visitable object as passed by DCP manager
     */
    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {
        var row = document.createElement('TR');
        //TODO remove getUniqueId() if we have v.el.eid in JSON
        row.id = v.el.eid || (IdGenerator.getUniqueId() + "Row");

        v.node.appendChild(row);
        return row;
      }
      else {
        return undefined;
      }
    }
  };

  return _api;
});
