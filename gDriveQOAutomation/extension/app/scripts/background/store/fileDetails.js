// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The background page has a persisted
 * FileStore which contains FileDetails objects.
 *
 * A FileDetails object contains information about a Microsoft
 * Office document (Word, Excel or Powerpoint) that the user
 * has opened in Quickoffice
 *
 * A FileDetails object has two purposes:
 *
 * 1. To store the details of a MS Office document that
 * a user has requested to open, so that the app can
 * retrieve these details during its initialisation
 *
 * 2. To store the tab id and private file path that
 * are associated with this document, for use by the
 * File Reaper and to potentially support the restoring
 * of unsaved changes if/when the document is reopened
 *
 * Note that users of this module can register a single observer
 * function - via the addObserver() method - that will be called
 * whenever the value of a property of this FileDetails object
 * is changed
 *
 * @see FileStore
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/utils/typeUtils',
  'qowtRoot/errors/qowtException'],
  function(
    TypeUtils,
    QOWTException) {

  'use strict';

  /**
   * Constructor
   *
   * @param {object} config A config object containing the values to
   *                        initialise this FileDetails object with
   */
  var FileDetails = function(config) {
    // initialise the object using the provided config values.
    // Note that the constructor handles the case where this object is being
    // reconstructed from a stringified localStorage object which contains
    // the private underscored properties of the original FileDetails object

    // properties populated for a streamed document
    this.mimeType = config.mimeType || config.mimeType_;
    this.streamURL = config.streamURL || config.streamURL_;
    this.originalURL = config.originalURL || config.originalURL_;
    this.preferredFilename =
        config.preferredFilename || config.preferredFilename_;

    // property populated for a Drive document
    this.driveDocId = config.driveDocId || config.driveDocId_;
    this.driveDocResourceKey = config.driveDocResourceKey ||
      config.driveDocResourceKey_;
    this.embedded = config.embedded || config.embedded_;

    // property populated for a local document on Chrome OS
    this.userFile = config.userFile || config.userFile_;

    //properly populate for new document create.
    this.newDocument = config.newDocument;

    // properties populated for use by the File Reaper,
    // regardless of the type of document above
    this.tabId = config.tabId || config.tabId_;
    this.privateFilePath = config.privateFilePath || config.privateFilePath_;
    this.downloadFilePath = config.downloadFilePath || config.downloadFilePath_;
    this.timestamp = config.timestamp || config.timestamp_;

    // a holder for an observer function incase
    // one is later provided via addObserver()
    this.observerFunc_ = undefined;

    // seal this object to prevent new
    // properties from being added to it
    Object.seal(this);
  };

  /**
   * Define the getter and setter methods.
   *
   * Note that whenever a setter method is called
   * then if an observer function has been provided
   * via addObserver() then it will be invoked
   */
  FileDetails.prototype = Object.create(Object.prototype, {
    /**
     * The id of the Chrome tab containing this document.
     * This property is mandatory - after the document
     * has been opened it will contain a value
     */
    tabId: {
      set: function(tabId) {
        this.tabId_ = tabId;
        this.invokeObserver_();
      },
      get: function() {
        return this.tabId_;
      }
    },

    /**
     * The path of the private file associated with this document.
     * This property is mandatory - after the document
     * has been opened it will contain a value
     */
    privateFilePath: {
      set: function(path) {
        this.privateFilePath_ = path;
        this.invokeObserver_();
      },
      get: function() {
        return this.privateFilePath_;
      }
    },

    /**
     * The path of the download file associated with this document.
     * This property is mandatory - after the document
     * has been opened it will contain a value
     */
    downloadFilePath: {
      set: function(path) {
        this.downloadFilePath_ = path;
        this.invokeObserver_();
      },
      get: function() {
        return this.downloadFilePath_;
      }
    },

    /**
     * The timestamp of this document.
     * This property is mandatory - after the document
     * has been opened it will contain a value
     */
    timestamp: {
      set: function(stamp) {
        this.timestamp_ = stamp;
        this.invokeObserver_();
      },
      get: function() {
        return this.timestamp_;
      }
    },

    /**
     * The mime type of this document.
     * This property is optional - e.g. it will be defined for a stream
     */
    mimeType: {
      set: function(mimeType) {
        this.mimeType_ = mimeType;
        this.invokeObserver_();
      },
      get: function() {
        return this.mimeType_;
      }
    },

    /**
     * The URL that Chrome uses to download this document.
     * This property is optional - e.g. it will be defined for a stream
     */
    streamURL: {
      set: function(url) {
        this.streamURL_ = url;
        this.invokeObserver_();
      },
      get: function() {
        return this.streamURL_;
      }
    },

    /**
     * The actual web URL of this document.
     * This property is optional - e.g. it will be defined for a stream
     */
    originalURL: {
      set: function(url) {
        this.originalURL_ = url;
        this.invokeObserver_();
      },
      get: function() {
        return this.originalURL_;
      }
    },

    /**
     * The filename associated with the URL for this document
     * This property is optional - e.g. it may be defined for a stream
     * if the Content-Disposition header response is provided.
     */
    preferredFilename: {
      set: function(filename) {
        this.preferredFilename_ = filename;
        this.invokeObserver_();
      },
      get: function() {
        return this.preferredFilename_;
      }
    },

    /**
     * The FileEntry object of this document,
     * which was opened locally on ChromeOS.
     * This property is optional - e.g. it will
     * be defined for a local document on ChromeOS
     */
    userFile: {
      set: function(fileEntry) {
        this.userFile_ = fileEntry;
        this.invokeObserver_();
      },
      get: function() {
        return this.userFile_;
      }
    },

    /**
     * The Drive id of this document.
     * This property is optional - e.g. it
     * will be defined for a Drive document
     */
    driveDocId: {
      set: function(docId) {
        this.driveDocId_ = docId;
        this.invokeObserver_();
      },
      get: function() {
        return this.driveDocId_;
      }
    }
  });

  FileDetails.prototype.constructor = FileDetails;

  /**
   * Add an observer function that will be called whenever the
   * value of a property of this FileDetails object is changed.
   *
   * The FileStore uses this method to add the function that persists
   * the FileStore in its current state, therefore ensuring that any
   * time a change is made to this FileDetails object that it will
   * automatically be persisted in the FileStore
   *
   * @param {function} obsFunc An observer function
   */
  FileDetails.prototype.addObserver = function(obsFunc) {
    if(!TypeUtils.isFunction(obsFunc)) {
      throw new QOWTException('Non-function ' +
        'observer provided to FileDetails object');
    }
    this.observerFunc_ = obsFunc;
  };

  /**
   * Determines if this FileDetails object has expired.
   * It has expired if it has no associated tab id and
   * its timestamp is at least 90 days old
   *
   * return {boolean} True if is has expired, otherwise false
   */
  FileDetails.prototype.hasExpired = function() {
    return !this.tabId &&
      (new Date().getTime() - this.timestamp > k90_DAYS_IN_MS);
  };

  /**
   * Returns a version of this FileDetails
   * object that can be stringified
   *
   * @return {object} A version of this object
   *                  that can be stringified
   */
  FileDetails.prototype.toJSON = function() {
    var clone = _.extend({}, this);
    clone.userFile_ = undefined;
    return clone;
  };

  // VVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVV

  var k90_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 90;

  FileDetails.prototype.invokeObserver_ = function() {
    if(this.observerFunc_) {
      this.observerFunc_();
    }
  };

  return FileDetails;
});
