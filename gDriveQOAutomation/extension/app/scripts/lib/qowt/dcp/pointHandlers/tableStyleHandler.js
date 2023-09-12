/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

/**
 * Handler for Table Styles
 * @constructor
 */

define([
  'qowtRoot/drawing/styles/tableStyles/tableStyleManager'
], function(TableStyleManager) {

  'use strict';

  var _api = {

    /**
     * DCP Type Code
     * This is used by the DCP Manager to register this Handler
     */
    etp: 'tbStyl',

    /**
     * create Css classes for table styles
     *
     * @param v {DCP} tableStyle DCP JSON
     */
    visit: function(v) {

      if (v && v.el && v.el.etp && v.el.etp === _api.etp) {
        TableStyleManager.cacheTableStyles(v.el);
      }

    }
  };

  return _api;
});
