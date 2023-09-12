// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview Simple feedback button that allows the user to report
 * issues or leave feedback.
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'qowtRoot/utils/userFeedback'
  ], function(UserFeedback) {

  'use strict';

  var _factory = {

    /**
     * creates the feedback button
     *
     * @param text {string} the text to display on the button
     */
    create: function(text) {

      // use module pattern for instance object
      var module = function() {

          var _node;

          var _api = {
            /**
             * append the button to a given parent node
             *
             * @param parentNode {HTML Element} element to append to
             */
            appendTo: function(parentNode) {
              parentNode.appendChild(_node);
            },

            /**
             * getter for the actual button div; useful for unit tests
             */
            htmlNode: function() {
              return _node;
            }
          };

          // vvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvv

          function _init() {
            _node = document.createElement('button');
            _node.classList.add('qowt-feedback-button');
            _node.textContent = text;
            _node.onclick = function() {
              UserFeedback.reportAnIssue();
            };
          }

          _init();
          return _api;
        };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var instance = module();
      return instance;
    }
  };

  return _factory;
});