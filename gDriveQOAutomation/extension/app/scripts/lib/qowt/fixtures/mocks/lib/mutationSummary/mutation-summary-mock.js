
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview mock module for mutation summary
 * this allows us to test things like the textTool without loading
 * the entire mutation library / summary libs
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  'use strict';

  window.MutationSummary = function() {

    return {
      disconnect: function(){},
      reconnect: function(){}
    };
  };

  return {};
});
