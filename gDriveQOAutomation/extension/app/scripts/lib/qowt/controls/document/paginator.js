/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview singleton to make accessing pages easier
 *
 * NOTE: this module is no longer responsible for actually
 * paginating since <qowt-pages> auto paginate. That is now achieved
 * by <qowt-page> elements firing 'page-change' events which the
 * <qowt-msdoc> element listens for, which then paginates the page.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([], function() {

  'use strict';

  var _api = {


    /**
     * Get the page element for a given page number. Note page
     * numbers are NOT zero indexed!
     *
     * @param {integer} pageNumber The first page is page 1.
     * @return {QowtPage} The page widget of the specified page
     */
    getPage: function(pageNumber) {
      var pages = document.querySelectorAll('qowt-page');
      return pages[pageNumber - 1];
    },

    /**
     * @return {number} total number of pages in the document
     */
    pageCount: function() {
      var pages = document.querySelectorAll('qowt-page');
      return pages.length;
    },

    /**
     * Get the page number for a given content node.  If the node is not
     * found in the DOM, return -1
     *
     * @param node {HTML Element} node to search for within the document
     * @return {number|undefined} page number for the given node
     */
    pageNumFromContent: function(node) {
      var pages = document.querySelectorAll('qowt-page');
      for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (page.contains(node) || page.root.host.contains(node)) {
          // note page numbers are not zero indexed...
          return i + 1;
        }
      }
      // We didn't find the element
      return -1;
    }
  };


  return _api;
});
