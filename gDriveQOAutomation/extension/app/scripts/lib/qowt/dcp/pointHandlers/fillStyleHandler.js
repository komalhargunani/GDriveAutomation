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
 * This is the handler for theme fill styles.
 * @constructor
 */
define([
  'qowtRoot/drawing/theme/themeFillStyleManager'
],
  function(ThemeFillStyleManager) {

  'use strict';

    var _api = {
      etp: 'fillStl',

      visit: function(v) {
        if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {
          // Create CSS classes of fill styles for rectangular shapes
          ThemeFillStyleManager.createFillStyleCSSClass(v.el.idx, v.el.fill);

          // Cache values of fill styles for canvas shape and place holders
          ThemeFillStyleManager.cacheThemeFillStyle(v.el.idx, v.el.fill);
        }
      }
    };

    return _api;
  });
