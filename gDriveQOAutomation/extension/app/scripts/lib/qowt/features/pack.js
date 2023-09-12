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
 * QOWT Feature Pack - app can override and point requireJs to it's own
 * feature pack by setting the requirejs.config paths correctly
 */
define([], function() {

  'use strict';

  // NOTE: save is by default false because qowt on it's own is
  // running in a sandbox'd iframe where we do not have access to
  // window.chrome.fileSystem for example.
  // The clienf of qowt (eg the app) can override this as long as
  // it supplies the right functionality to implement the save logic
  var _defaultFeatures = {
    edit: true,
    save: false,
    pointEdit: false,
    hats: true
  };

  return _defaultFeatures;
});
