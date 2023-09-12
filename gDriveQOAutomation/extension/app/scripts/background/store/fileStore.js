// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview With HTML5, web pages can store data locally
 * within the browser. The data is stored in key/value string
 * pairs, and only web pages from the same origin can access
 * the data that they store.
 *
 * One type of this web storage, called localStorage, stores
 * data with no expiration date. This means that the data can
 * outlive browser sessions.
 *
 * This module provides a store for the background page of
 * the Quickoffice app. The store uses localStorage to persist
 * information about Microsoft Office documents (Word, Excel
 * or Powerpoint) that have been opened in Quickoffice.
 * This information is used by other modules - for example,
 * the FileReaper.
 *
 * The store is structured as an object whose properties are UUID
 * strings. The value of each property is a FileDetails object
 * which contains the details of a Microsoft Office document
 * that was opened in Quickoffice
 *
 * @see FileDetails
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'background/store/fileDetails',
  'qowtRoot/utils/localStorageManager',
  'qowtRoot/utils/uuid'],
  function(
    FileDetails,
    LocalStorageManager,
    UUIDUtils) {

  'use strict';

  var api_ = {

    /**
     * Initialises the store.
     * Reads in the store content from localStorage if it was
     * previously persisted, otherwise initialises the store to empty
     */
    init: function() {
      return chromeStoreReady().
      then(copyLocalStorageIfNeeded).
      then(initStore_);
    },

    /**
     * Adds the given FileDetails object to the store
     * and returns the UUID 'key' that has been assigned
     * to the object
     *
     * @param {object} entry A FileDetails object
     * @return {string or undefined} The UUID 'key' or undefined
     *                               if the given entry was invalid
     */
    addEntry: function(entry) {
      var uuid;
      if(entry instanceof FileDetails) {
        entry.addObserver(persist_);
        uuid = UUIDUtils.generateUUID();
        chromeStorageStore_[uuid] = entry;
        persist_();
      }
      return uuid;
    },

    /**
     * Retrieves the FileDetails object
     * whose 'key' is the given UUID
     *
     * @param {string} The UUID 'key'
     * @return {object or undefined} A FileDetails object or undefined
     *                               if there was no such object for
     *                               the given 'key'
     */
    getEntry: function(uuid) {
      var entry = chromeStorageStore_[uuid];
      if (!entry) {
        entry = localStorageStore_[uuid];
        if (entry) {
          entry = Object.create(entry);
          entry.lsUsed = true;
        }
      }
      return entry;
    },

    /**
     * Searches for the given tab id in the store
     * and returns an array of the UUID 'key's of each
     * FileDetails object that was found to contain it,
     * or undefined if no match was found.
     *
     * Note that typically a tab id will only be contained
     * in a single entry, but if tab ids are reused by Chrome
     * then we can have a scenario where it is contained in
     * more than one entry
     *
     * @param {number} tabId The tab id to search for
     * @return {array or undefined} An array of the UUID 'key' of each
     *                              entry found to contain the given tab
     *                              id, or undefined if no match was found
     */
    findTabId: function(tabId) {
      var array = [];
      if(tabId) {
        for(var uuid in chromeStorageStore_) {
          if(chromeStorageStore_[uuid].tabId === tabId) {
            array.push(uuid);
          }
        }
        if (array.length === 0) {
          for(uuid in localStorageStore_) {
            if(localStorageStore_[uuid].tabId === tabId) {
              array.push(uuid);
            }
          }
        }
      }
      return array.length > 0 ? array : undefined;
    },

    /**
     * Removes all tab ids from the store's FileDetails objects.
     *
     * Note that this will leave all existing FileDetails objects
     * in the store, but each will have an undefined tabId property
     */
    removeAllTabIds: function() {
      for(var uuid in chromeStorageStore_) {
        chromeStorageStore_[uuid].tabId = undefined;
      }
      for(uuid in localStorageStore_) {
        localStorageStore_[uuid].tabId = undefined;
      }
    },

    /**
     * Removes from the store all FileDetails objects that
     * are associated with an orphaned private file.
     * The paths of the orphaned private files are returned.
     *
     * The orphans are determined by checking the provided list
     * of private temp files to see which of them are:
     * - not contained in the store
     * or
     * - are contained in the store but have 'expired' (i.e have no
     *   associated tab id and their timestamp is at least 90 days old)
     *
     * Note that any FileEntry in the provided list that is actually
     * a directory is ignored - we only process the top-level files
     * in the list
     *
     * @param {array} fileEntries An array of FileEntry objects
     * @return {array} An array of paths of each FileEntry that has
     *                 been identified as an orphaned private temp file
     */
    deleteOrphans: function(fileEntries) {
      var orphans = [];
      var len = fileEntries.length;
      for(var i = 0; i < len; i++) {
        var fileEntry = fileEntries[i];
        if(!fileEntry.isDirectory) {
          var privatePath = fileEntry.fullPath;
          var uuid = findPrivatePathCS_(privatePath);
          if(!chromeStorageStore_[uuid] || 
            chromeStorageStore_[uuid].hasExpired()) {
            // this file is an orphan - add it to the array
            // and delete its store entry (if there is one)
            orphans.push(privatePath);
            delete chromeStorageStore_[uuid];
          }
          uuid = findPrivatePath_(privatePath);
          if(!localStorageStore_[uuid] ||
            localStorageStore_[uuid].hasExpired()) {
            // this file is an orphan - add it to the array
            // and delete its store entry (if there is one)
            // orphans.push(privatePath);
            delete localStorageStore_[uuid];
          }
        }
      }
      persist_();
      return orphans;
    },

    /**
     * Returns the window object.
     * Exposed as a public API for use by Mocha tests
     */
    window__: function() {
      return window;
    }
  };

  // VVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVV

  var localStorageStore_;
  var chromeStorageStore_;

  var initStore_ = function() {
    return initStoreFromChromeStorage().then(initStoreFromLocalStorage);
  };

  var initStoreFromLocalStorage = function() {
    return new Promise(function(resolve) {
      try {
        // use the previously cached store if there is one
        localStorageStore_ = LocalStorageManager.getItem('qo_file_store');
        localStorageStore_ = localStorageStore_ ?
          JSON.parse(localStorageStore_) : {};
      }
      catch(e) {
        localStorageStore_ = {};
        console.warn('Failed to initialize file store ' +
          'so resetting it to be empty: ' + e);
      }
  
      // reconstruct the store to contain FileDetails objects
      reconstructFileDetails_();
      resolve();
    });
  };

  var initStoreFromChromeStorage = function() {
    return new Promise(function(resolve) {
      chrome.storage.local.get(['qo_file_store'], function(result) {
        var cs = result.qo_file_store;
        chromeStorageStore_ = (!cs || (Object.keys(cs).length === 0 &&
          cs.constructor === Object)) ?
          {} : JSON.parse(cs);
        // reconstruct the store to contain FileDetails objects
        reconstructFileDetailsFromCS_();
        resolve();
      });
    });
  };

  var persist_ = function() {
    var storeStr;

    // If for some reason the window call returns null, we must skip
    // file storage. We also cannot report this error using GA, since
    // that code also relies on Window.
    var win = api_.window__();
    if (win) {
      // storeStr = JSON.stringify(localStorageStore_);
      // LocalStorageManager.setItem('qo_file_store', storeStr);
      storeStr = JSON.stringify(chromeStorageStore_);
      // LocalStorageManager.setItem('qo_file_store', storeStr);
      chrome.storage.local.set({'qo_file_store': storeStr}, function() {
      });
    }
  };

  var reconstructFileDetails_ = function() {
    for(var uuid in localStorageStore_) {
      var entry = new FileDetails(localStorageStore_[uuid]);
      entry.addObserver(persist_);
      localStorageStore_[uuid] = entry;
    }
  };

  var reconstructFileDetailsFromCS_ = function() {
    for(var uuid in chromeStorageStore_) {
      var entry = new FileDetails(chromeStorageStore_[uuid]);
      entry.addObserver(persist_);
      chromeStorageStore_[uuid] = entry;
    }
  };

  var findPrivatePath_ = function(privatePath) {
    var resultUuid;
    if(privatePath) {
      for(var uuid in localStorageStore_) {
        if(localStorageStore_[uuid].privateFilePath === privatePath ||
            localStorageStore_[uuid].downloadFilePath === privatePath) {
          resultUuid = uuid;
          break;
        }
      }
    }
    return resultUuid;
  };

  var findPrivatePathCS_ = function(privatePath) {
    var resultUuid;
    if(privatePath) {
      for(var uuid in chromeStorageStore_) {
        if(chromeStorageStore_[uuid].privateFilePath === privatePath ||
          chromeStorageStore_[uuid].downloadFilePath === privatePath) {
          resultUuid = uuid;
          break;
        }
      }
    }
    return resultUuid;
  };

  var chromeStoreReady = function() {
    return new Promise(function (resolve) {
      chrome.storage.local.get(['chrome_store_ready'], function(result) {
        resolve(result.chrome_store_ready);
      });
    });
  };

  var copyLocalStorageIfNeeded = function(chromeStorageCopied) {
    return new Promise(function(resolve) {
      if (chromeStorageCopied) {
        resolve();
      } else {
        var store = LocalStorageManager.getItem('qo_file_store');
        store = store ? store : "";
        chrome.storage.local.set({'qo_file_store': store}, function() {
          chrome.storage.local.set({'chrome_store_ready': true}, function() {
            resolve();
          });
        });
      }
    });
  };

  return api_;
});
