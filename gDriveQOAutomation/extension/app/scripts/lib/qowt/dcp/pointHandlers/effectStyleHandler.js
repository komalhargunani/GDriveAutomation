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
 * This is the handler for theme effect styles.
 * @constructor
 */
define([
  'qowtRoot/drawing/theme/themeEffectStyleManager'
],
  function(ThemeEffectStyleManager) {

  'use strict';

    var _api = {
      etp: 'efstl',

      visit: function(v) {
        if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {
          // Create CSS classes of effect styles for shapes
          ThemeEffectStyleManager.
            createEffectStyleCSSClass(v.el.idx, v.el.efstlst);

          // Cache values of fill styles for canvas shape and place holders
          ThemeEffectStyleManager.
            cacheThemeEffectStyleLst(v.el.idx, v.el.efstlst);
        }
      }
    };

    return _api;
  });
