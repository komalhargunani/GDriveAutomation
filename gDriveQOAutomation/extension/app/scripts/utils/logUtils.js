/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview simple utility module to log an error,
 * it will check if the error contains a stack trace as an
 * array, or as a string, and produce readable output to
 * console.error
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define(['qowtRoot/utils/typeUtils'], function(TypeUtils) {

  'use strict';

  return {
    logError: function(err) {
      if (err && err.stack) {
        if (TypeUtils.isList(err.stack)) {
          console.error(err.message);
          err.stack.forEach(function(frame) {
            console.error(frame.toString());
          });
        } else {
          console.error(err.stack);
        }
      } else {
        console.error(err);
      }
    }
  };
});