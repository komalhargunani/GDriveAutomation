/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE: The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */
define([],
    function() {

  'use strict';



  var _elm;
  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    'etp': 'lsep',

    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === 'lsep')) {
        var newSeparator = false;
        _elm = v.node.getElementById(v.el.eid);
        if (!_elm) {
          _createSeparator();
          _setSeparatorId(v.el.eid);
          newSeparator = true;
        }
        if (newSeparator) {
          v.node.appendChild(_elm);
        }

        return _elm;
      } else {
        return undefined;
      }
    },

    // Inter-render operation functions
    buildLSEP: function(eid) {
      _createSeparator();
      _setSeparatorId(eid);
      return _elm;
    }
  };

  var _createSeparator = function() {
    _elm = document.createElement('BR');
  };

  var _setSeparatorId = function(eid) {
    _elm.id = eid;
  };

  return _api;
});
