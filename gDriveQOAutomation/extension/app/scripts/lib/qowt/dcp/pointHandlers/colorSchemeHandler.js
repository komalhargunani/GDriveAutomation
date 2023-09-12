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
 * This is the handler for a  color-scheme.
 * @constructor
 */
define([
  'qowtRoot/drawing/theme/themeManager'
], function(ThemeManager) {

  'use strict';


  var _api, _themeManager;
  _api = {

    etp: 'clrSchm',

    visit: function(v) {

      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {

        if (_themeManager === undefined) {
          _themeManager = ThemeManager;
        }

        var colorScheme = v.el.schClrArr;
        _themeManager.cacheThemeElement(_api.etp, colorScheme);
      }
    }

  };

  return _api;
});
