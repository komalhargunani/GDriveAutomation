
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Encapsulates the HTML representation of a vertical space.
 * Used to provide hints of boundaries or containers.
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
    name: 'Spacer Widget Factory',

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
      if (config && config.type && config.type === 'spacer') {
        score = 100;
      }
      return score;
    },

    /**
     * @params {object} config Hold the menu configuration.
     * @params {string} type The 'menu' type.
     * @params {string} config.label The localised text label for the menu item.
     *
     */
    create: function(config) {
      if (! (config || config.type || config.type === 'spacer')) {
        throw new Error('spacer widget create with bad config');
      }

      // use module pattern for instance object
      var module = function() {

        var _spacerNode;

        var _api = {

          name: 'Spacer Widget Instance',

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to
           * a specified node in the HTML DOM.
           *
           * @param {Node} parentNode The container node to attach to.
           * @method appendTo(node)
           */
          appendTo: function(parentNode) {
            parentNode.appendChild(_spacerNode);
          }
        };

        function _onLoad() {
          _spacerNode = document.createElement('div');
          _spacerNode.classList.add('qowt-spacer');

          // TODO(Upasana): Adding class name 'qowt-main-toolbar' here to
          // enable styles from mainToolbar polymer element to apply when
          // in shady dom mode. Remove once all elements are polymerized.
          _spacerNode.classList.add('qowt-main-toolbar');
        }

        _onLoad();
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
