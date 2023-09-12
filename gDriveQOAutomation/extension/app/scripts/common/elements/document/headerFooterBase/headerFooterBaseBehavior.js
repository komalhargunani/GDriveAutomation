/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview base module for the Header and Footer polymer elements
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  window.HeaderFooterBaseBehavior = {
    // TODO(jliebrand): change these TLAs to more readable property
    // names (eg differentFirstPage and differentOddEven). For now, to
    // ensure we keep the changes to transition to polymer to a minimum
    // I'm keeping the existing property names dfp and doe.
    properties: {
      dfp: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      doe: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    },

    clear: function() {
      while (this.firstElementChild) {
        Polymer.dom(this).removeChild(this.firstElementChild);
      }
      Polymer.dom(this).flush();
    },

    hasContent: function() {
      return !!this.firstElementChild;
    }
  };

  return {};
});
