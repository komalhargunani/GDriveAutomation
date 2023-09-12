/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview simple wrapper module to write the data of
 * one file to another. Instantiate the module with the target
 * file, and call writeData with the file/data you wish to write
 * to that target file.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/third_party/when/when',
  'utils/analytics/googleAnalytics'], function(
    when,
    GA) {

  'use strict';

  // States are in accordance with FileWriter API https://goo.gl/NKEQIV
  // except for kTruncating_(which is app specific)
  var kInit_ = 0;
  var kWriting_ = 1;
  var kDone_ = 2;
  var kTruncating_ = 3;

  var FileWriter = function(fileEntry) {
    this.entry = fileEntry;
    this.state = kInit_;
  };

  FileWriter.prototype = {
    __proto__: Object.prototype,

    writeData: function(data) {
      return this.createWriter_()
          .then(this.truncateAndWrite_.bind(this, data))
          .then(function() {
            return this.entry;
          }.bind(this));
    },


    // -------------------- PRIVATE ----------------
    createWriter_: function() {
      var deferred = when.defer();
      // create writer only when we have a fresh state i.e. when all the earlier
      // writes for this object are done.
      when(this.state === kInit_).then(function() {
        this.entry.createWriter(deferred.resolve, deferred.reject);
      }.bind(this));
      return deferred.promise;
    },


    /**
     * A callback function when the write/ truncate is done.
     * @param {Blob} data - data to be written
     * @param {FileWriter} fileWriter - A FileSystem API's FileWriter object
     * @param {Promise} deferred - a deferred promise
     * @private
     */
    writeOrResolve_: function(data, fileWriter, deferred) {
      // Ideally we should not have this check here since this function should
      // only get called when the FileWriter is done writing/ truncating i.e.
      // when readyState is DONE. This check is here as a safety check to avoid
      // app from crashing and also to capture in GA any such discrepancies in
      // platform.
      if (fileWriter.readyState === kDone_) {
        switch (this.state) {
          case kTruncating_:
            // done truncating, write the actual data
            try {
              this.state = kWriting_;
              fileWriter.write(data);
            } catch (error) {
              deferred.reject(new Error(error));
            }
            break;
          case kWriting_:
            // done writing the data, resolve our deferred
            this.state = kInit_;
            deferred.resolve();
            break;
          default:
            break;
        }
      } else {
        GA.sendException({
          msg: 'Callback for write/ writeend called when ' +
              'FileWriter.readyState !== DONE',
          fatal: false
        });
      }
    },


    truncateAndWrite_: function(data, fileWriter) {
      return when.promise(function(resolve, reject) {
        if (fileWriter.readyState === kWriting_) {
          reject(new Error('INVALID_STATE_ERR : Cannot write when ' +
              'the previous write is still in progress'));
        }

        // we listen to 'write' and not 'writeend' because as per W3.org docs
        // http://goo.gl/eeFNdn 'writeend' is fired on success, failure, abort
        // etc where as 'write' is the event that is fired on successful
        // completion of the write/ truncate (methods used here) activity.
        var deferred = {
          reject: reject,
          resolve: resolve
        };
        fileWriter.onwrite =
            this.writeOrResolve_.bind(this, data, fileWriter, deferred);
        fileWriter.onerror = function(event) {
          reject(new Error(event.currentTarget.error.message));
        };

        // truncate the file to zero; which sets off the state transition
        try {
          this.state = kTruncating_;
          fileWriter.truncate(0);
        } catch (error) {
          throw (new Error(error));
        }
      }.bind(this));
    }
  };


  return FileWriter;
});
