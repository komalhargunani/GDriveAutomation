// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * Defines a widget to represent a label control that typically contains
 * either an image or text.
 * Label widgets do not have user-actionable content and are generally used
 * as aesthetic adornments.
 *
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils'], function(
  WidgetFactory,
  ArrayUtils) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Label Widget Factory',

    supportedActions: [],

    /**
     * Method used by the Abstract Widget Factory to determine if this widget
     * factory can be used to fulfil a given configuration object.
     *
     * IMPORTANT: This method is called in a loop for all widgets, so its
     * performance is critical. You should limit as much as possible intensive
     * DOM look up and other similar processes.
     *
     * See Also: Abstract Widget Factory, for how the confidence score is used
     *           qowtRoot/widgets/factory
     *
     * @param config {object} Configuration object, consists of:
     *        config.fromNode {HTML Element} Determine if this widget can be
     *                                       constructed given this as a base
     *        config.supportedActions {Array} a list of features the widget must
     *                                        support
     *
     * @return {integer} Confidence Score;
     *                   This integer between 0 and 100 indicates the determined
     *                   ability of this factory to create a widget for the
     *                   given configuration object.
     *                   0 is negative: this factory cannot construct a widget
     *                   for the given configuration.
     *                   100 is positive: this factory definitely can construct
     *                   a widget for the given configuration.
     *                   1 to 99: This factory could create a widget from the
     *                   given configuration data, but it is not a perfect match
     *                   if another factory returns a higher score then it would
     *                   be a more suitable factory to use.
     */
    confidence: function(config) {
      config = config || {};
      // first check that we match the required feature set
      if (config.supportedActions &&
            !ArrayUtils.subset(
              config.supportedActions,
              _factory.supportedActions)) {
        return 0;
      }
      var score = 0;
      // Now check that the config node matches
      if (config && config.type && config.type === 'label') {
        score = 100;
      }
      return score;
    },


    /**
     * Creates a new instance of this widget.
     * @params {object} config Hold the label configuration.
     * @returns {object} A new label widget object.
     *
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        var _kLabel = {
              className: 'qowt-label-wrapper',
              node: 'div'
            },
            _labelNode;


        var _api = {

          name: 'Label Widget Instance',

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the
           * widget to a specified node in the HTML DOM.
           *
           * @param {Node} parentNode The container node to attach to.
           * @method appendTo(node)
           */
          appendTo: function(parentNode) {
            parentNode.appendChild(_labelNode);
          }
        };

        function _init() {
          _labelNode = document.createElement(_kLabel.node);
          if (config.className) {
            _labelNode.classList.add(config.className);
          }
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

  // register with the widget factory;
  WidgetFactory.register(_factory);

  return _factory;
});