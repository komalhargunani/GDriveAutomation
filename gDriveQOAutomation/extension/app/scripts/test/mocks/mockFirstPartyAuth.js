/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview mock out the first party auth module
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

 define([
   'qowtRoot/third_party/when/when'], function(when) {

  'use strict';

  return {
    setCookies: function() {
      return when.resolve();
    }
  };
});