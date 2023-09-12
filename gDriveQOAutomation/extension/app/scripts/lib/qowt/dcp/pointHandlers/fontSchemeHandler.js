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
 * This is the handler for a fontScheme.
 * @constructor
 */

define([
  'qowtRoot/drawing/theme/themeManager'
], function(ThemeManager) {

  'use strict';

  var _api = {
    etp: 'fntSchm',

    visit: function(v) {
      if (v && v.el && v.el.etp && (v.el.etp === _api.etp)) {
        ThemeManager.cacheThemeElement('fntSchm', v.el);
      }
    }
  };

  return _api;
});
