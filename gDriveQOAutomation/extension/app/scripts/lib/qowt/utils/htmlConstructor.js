/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/*
 * helper module to easily construct HTML by passing in nested JSON
 * JELTE TODO: write up documentation for this and clean up var names in
 * this module
 */
define([], function() {

  'use strict';

  var _api = {
    constructHTML: function(jsonArray, rootNode) {
      rootNode = rootNode || document.getElementById('qo_app') || document.body;
      if ((rootNode === undefined) || (rootNode === null)) {
        rootNode = document.body;
      }
      var docFrag = document.createDocumentFragment();
      for (var elementCounter = 0; elementCounter < jsonArray.length;
           elementCounter++) {
        var el = jsonArray[elementCounter];
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
      return rootNode.appendChild(docFrag);
    }
  };

  return _api;
});