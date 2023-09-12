/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Module to handle the various
 * external (chrome) inputs, like Drive Web UI connections
 * or HTTP Streams, etc
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'background/store/fileStore',
  'background/store/fileDetails',
  'background/fileReaper',
  'utils/logUtils',
  'qowtRoot/third_party/when/when'
], function(
  FileStore,
  FileDetails,
  FileReaper,
  LogUtils,
  when) {

  'use strict';

  FileReaper.init();

  var api_ = {
    /**
     * Used by Drive Web UI; it will send us a message to determine
     * if this extension is "driveEnabled". We will respond by replying
     * that we are and that we also support Team Drives.
     *
     * @param {Port} port the port to which we respond with app version
     * @param {Object} msgObj the actual msg object sent by Drive Web UI
     */
    handleIncomingMsg: function(port, msgObj) {
      if (msgObj.msg === 'driveEnabled') {
        port.postMessage({
            'driveEnabled': true,
            'supportsTeamDrives': true
        });
      }
    },

    /**
     * Handler for public files from the Files app on ChromeOS. It will
     * add the files to the cache "to be opened" and then create tabs
     * for each.
     *
     * Note that several files can be opened at the same time if the user
     * multi-selects several files and chooses Quickoffice to open all of them.
     *
     * @param {Array} entries an 'entries' property which is an array of
     *                        FileEntry objects
     * @return {promise} A promise that resolves when QO has been
     *                   launched in a new tab (or a number of new
     *                   tabs if there is more than one provided FileEntry)
     */
    handleChromeOSFile: function(entries) {
      var promise,
          errorPromise = when.reject(
            new Error('No file entries were passed to open'));

      isValidWinFunc_ = isValidWinChromeOSFile_;
      if(entries) {
        var uuidArray = [];
        for(var i = 0; i < entries.length; ++i) {
          var entry = new FileDetails({
            userFile: entries[i].entry
          });
          uuidArray.push(FileStore.addEntry(entry));
        }
        promise = launchQO_(uuidArray, undefined, true);
      }

      return promise || errorPromise;
    },

    /**
     * Handler for Drive docs. It will add the files
     * to the cache and then create tabs for each.
     *
     * Note that several files can be opened at the same time if the user
     * multi-selects several files and chooses Quickoffice to open all of them.
     *
     * @param {Array} docIds An array of Drive doc ids
     * @return {promise} A promise that resolves when QO has been
     *                   launched in a new tab (or a number of new
     *                   tabs if there is more than one provided Drive doc id)
     */
    handleDriveDoc: function(docIds, resourceKeys) {
      var firstUUID,
          promise,
          errorPromise = when.reject(
            new Error('No drive doc ids were passed to open'));

      if(docIds) {
        var uuidArray = [];
        for(var i = 0; i < docIds.length; ++i) {
          var entry = new FileDetails({
            driveDocId: docIds[i],
            driveDocResourceKey: resourceKeys ? 
              resourceKeys[docIds[i]] : undefined
          });
          var uuid = FileStore.addEntry(entry);

          // we want to return the UUID of the first doc in the list,
          // which is busy being opened in the current tab. For the
          // remaining docs we need to open new tabs
          if(i === 0) {
            firstUUID = uuid;
          }
          else {
            uuidArray.push(uuid);
          }
        }

        if(uuidArray.length === 0) {
          // there was only one doc id so return its uuid immediately
          promise = when.resolve(firstUUID);
        }
        else {
          // otherwise return it after the other tabs have been launched
          promise = launchQO_(uuidArray).yield(firstUUID);
        }

      }

      return promise || errorPromise;
    },

    handleNewCreate: function(newDocument, mimeType) {
      var promise,
      errorPromise = when.reject(
        new Error('No file type was passed.'));

      isValidWinFunc_ = isValidWinChromeOSFile_;
      var uuidArray = [];
      var entry = new FileDetails({
        newDocument: newDocument,
        mimeType: mimeType
      });
      uuidArray.push(FileStore.addEntry(entry));
      promise = launchQO_(uuidArray, undefined, true);
      return promise || errorPromise;
    }

  };

  // --------------------- PRIVATE --------------------

  /**
   * Will launch a new tab with the Quickoffice extension.
   * It will attempt to open a new tab in the current window, if
   * there is one. Failing that it will attempt the last focused
   * window. Failing that it will create a new window to use.
   *
   * @private
   * @param {array} uuidArray An array of UUIDs; each one should
   *                          be added to the app's url in a tab
   * @param {string} opt_tabId optionally pass an existing tab id to update,
   *                           rather than creating a new tab
   * @param {boolean} focusTabInChromeOS optionally pass if it is called from
   *                          chromeOS file handler
   * @return {promise} A promise that resolves when QO has been
   *                   launched in one or more new or existing tabs
   *                   (depending on the number of provided uuids
   *                   and whether a tab id is provided)
   */
  function launchQO_(uuidArray, opt_tabId, focusTabInChromeOS) {
    var promise,
        count = uuidArray.length,
        arr = [];
    if(opt_tabId) {
      // if we were given a tab id, then use it
      // but still use a promise since this function
      // should always return a promise
      promise = updateTabWithQO_(opt_tabId, uuidArray[0], focusTabInChromeOS);
    }
    else {
      // else find the right window to update a tab in
      promise = getCurrentWindow_()
        .catch(function() {return getLastFocusedWindow_();})
        .catch(function() {return createNewWin_();})
        .then(function(win) {
          if (!isValidWinFunc_(win)) {
            throw new Error('Could not find valid window');
          } else {
            for (var i = 0; i < count; i++) {
              if (i === 0 && win.useTabId) {
                // only the first entry should go in the designated
                // tab id - after that, we want to create new tabs
                arr.push(updateTabWithQO_(win.useTabId, uuidArray[i],
                  focusTabInChromeOS));
              } else {
                arr.push(createTabWithQO_(win.id, uuidArray[i],
                  focusTabInChromeOS));
              }
            }
            return when.all(arr);
          }
        })
        .catch(LogUtils.logError);
    }

    return promise;
  }

  /**
   * Gets the last focused window
   *
   * @private
   * @return {promise} A promise that resolves
   *                   with the last focused window
   */
  function getLastFocusedWindow_() {
    return when.promise(function(resolve, reject) {
      chrome.windows.getLastFocused({populate: false}, function(win) {
        verifyWin_(win, resolve, reject);
      });
    });
  }

  /**
   * Gets the current window
   *
   * @private
   * @return {promise} A promise that resolves
   *                   with the current window
   */
  function getCurrentWindow_() {
    return when.promise(function(resolve, reject) {
      chrome.windows.getCurrent({populate: false}, function(win) {
        verifyWin_(win, resolve, reject);
      });
    });
  }

  /**
   * Creates a new window
   *
   * @private
   * @return {promise} A promise that resolves
   *                   with a new window
   */
  function createNewWin_() {
    return when.promise(function(resolve, reject) {
      chrome.windows.create({type: 'normal', focused: true}, function(win) {
        if (isValidWinFunc_(win)) {
          // the new window has a default tab
          // use it's tabId which we want to "update"
          win.useTabId = win.tabs[0].id;
          resolve(win);
        } else {
          reject(new Error('invalid window'));
        }
      });
    });
  }

  /**
   * Verifies that the given window is valid
   *
   * @private
   * @return {promise} A promise that resolves
   *                   if the given window is valid
   */
  function verifyWin_(win, resolve, reject) {
    if (isValidWinFunc_(win)) {
      resolve(win);
    } else {
      reject(new Error('invalid window'));
    }
  }

  /**
   * Creates a new tab in the given window
   * and provides it with the URL to load QO.
   * The url provided will contain the given
   * uuid as a query string
   *
   * @private
   * @return {promise} A promise that resolves
   *                   when a new tab has been created
   *                   and provided with the QO url
   */
  function createTabWithQO_(windowId, uuid, focusTabInChromeOS) {
    var queryPretext = '?uuid=';
    var conf = {
      active: focusTabInChromeOS ? focusTabInChromeOS: false,
      windowId: windowId,
      url: '../views/app.html' + queryPretext + uuid
    };

    return when.promise(function(resolve) {
      chrome.tabs.create(conf, resolve);
    });
  }

  /**
   * Updates the given tab by providing
   * it with the URL to load QO.
   * The url provided will contain the
   * given uuid as a query string.
   * This method also caches the given
   * tab id in the background page's
   * cache entry for the given uuid
   *
   * @private
   * @return {promise} A promise that resolves
   *                   when the given tab has been
   *                   provided with the QO url and
   *                   the tab id has been cached in
   *                   the background page
   */
  function updateTabWithQO_(tabId, uuid, focusTabInChromeOS) {
    // the Chrome Handler passes the uuid to the app in its URL
    var queryPretext = '?uuid=';
    var conf = {
      active: focusTabInChromeOS ? focusTabInChromeOS: false,
      url: '../views/app.html' + queryPretext + uuid
    };

    return when.promise(function(resolve, reject) {
      var entry = FileStore.getEntry(uuid);
      if(!entry) {
        reject();
      }
      else {
        entry.tabId = tabId;
        chrome.tabs.update(tabId, conf, resolve);
      }
    });
  }

  /**
   * Verifies whether the given window is valid
   *
   * @private
   * @return {boolean} True if the window is valid, otherwise false
   */
  function isValidWin_(win) {
    return (win && win.id !== undefined && !win.incognito);
  }

  /**
   * Verifies whether the given window is valid when opening files on ChromeOS.
   * This function considers an incognito window as valid since all windows in
   * guest mode on ChromeOS are reported as incognito windows.
   *
   * @private
   * @return {boolean} True if the window is valid, otherwise false
   */
  function isValidWinChromeOSFile_(win) {
    return (win && win.id !== undefined);
  }

  var isValidWinFunc_ = isValidWin_;

  return api_;
});
