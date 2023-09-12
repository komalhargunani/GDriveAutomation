/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview module to mock out file entry to simulate failure for testing
 *
 * @author ghyde@google.com (Greg Hyde)
 */
define([], function() {

  'use strict';

  return {
    reset: function() {
      window.__entryMock = {
        createWriter: function(resolve, reject) {
          void(reject); // unused variable
          var obj = {
            truncate: function(data) {
              void(data);  // unused variable
              this.onerror(window.__errorMock);
            }
          };
          resolve(obj);
        }
      };

      window.__errorMock = {
        currentTarget: {
          error: {
            message: 'The file write failed'
          }
        }
      };
    }
  };
});
