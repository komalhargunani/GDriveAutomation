/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview base "class" for QOWTError, QOWTException, etc
 * Should not be used on it's own...
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/utils/i18n',
  'third_party/lo-dash/lo-dash.min'
  ],
  function(
    TypeUtils,
    I18n) {

  'use strict';

  /**
   * Base 'class' for all QOWT errors.
   *
   * Can be constructed with a simple string, or
   * a config object. Strings are localised or used
   * as is (if there is no localised version found).
   *
   * Config objects can contain more information to
   * allow for short and long descriptions which
   * can be used by error observers (eg the errorScreen)
   *
   * For errors using plain strings, or configs missing
   * title/detail/link information, the error observers like
   * the ErrorScreen will likely use the detault error title/details/link text
   *
   * @param {sting|object} config     Either a string (i18n id or just string)
   *                                  or a configuration object containing any
   *                                  or none of the following:
   * @param {string} config.title     i18n id or string to be used as the title
   *                                  for this error. Also used as the actual
   *                                  error.message for console output
   * @param {string} config.details   i18n id or string to be used as the
   *                                  details of the error.
   * @param {number} config.code      A numeric error code.
   * @param {Object} config.linkData  "additional information" link data:
   * @param {string} config.linkData.msg  i18n id or string to be used as the
   *                                      text for "additional info" links
   * @param {string} config.linkData.url  The url to be used for the link
   * @param {string} config.linkData.download the name of the file to download
   *                                          if the link points to file blob
   */
  var LocalisedError = function(msg) {
    msg = msg || '';
    this.name = 'LocalisedError';

    // extend ourselves with all config properties
    if (TypeUtils.isObject(msg)) {
      _.extend(this, msg);
    }

    // get the most relevant msg as our proper Error.message
    this.message =
        (this.code ? this.code + ': ' : '') +
        (this.message || JSON.stringify(msg) || this.title || this.details ||
         this.additionalInfo);

    // now localise the UI related properties
    this.title = I18n.getMessage(this.title);
    this.details = msg.fileName ?
                   I18n.getMessage(this.details, msg.fileName) :
                   I18n.getMessage(this.details);
    if (this.linkData && this.linkData.msg) {
      this.linkData.msg =
          I18n.getMessage(this.linkData.msg) || this.linkData.msg;
    }

    // make sure we get the stack trace right
    Error.captureStackTrace(this, LocalisedError);
  };


  LocalisedError.prototype = Object.create(Error.prototype);
  LocalisedError.prototype.constructor = LocalisedError;

  return LocalisedError;
});

