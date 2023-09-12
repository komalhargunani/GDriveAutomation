
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview This module handles the processing of 'doc' DCP elements.
 * Doc elements are returned as a high level structure within a 'getDocContent'
 * response. As such, this handler can be called 1 or more times during the
 * opening/rendering of a document.
 *
 * It's important to note this handler can be invoked multiple times depending
 * on the document being rendered, since that impacts the initialisation of
 * singletons which should be done only once.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([], function() {

  'use strict';

  var _api = {

    /**
     * DCP Type Code is used by the DCP Manager to register this handler.
     */
    etp: 'doc',

    /**
     * This is the main Handler function that processes DCP.
     * @param {Object} dcl Arbitrary DCP.
     * @return {Element || undefined} The generated element.
     */
    visit: function(dcp) {
      // Error check to see if this is the correct Handler for this DCP
      if (dcp && dcp.el && dcp.el.etp && (dcp.el.etp === _api.etp)) {
        _doc = dcp.node.getElementById(dcp.el.eid);

        // If not create a new element
        if (!_doc) {
          _doc = document.createElement('qowt-msdoc');
          Polymer.dom(_doc).appendChild(document.createElement('qowt-page'));
          Polymer.dom(_doc).flush();
          _doc.setEid(dcp.el.eid);
          _doc.setModel(dcp.el);

          dcp.node.appendChild(_doc);
        }

        var pages = Polymer.dom(_doc).querySelectorAll('qowt-page');
        return pages[pages.length - 1];
      }
    }
  };

  // vvvvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

  /**
   * @private
   * The current doc element being processed.
   */
  var _doc;

  return _api;
});
