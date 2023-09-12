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
 * This is the handler for a Theme Element.
 * @constructor
 */
define([
  'qowtRoot/models/point'
], function(PointModel) {

  'use strict';


  var _api = {
    /* DCP Type Code
     This is used by the DCP Manager to register this Handler */
    etp: 'thm',

    /**
     * Render a Slide element from DCP
     * @param v {DCP} Theme DCP JSON
     * @return {Object}
     */
    visit: function(v) {

      if (v && v.el && v.el.etp && v.el.etp === _api.etp && v.el.eid) {

        PointModel.ThemeId = v.el.eid;
      }
    }
  };

  return _api;
});
