// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview A module for generating new cellDecorator instances on demand.
 * The client can use individual formatting APIs or use the generic
 * decorate function by supplying it a cellFormatting dcp object
 *
 * @author mikkor@google.com (Mikko Rintala)
 */

define([], function() {

  'use strict';

  var _kCell_Wrap_Class = "qowt-sheet-cell-wrap";

  var _api = {

    /**
     * Checks if a cell has word wrap or not.
     *
     * @param {HTML Element} elm The html element to be checked
     * @return True if has word wrap, False if not.
     */
    hasWrapText: function(elm) {
      var res = false;
      if(elm) {
        res = elm.classList.contains(_kCell_Wrap_Class);
      }
      return res;
    },

    /**
     * Style our element with a supported font family.
     * (Does not apply the given fontface as explicit stlying)
     *
     * @param {HTML Element} elm The html element to decorate
     * @param {boolean} setOn Sets the word wrap if this is true, otherwise
     *                        removes it
     */
    setWrapText: function(elm, setOn) {
      if(setOn !== undefined ) {
        if(setOn) {
          if(!elm.classList.contains(_kCell_Wrap_Class)) {
            elm.classList.add(_kCell_Wrap_Class);
          }
        } else {
          if(elm.classList.contains(_kCell_Wrap_Class)) {
            elm.classList.remove(_kCell_Wrap_Class);
          }
        }
      }
    },
    
    /**
     * Adorn the element with the provided data.
     * Set the element styline from the provided data.
     * Formatting is set with a mixture of inline styling
     * and css class use.
     *
     * @param {HTML Element} elm The html element to decorate
     * @param {Object} formatting Specificed the data to apply.
     */
     decorate: function(elm, formatting) {
       if(formatting !== undefined) {
         _api.setWrapText(elm, formatting.wrapText);
       }
     },

    /**
     * Undecorates the DOM element
     *
     * @method undecorate()
     */
     undecorate: function(elm) {
      elm.classList.remove(_kCell_Wrap_Class);
     }
  };
  return _api;
});
