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
 * This is the handler for theme line styles.
 * @constructor
 */
define([
  'qowtRoot/drawing/theme/themeLineStyleManager'
],
  function(ThemeLineStyleManager) {

  'use strict';

    for (var jelte = 0; jelte < arguments.length; jelte++) {
      var a = arguments[jelte];
      if (a === undefined) {
        console.warn("Argument " + jelte + " has circ dep");
      }
    }

    var _api = {
      etp: 'lnStl',

      /**
       * Handler to process DCP response for theme line style
       * @param v {DCP} the line style DCP JSON
       */
      visit: function(v) {
        if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {
          // Create CSS classes of line styles for rectangular shapes
          ThemeLineStyleManager.createLineStyleCSSClass(v.el.idx, v.el.ln);

          // Cache values of line styles for canvas shapes and place holders
          ThemeLineStyleManager.cacheThemeLineStyle(v.el.idx, v.el.ln);
        }
      }
    };

    return _api;
  });
