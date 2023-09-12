/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview public background page API
 *
 * Note, the app uses chrome.runtime.getBackgroundPage to
 * retrieve the page, rather than some fancy RequireJs.
 *
 * We therefore expose our public api directly on the
 * background page's window object.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'background/fileReaper',
  'background/store/fileDetails',
  'background/store/fileStore',
  'background/chromeHandler',
  'qowtRoot/errors/errorCatcher',
  'qowtRoot/errors/qowtSilentError',
  ], function(
    FileReaper,
    FileDetails,
    FileStore,
    ChromeHandler,
    ErrorCatcher,
    QOWTSilentError) {

  'use strict';

  /**
   * Used by Drive Web UI; This will cache the id(s)
   * of the Drive doc(s) that have been asked to be opened.
   *
   * @param {array} docIds the Drive doc id(s)
   * @return {promise} A promise that resolves when QO has been
   *                   launched in a new tab (or a number of new tabs
   *                   if there is more than one provided Drive doc id)
   */
  window.handleDriveDoc = function(docIds, resourceKeys) {
    return ChromeHandler.handleDriveDoc(docIds, resourceKeys);
  };

  /**
   * Gets the preferred filename from Content-Disposition header
   *
   * @private
   * @return {string} The preferred filename
   */
  function getPreferredFilename_(response_headers) {

    if (response_headers) {
      var disposition = response_headers['Content-Disposition'] ||
                        response_headers['content-disposition'];

      if (disposition) {
        try {
          var filename = disposition.split('=')[1].trim().replace(/\"/g, "");
          return filename;
        } catch(e) {
          ErrorCatcher.handleError(
              new QOWTSilentError('Failed to parse Content-Disposition ' +
                                  'Header: ' + e));
          return;
        }
      }
    }
  }

  /**
   * Registers a mime handler stream with the background page, returning the
   * UUID 'key' assigned to the stream.
   *
   * @return {string or undefined} The UUID 'key' or undefined
   *                               if the given entry was invalid
   */
  window.registerMimeHandlerStream = function(streamInfo) {
    return FileStore.addEntry(
      new FileDetails({
        mimeType: streamInfo.mimeType,
        streamURL: streamInfo.streamUrl,
        originalURL: streamInfo.originalUrl,
        tabId: streamInfo.tabId,
        preferredFilename:
            getPreferredFilename_(streamInfo.responseHeaders),
        embedded: streamInfo.embedded
      }));
  };

  /**
   * Retrieves the cache entry of the given uuid 'key'
   *
   * @param {string} The uuid whose cache entry is to be returned
   * @return {object or undefined} A FileDetails object or undefined
   *                               if there was no such object for
   *                               the given uuid 'key'
   */
  window.getFileDetails = function(uuid) {
    return FileStore.getEntry(uuid);
  };

  /**
   * Adds a lock on the file reaper for the given tab id
   *
   * @param {number} tabId The tab id to add a lock for
   */
  window.addReaperLock = function(tabId) {
    FileReaper.addLock(tabId);
  };

  /**
   * Removes a lock on the file reaper for the given tab id
   *
   * @param {number} tabId The tab id to remove a lock for
   */
  window.removeReaperLock = function(tabId) {
    FileReaper.removeLock(tabId);
  };

  /**
   * Updates the tab id that is cached for the given uuid
   *
   * @param {string} uuid The uuid whose cache entry is to be updated
   * @param {number} tabId The tab id to cache
   */
  window.cacheTabId = function(uuid, tabId) {
    var entry = FileStore.getEntry(uuid);
    if(entry) {
      entry.tabId = tabId;
    }
  };

  /**
   * Updates the private file path that is cached for the given uuid
   *
   * @param {string} uuid The uuid whose cache entry is to be updated
   * @param {string} privatePath The private path to cache
   */
  window.cachePrivateFilePath = function(uuid, privatePath) {
    var entry = FileStore.getEntry(uuid);
    if(entry) {
      entry.privateFilePath = privatePath;
    }
  };

  /**
   * Updates the download file path that is cached for the given uuid
   *
   * @param {string} uuid The uuid whose cache entry is to be updated
   * @param {string} downloadFilePath The download path to cache
   */
  window.cacheDownloadFilePath = function(uuid, downloadFilePath) {
    var entry = FileStore.getEntry(uuid);
    if (entry) {
      entry.downloadFilePath = downloadFilePath;
    }
  };

  /**
   * Updates the timestamp that is cached for
   * the given uuid to be the current time
   *
   * @param {string} uuid The uuid whose cache entry is to be updated
   */
  window.cacheTimestamp = function(uuid) {
    var entry = FileStore.getEntry(uuid);
    if(entry) {
      entry.timestamp = new Date().getTime();
    }
  };

  return {};
});
