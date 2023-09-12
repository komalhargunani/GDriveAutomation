/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview widget for MS Word line breaks
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils'
  ], function(
    WidgetFactory,
    ArrayUtils) {

  'use strict';

  var kLineBreakId = 'data-line-break';

  var factory_ = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Linebreak Widget Factory',

    supportedActions: [],

    supportedNode: function(node) {
      if (node && node.nodeName === 'BR') {
        var lineBreakCheck = node.getAttribute(kLineBreakId);
        if (lineBreakCheck) {
          return true;
        }
      }
      return false;
    },

    confidence: function(config) {
      var node;
      config = config || {};

      if (config && config.fromId) {
        node = document.getElementById(config.fromId);
      } else if (config && config.fromNode) {
        node = config.fromNode;
      }

      // First check that we match the required feature set.
      if (config.supportedActions &&
            !ArrayUtils.subset(
              config.supportedActions,
              factory_.supportedActions)) {
        return 0;
      }

      var score = (factory_.supportedNode(node)) ? 100 : 0;
      return score;
    },


    create: function(config) {

      // use module pattern for the constructed widget
      var module = function() {

        var api_ = {

          name: 'Linebreak Widget Instance',

          /**
           * @return {Element || undefined}
           * Returning the main HTML element for the table
           */
          getWidgetElement: function() {
            return widgetNode_;
          },

          /**
           * @return {string} the Element ID for this widget
           */
          getEid: function() {
            return widgetNode_.id;
          },

          /**
           * append the HTML elements of this widget to a parentNode
           *
           * @param node {HTMLElement} the parent html container for this widget
           */
          appendTo: function(node) {
            node.appendChild(widgetNode_);
          },

          /**
           * Remove this widget from the document.
           * Assumes the widget instance has been correctly constructed.
           */
          remove: function() {
            if(widgetNode_ && widgetNode_.parentNode) {
              widgetNode_.parentNode.removeChild(widgetNode_);
            }
          }
        };


        //vvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
        var widgetNode_;

        function createNew_() {
          if (config.newId) {
            widgetNode_ = document.createElement('BR');
            widgetNode_.setAttribute('qowt-divtype', kLineBreakId);
            widgetNode_.setAttribute('data-line-break', 'true');
            widgetNode_.setAttribute('qowt-eid', config.newId);
            widgetNode_.id = config.newId;
          }
        }

        function constructFrom_() {
          var node = config.fromNode || document.getElementById(config.fromId);
          if (node && factory_.supportedNode(node)) {
            widgetNode_ = node;
          }
        }

        function init_() {
          if (config.fromNode || config.fromId) {
            constructFrom_();
          } else {
            createNew_();
          }
        }

        init_();
        return (widgetNode_ === undefined) ? undefined : api_;
      };

      // We create a new instance of the object by invoking
      // the module constructor function.
      var widget = module();
      return widget;
    }
  };

  // register with the widget factory;
  WidgetFactory.register(factory_);

  return factory_;
});
