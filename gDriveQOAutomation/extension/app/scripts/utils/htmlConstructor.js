/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview html construction module
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([], function() {

  /*!
   * Public API
   * @param {string} jsonArray input to convert to HTML
   * @param {object} optional root node to append HTML to
   */
  var _api = {
    constructHTML: function(jsonArray, opt_RootNode) {
      var docFrag = document.createDocumentFragment();
      for (var ii = 0; ii < jsonArray.length; ii++) {
        var el = jsonArray[ii];
        el.elType = el.elType || 'div';
        var e = document.createElement(el.elType);
        for (var attrib in el) {
          if ((el.hasOwnProperty(attrib)) &&
            (typeof(el[attrib]) !== 'function') &&
            (attrib !== 'children')) {
              e[attrib] = el[attrib];
          }
        }
        if (el.children) {
          _api.constructHTML(el.children, e);
        }
        docFrag.appendChild(e);
      }
      if (opt_RootNode) {
        opt_RootNode.appendChild(docFrag);
      }

      return docFrag;
    }
  };

  return _api;
});