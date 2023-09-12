// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview The file reaper is responsible for checking
 * if there are any private temp files that are candidates
 * for garbage collection. If there are then the file reaper
 * will delete those files from the file system.
 *
 * The work of the file reaper ensures that we don't bloat the file
 * system with 'dead' private temp files and that we comply with
 * the company-wide user data deletion policy.
 *
 * A private temp file becomes a candidate for garbage collection
 * when:
 *
 * - The user closes the document (Word, Excel or Point)
 *   that is associated with the private temp file
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'background/store/fileStore',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/third_party/when/when',
  'qowtRoot/features/utils',
  'third_party/lo-dash/lo-dash.min'
  ],
  function(
    FileStore,
    TypeUtils,
    when,
    Features) {

    'use strict';

  var api_ = {

    /**
     * Initialises the file reaper
     */
    init: function() {
      // check that we can get access to the file system and if this
      // is successful then start listening for 'tab removed' events
      when(getFs_()).then(listenForClosingTabs_);
    },

    /**
     * Adds a lock on the file reaper for the given tab id.
     *
     * If locked the file reaper will not delete
     * any private temp files from the file system.
     * This is used to prevent the file reaper from
     * deleting the private temp file of a newly opened
     * document which has not yet been added to the cache.
     *
     * Note that the lock takes effect even if it is
     * applied *during* an active purge by the file reaper.
     *
     * Also note that the lock acts as a semaphore which
     * supports multiple calls to addLock/removeLock
     *
     * @param {number} tabId The tab id to add a lock for
     */
    addLock: function(tabId) {
      locked_.push(tabId);
    },

    /**
     * Removes a lock on the file reaper for the given tab id.
     *
     * If this is the final lock to be removed (the lock
     * acts as a semaphore) then the file reaper is able
     * to delete private temp files from the file system
     *
     * @param {number} tabId The tab id to remove a lock for
     */
    removeLock: function(tabId) {
      var idx = locked_.indexOf(tabId);
      if(idx !== -1) {
        locked_.splice(idx, 1);
      }
    }
  };

  // VVVVVVVVVVVVVVVVVVVV PRIVATE VVVVVVVVVVVVVVVVVVVVVVVV

  var KTimeout_Interval_ = 300000, // 5 mins
      KThrottle_Interval_ = 30000, // 30 seconds
      token_,
      timedOut_ = false,
      filesList_ = [],

      /**
       * A semaphore to support addLock/removeLock calls from multiple tabs
       */
      locked_ = [],

      /**
       * A semaphore to keep track of multiple async callbacks
       */
      inProgress_ = 0;

  /**
   * A self-invoking function which is executed on load.
   *
   * It creates a named function that, when called, returns
   * a promise that will be resolved with a handle to the
   * file system
   */
  var getFs_ = (function() {
    var fs; // global var that is 'private' to this function
    return function() {
      var deferred = when.defer();
      if(fs) {
        deferred.resolve(fs);
      }
      else {
        window.webkitRequestFileSystem(
          window.TEMPORARY,
          1024 * 1024, // 1MB
          function(fileSystem) {
            fs = fileSystem;
            deferred.resolve(fs);
          },
          function() {
            deferred.reject(new Error('File Reaper ' +
              'failed to access the file system'));
          }
        );
      }
      return deferred.promise;
    };
  })();

  /**
   * Starts listening for the event that occurs when a tab
   * is closed (this event occurs whether the tab is closed
   * directly or the browser that it is in is closed)
   */
  var listenForClosingTabs_ = function() {
    // create a throttled version of the commencePurge_() function so
    // that if a flurry of Quickoffice tabs are closed in quick succession
    // (e.g. a browser is closed) then commencePurge_() will be executed
    // for the first Quickoffice tab that is closed and then again
    // after the specified interval has passed if at least one other
    // Quickoffice tab is closed during that interval.
    // Note that we are using the _.throttle() utility method from
    // the lo-dash utility library, which exports itself as '_'
    var throttledPurge = _.throttle(commencePurge_, KThrottle_Interval_);
    chrome.tabs.onRemoved.addListener(
      function(tabId) {
        // if a lock is active for the given tab then remove
        // it now on the tab's behalf because the tab has been
        // closed before it could remove the lock itself
        api_.removeLock(tabId);

        if(FileStore.findTabId(tabId)) {
         throttledPurge();
        }
      });
  };

  /**
   * Commences a purge cycle.
   * Purging is a multi-phase process which:
   *
   * 1) Assumes that all private temp files in the file system
   *    are orphans, by removing all tab ids from the cache
   * 2) Asynchronously asks each active Quickoffice tab to
   *    tell us what private temp file it is using and then
   *    overwrites the cache entry for that private temp file
   *    with the provided tab id
   * 3) Fetches all of the private temp files in the file
   *    system and determines which ones are orphans.
   *    A file is deemed to be an orphan if it:
   *    - doesn't have a cache entry
   *    or
   *    - its cache entry has no tab id and it has 'expired'
   *      (i.e. the entry's timestamp is at least 90 days old)
   *
   * We then purge the orphans by:
   * i) deleting them from the file system
   * ii) deleting their cache entry (if there is one)
   *
   * Note that we use the 90 day expiry threshold so that the private
   * file for a document that is no longer being viewed will continue
   * to exist for some time afterwards. We do this to support:
   *
   * - Opening a QO document, navigating in that tab to a non-QO page (e.g.
   *   www.bbc.co.uk) and then after some time (during which the file reaper
   *   has performed a purge) navigating 'back' to the QO document in that tab
   *
   * - Eventually, restoring Drive files that were previously opened in QO and
   *   then closed with unsaved changes (e.g. if the user opens a 2007 Drive
   *   file and makes some offline edits, then closes the tab without first
   *   going back online so that the edits are auto-saved back to Drive. We can
   *   restore those unsaved changes if the user later reopens the same file)
   */
  var commencePurge_ = function() {
    if(!inProgress_ && !isLocked_() && !isSuppressed_()) {
      // remove all tab information for all cached
      // entries - we are about to reset this information
      FileStore.removeAllTabIds();

      // it seems that a callback for chrome.tabs.sendMessage()
      // does not always get invoked, so have a backup timeout
      timedOut_ = false;
      token_ = window.setTimeout(onTimeout_, KTimeout_Interval_);

      // send a 'reaperCheck' message to all tabs in all windows
      chrome.windows.getAll({populate: true},
        // callback function
        function(windows) {
          var len = windows.length;
          for(var i = 0; i < len; i++) {
            var win = windows[i];
            win.tabs.forEach(function(tab) {
              inProgress_++;
              chrome.tabs.sendMessage(tab.id, 'reaperCheck',
                onTabResponse_.bind(this, tab.id));
            });
          }
        }
      );
    }
  };

  /**
   * Invoked when a tab responds to a chrome.tabs.sendMessage() call
   *
   * @param {number} tabId The id of the tab that has responded
   * @param {undefined or object} response Undefined for a non-Quickoffice tab;
   *                                       for a Quickoffice tab, an object
   *                                       containing the property 'privatePath'
   *                                       which contains the path of the
   *                                       private temp file that is associated
   *                                       with this tab, and optionally the
   *                                       property 'srcPath' which, if present
   *                                       contains the source path of the
   *                                       document that is being displayed
   *                                       in the tab
   */
  var onTabResponse_ = function(tabId, response) {
    if(!timedOut_) {
      if(isQOTabResponse_(response)) {
        // this is a Quickoffice tab
        var entry = FileStore.getEntry(response.uuid);
        if(entry) {
          entry.tabId = tabId;
        }
      }

      if(isFinalTabResponse_()) {
        // this is the final tab response
        // so now get the list of temp files
        window.clearTimeout(token_);
        getTempFileList_();
      }
      else {
        inProgress_--;
      }
    }
    else if(isQOTabResponse_(response)){
      console.warn('Reaper received a belated ' +
        'Quickoffice tab response - this may result ' +
        'in its private temp file being incorrectly deleted');
    }
  };

  /**
   * Invoked if a timeout occurs whilst waiting for
   * the final tab response during the current purge
   */
  var onTimeout_ = function() {
    timedOut_ = true;
    getTempFileList_();
  };

  /**
   * Fetches a list of the private temp files that
   * currently exist in the root of the file system
   */
  var getTempFileList_ = function() {
    // check if the lock has been applied
    // since the start of this purge
    if(!isLocked_()) {
      getAllRootEntries_();
    }
    else {
      purgeIsDone_();
    }
  };

  /**
   * Gets all entries in the root level of the filesystem
   */
  var getAllRootEntries_ = function() {
    when(getFs_()).then(function(fs) {
      filesList_ = [];
      var reader = fs.root.createReader();

      var readEntries = function() {
        reader.readEntries(
          // on success
          function(results) {
            if(results.length > 0) {
              results.forEach(function(file) {filesList_.push(file);});
              readEntries();
            }
            else {
              onTempFileListing_(filesList_);
            }
          },
          // on error
          onTempFileListing_
        );
      };

      // call readEntries() until no more results are returned
      readEntries();
    });
  };

  /**
   * Processes the list of private temp files that currently
   * exist in the file system and deletes those that are 'orphaned'
   * (i.e. that are not being used by an active Quickoffice session)
   *
   * @param {array or FileError} fileEntries An array of FileEntry objects
   *                                         for the private temp files,
   *                                         or a FileError object if there
   *                                         was a failure in retrieving them
   */
  var onTempFileListing_ = function(fileEntries) {
    // check if the lock has been applied
    // whilst fetching the list of temp files
    if(!isLocked_() && TypeUtils.isList(fileEntries)) {
      var orphanedFilePaths = FileStore.deleteOrphans(fileEntries);
      orphanedFilePaths.forEach(function(filePath) {
        deleteFile_(filePath);
      });
    }

    purgeIsDone_();
  };

  /**
   * Deletes a file from the filesystem
   *
   * @param {string} filepath The path of the
   *                          target file to delete
   */
  var deleteFile_ = function(filePath) {
    if(filePath) {
      when(getFs_()).then(function(fs) {
        fs.root.getFile(
          filePath,
          {create: false},
          function(fileEntry) {
            fileEntry.remove(
              function() {
                console.log('File Reaper has deleted file ' + filePath);
              }
            );
          }
        );
      });
    }
  };

  /**
   * Determines whether we have received a
   * Quickoffice tab response for the current purge
   *
   * @return {boolean} True if we have received
   *                   a Quickoffice tab response,
   *                   otherwise false
   */
  var isQOTabResponse_ = function(response) {
    return TypeUtils.isObject(response) &&
      response.hasOwnProperty('uuid');
  };

  /**
   * Determines whether we have received the
   * final tab response for the current purge
   *
   * @return {boolean} True if we have received
   *                   the final tab response,
   *                   otherwise false
   */
  var isFinalTabResponse_ = function() {
    return inProgress_ === 1;
  };

  /**
   * Marks the current purge as done,
   * i.e. no longer in progress
   */
  var purgeIsDone_ = function() {
    inProgress_ = 0;
  };

  /**
   * Returns a boolean indicating whether
   * the reaper is currently locked or not
   *
   * @return {boolean} True if the reaper is currently
   *                   locked, otherwise false
   */
  var isLocked_ = function() {
    return locked_.length > 0;
  };

  /*
   * Returns a boolean indicating whether the file reaper
   * is being suppressed or not.
   *
   * @return {boolean} True if the repeat is currently
   *                   disabled, otherwise false)
   */
  var isSuppressed_ = function(){
    return Features.isEnabled('suppressFileReapear');
  };


  return api_;

});

