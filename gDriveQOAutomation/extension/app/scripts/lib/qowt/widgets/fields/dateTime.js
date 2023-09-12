/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview DateTime Widget; supports showing either
 * any date/time formatted string.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/dateFormatter'], function(
  WidgetFactory,
  ArrayUtils,
  DateFormatter) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'DateTime Field Widget Factory',

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
          (node.tagName && node.tagName.toLowerCase() === 'span') &&
          (node.getAttribute('qowt-divtype') === 'qowt-field-datetime')) {
        score = 100;
      }
      return score;
    },


    /**
     * create a new date/time field. Config object either specifies to
     * create a new widget and html (with config.newFieldId) or to construct
     * this widget from existing html (via config.fromNode)
     *
     * @param {object} config configuration object, containing combination of:
     * @param {HTML Element} config.fromNode html node to construct from
     * @param {string} config.newFieldId new field id to construct in HTML
     * @param {string} config.format the format of the date/time (eg 'mm/yy')
     * @param {string} config.lang optional langue code (eg 'en' or 'it')
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        var _api = {

          name: 'DateTime Field Widget Instance',

          /**
           * @return {string} return the qowt Element Id (eid) for this widget
           */
          getEid: function() {
            return _rootNode.id;
          },

          /**
           * @return {HTML Element} return the html node represnting this widget
           */
          getWidgetElement: function() {
            return _rootNode;
          },

          /**
           * update the HTML for this field.
           */
          update: function() {
            _setContent();
          },

          /**
           * append this widget to the given node. This also
           * sets the current page number for this widget if
           * that is this widgets flavour; since we can now
           * work out from the parent what page we are on.
           *
           * @param {HTML Element} node the parent for this widget
           */
          appendTo: function(node) {
            node.appendChild(_rootNode);
          }
        };

        // vvvvvvvvvvvvvvvvvvvvvvvv PRIVATE vvvvvvvvvvvvvvvvvvvvvvvvv
        var _rootNode,
            _format,
            _lang;

        function _setContent() {
          // the 'field' has a content span which is textually formatted
          // correctly. We need to update the textContent to represent
          // the current date/time
          var content = _rootNode.firstChild;
          /*
           * We only support update of date-time fields with a single span.
           * So we remove all additional span children leaving only the first.
           */
          while(content.nextSibling){
            _rootNode.removeChild(content.nextSibling);
          }
          if (content) {
            content.textContent = DateFormatter.formatDate(
                _format, new Date(), _lang);
          }
        }


        function _constructNew() {
          _format = config.format;
          _lang = config.lang;
          var divtype = 'qowt-field-datetime';
          _rootNode = document.createElement('span');
          _rootNode.id = config.newFieldId;
          _rootNode.setAttribute('qowt-divtype', divtype);
          _rootNode.setAttribute('qowt-datetime-format', _format);
          _rootNode.setAttribute('contenteditable', false);
          _rootNode.classList.add('qowt-field');
          _rootNode.classList.add(divtype);
        }

        function _constructFromNode() {
          var node = config.fromNode;

          if (node) {
            _rootNode = node;
            _format = node.getAttribute('qowt-datetime-format');
          }
          if (!_verifyNodes()) {
            _reset();
          }
        }

        function _verifyNodes() {
          var nodeOK = _rootNode && _rootNode.classList &&
            _rootNode.classList.contains('qowt-field');

          return nodeOK && _format;
        }

        function _reset() {
          _rootNode = undefined;
          _format = undefined;
        }

        function _init() {
          if (config.newFieldId) {
            _constructNew();
          }
          if (config.fromNode) {
            _constructFromNode();
          }
        }

        _init();
        return _verifyNodes() ? _api : undefined;
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
