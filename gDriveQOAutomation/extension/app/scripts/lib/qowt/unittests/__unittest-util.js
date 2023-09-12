/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * IMPORTANT !!!!
 * This file absolutely *must* be the first file included !!!
 *
 * Utility / Helper functions for unit testing.
 */
define([], function() {

  'use strict';



  var api_ = {

    /**
     * Creates an empty DIV element and appends it to the document body.
     * This can be used in unittests to append DOM elements that need
     * to be rendered in order to perform a test.
     * @return {HTML Element} The test append area node.
     */
    createTestAppendArea: function() {
      var testAppendArea = window.document.getElementById('testAppendArea');
      if (!testAppendArea) {
        testAppendArea = window.document.createElement('div');
        testAppendArea.id = 'testAppendArea';
        window.document.body.appendChild(testAppendArea);
      }
      return testAppendArea;
    },

    /**
     * Remove the test append area node and all its children.
     */
    removeTestAppendArea: function() {
      var _testAppendArea = window.document.getElementById('testAppendArea');
      if (_testAppendArea && _testAppendArea.parentNode) {
          // TODO: This function removes the test append area node, and
          // therefore all of its children.
          // This means if any test leaks DOM nodes this will be hidden.
          // It the responsibility of the code to remove and dereference
          // any DOM nodes it adds.
          // Currently a lot of tests use flushTestAppendArea to remove
          // any added nodes but it should not be done this way.
          // When all of the tests behave correctly the following
          // code can be implemented to fail tests that leak DOM nodes.
          // if (_testAppendArea.childNodes.length > 0) {
          //   throw new Error('Test area not empty!');
          // }
        _testAppendArea.parentNode.removeChild(_testAppendArea);
      }
    },

    /**
     * Removes all nodes and styles from the test append area node.
     */
    flushTestAppendArea: function() {
      var testAppendArea = window.document.getElementById('testAppendArea');
      while (testAppendArea && testAppendArea.hasChildNodes()) {
        testAppendArea.removeChild(testAppendArea.lastChild);
      }
      if (testAppendArea) {
        testAppendArea.style.cssText = "";
        testAppendArea.className = "";
      }
    },

    /**
     * Removes a specified DOM node from its parent node.
     * @param {HTML Element} html-element The node to remove.
     */
    removeTestHTMLElement: function(htmlElement) {
      if (htmlElement && htmlElement.parentNode) {
        htmlElement.parentNode.removeChild(htmlElement);
      }
    }

  };

  return api_;

});
