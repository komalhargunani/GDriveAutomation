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
  * Generic Erorr module.
  * This can be used as the base module for QOWT error events, or used
  * on it's own.
  *
  * Specific errors can derive from this guy and override what they need.
  */
define([
    'qowtRoot/utils/i18n'
  ], function(
    i18n) {

  'use strict';

  var _defaultErrorId = 'generic_error';

  var _factory = {

    /**
     * Generic error ID
     *
     * You MUST override this when deriving your own error event.
     * These IDs are used to find a matching localised strings.
     * Specifcally, a summary string, see shortMsg(), assumed the string is has
     * '_short_msg' appended.
     * And a longer descriptive string is returned, see msg(), by appending
     * '_msg' to the id.
     */
    errorId: _defaultErrorId,

    create: function(errId) {

      errId = errId || _defaultErrorId;

      // use module pattern for instance object
      var module = function() {

        var evt = {

          errorId: errId,

          /**
           * event type used by PubSub as the identifier during publish
           */
          eventType: "qowt:error",

          /**
           * Retrieve the localised error string for this errorId.
           * This is a longer user readable description of the
           * error.
           */
          msg: function() {
            return i18n.getMessage(this.errorId + "_msg");
          },

          /**
           * Retrieve a short summary localised string for this errorId.
           * This is a short user readable message of the
           * error which can be used as the title of an error dialog for
           * example.
           */
          shortMsg: function() {
            return i18n.getMessage(this.errorId + "_short_msg");
          },

          /**
           * Errors are non-fatal by default.
           * Fatal errors are non-recoverable, preventing further app use.
           * Non-fatal errors inform the user and allowed continued use.
           */
          fatal: false

        };

        return evt;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});
