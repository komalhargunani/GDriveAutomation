/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview Bookmark Widget;
 * Creates a bookmark in the document that hyperlinks
 * can refer to. Uses standard html anchors to achieve
 * that link.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils'], function(
  WidgetFactory,
  ArrayUtils) {

  'use strict';

  // constants
  var _kDivtype = 'qowt-bookmark';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Bookmark Widget Factory',

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
      var node = config.fromNode;
      if (node &&
          (node.tagName && node.tagName.toLowerCase() === 'a') &&
          (node.getAttribute('qowt-divtype') === _kDivtype)) {
        score = 100;
      }
      return score;
    },


    /**
     * create a bookmark anchor. Config object either specifies to
     * create a new widget and html (with config.newBookmarkId) or to construct
     * this widget from existing html (via config.fromNode).
     *
     * @param {object} config configuration object, containing combination of:
     * @param {HTML Element} config.fromNode html node to construct from
     * @param {string} config.newBookmarkId new bookmark id to construct in HTML
     * @param {string} config.bookmarkName the unique name of this bookmark
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        var _api = {

          name: 'Bookmark Widget Instance',

          /**
           * @return {string} return the qowt Element Id (eid) for this widget
           */
          getEid: function() {
            return _rootNode.getAttribute('qowt-eid');
          },

          /**
           * @return {HTML Element} return the html node represnting this widget
           */
          getWidgetElement: function() {
            return _rootNode;
          },

          /**
           * append this widget to the given node.
           *
           * @param {HTML Element} node the parent for this widget
           */
          appendTo: function(node) {
            node.appendChild(_rootNode);
          }
        };

        // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv
        var _rootNode;

        function _constructNew() {
          _rootNode = document.createElement('a');
          _rootNode.id = config.bookmarkName;
          _rootNode.setAttribute('contenteditable', false);
          _rootNode.setAttribute('qowt-divtype', _kDivtype);
          _rootNode.setAttribute('qowt-eid', config.newBookmarkId);
          _rootNode.classList.add('qowt-field');
          _rootNode.classList.add(_kDivtype);
        }

        function _constructFromNode() {
          var node = config.fromNode;

          while(node && (node.nodeType === Node.TEXT_NODE ||
                (node.classList.contains &&
                !node.classList.contains(_kDivtype)))) {
            node = node.parentNode;
          }

          _rootNode = node;

          if (!_verifyInternals()) {
            _reset();
          }
        }

        function _verifyInternals() {
          return _rootNode && _rootNode.classList && _rootNode.getAttribute &&
            _rootNode.classList.contains(_kDivtype) &&
            _rootNode.getAttribute('qowt-divtype') === _kDivtype;
        }

        function _reset() {
          _rootNode = undefined;
        }

        function _init() {
          if (config.newBookmarkId) {
            _constructNew();
          }
          if (config.fromNode) {
            _constructFromNode();
          }
        }

        _init();
        return _verifyInternals() ? _api : undefined;
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
