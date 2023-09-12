/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview base mixin for decorators that need to change
 * the .style.textDecorations css
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define(['third_party/lo-dash/lo-dash.min'], function() {

  'use strict';

  return {

    /**
     * Add a value to the text-decoration css property
     *
     * @param {String} value the value to add
     */
    addTextDecoration_: function(value) {
      var existing = this.style.textDecoration.split(' ');
      if (this.getAttribute('qowt-format')) {
        this.removeAttribute('qowt-format');
      }
      if (value) {
        // Css ignores everything after 'none' so we must remove it
        _.pull(existing, 'none', value);
        existing.push(value);
      }
      this.style.textDecoration = existing.join(' ');
    },

    /**
     * Remove a value from the text-decoration css property
     *
     * @param {String} value the value to remove
     */
    removeTextDecoration_: function(value, current) {
      var existing = this.style.textDecoration.split(' ');

      // Since undefined and false are one and the same w.r.t mutations,
      // there is no visual change when formatting changes from undefined to
      // false. Therefore such actions do not generate mutation summaries.
      // In order to enforce mutation summaries on such user actions, we
      // add an extra attribute to run element.
      if (existing.indexOf(value) === -1 && current === false) {
        var rpr = {};
        switch (value) {
          case 'underline':
            rpr.udl = false;
            break;
          case 'line-through':
            rpr.str = false;
            break;
          case 'overline':
            rpr.ovl = false;
            break;
        }
        this.setAttribute('qowt-format', JSON.stringify(rpr));
      } else {
        _.pull(existing, value);
        this.style.textDecoration = existing.join(' ');
      }
    }

  };

});
