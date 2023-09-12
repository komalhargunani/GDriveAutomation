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
 * This is the handler for theme background fill styles.
 * @constructor
 */
define([
  'qowtRoot/drawing/theme/themeFillStyleManager'
],
  function(ThemeFillStyleManager) {

  'use strict';

    var _api;

    _api = {
      etp: 'bgfillStl',

      visit: function(v) {
        if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {
          // Cache values of background fill styles
          ThemeFillStyleManager.cacheThemeFillStyle(v.el.idx,
              v.el.fill);
        }
      }
    };

    return _api;
  });
