/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview PageNum Widget; supports showing either
 * the current page number, or the total pages count
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/controls/document/paginator',
  'qowtRoot/utils/converters/converter'], function(
  WidgetFactory,
  ArrayUtils,
  Paginator,
  Converter) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'PageNum Field Widget Factory',

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
          (node.tagName && node.tagName.toLowerCase() === 'div') &&
          (node.getAttribute('qowt-divtype') === 'qowt-field-pagenum' ||
           node.getAttribute('qowt-divtype') === 'qowt-field-numpages')) {
        score = 100;
      }
      return score;
    },


    /**
     * create a new page number field. Config object either specifies to
     * create a new widget and html (with config.newFieldId) or to construct
     * this widget from existing html (via config.fromNode)
     *
     * @param {object} config configuration object, containing combination of:
     * @param {HTML Element} config.fromNode html node to construct from
     * @param {string} config.newFieldId new field id to construct in HTML
     * @param {string} config.format the format of the page number (eg 'ROMAN')
     * @param {string} config.fieldType either 'PAGENUM' or 'NUMPAGES' to
     *                              indicate if this widget should represent the
     *                              current page, or a total page number count
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        var _api = {

          name: 'PageNum Field Widget Instance',

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
           * update the HTML for this field. Uses Paginator to work
           * out current and total page counts
           */
          update: function() {
            _setContent();
          },

          /**
           * append this widget to the given node. This also
           * sets the current page number for this widget if
           * that is this widgets fieldType; since we can now
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
            _fieldType,
            _format;

        function _setContent() {
          // we should have received content from DCP
          // for the page number; this will have been
          // formatted correctly, but the actual page
          // number / count will be wrong (our pagination
          // is different from MS Word). So update it
          // to be correct
          switch(_fieldType) {
          case 'pagenum':
            _setPageNum();
            break;
          case 'numpages':
            _setNumberOfPages();
            break;
          default:
            break;
          }
        }

        function _setPageNum() {
          var num;
          var content = _rootNode.firstElementChild;
          if (content) {
            num = Paginator.pageNumFromContent(_rootNode);
            // _rootNode has not been appended to the html document body
            // This only happens when loading the page, which implies that
            // we are being placed on the current page, which as of now is
            // the paginator's pageCount
            if (num < 0) {
              num = Paginator.pageCount();
            }
            content.textContent = "" + _formatNumber(num);
          }
        }

        function _setNumberOfPages() {
          var num = "";
          var content = _rootNode.firstElementChild;
          if (content) {
            // note: during loading of the document, this is
            // not quite right; but we will update it as more
            // pages are created. We can not know the total
            // page count until we are done loading the page.
            // This means flickering/dynamic content updates
            // but it's the best we can do...
            num = Paginator.pageCount();
            // TODO(umesh.kadam): Figure out a way to do this such that the
            // document is not marked dirty. Marking the document as dirty while
            // updating num-page will leave the user clueless of what just
            // happened! (because undo button gets enabled). JIRA CQO-1043
            content.textContent = "" + _formatNumber(num);
          }
        }

        function _formatNumber(num) {
          var formattedNum;
          switch(_format) {
          case 'ALPHABETIC':
            formattedNum = Converter.num2alpha(num).toUpperCase();
            break;
          case 'alphabetic':
            formattedNum = Converter.num2alpha(num).toLowerCase();
            break;
          case 'ROMAN':
            formattedNum = Converter.num2roman(num).toUpperCase();
            break;
          case 'roman':
            formattedNum = Converter.num2roman(num).toLowerCase();
            break;
          default:
            formattedNum = num;
            break;
          }
          return formattedNum;
        }

        function _constructNew() {
          _fieldType = config.fieldType.toLowerCase();
          _format = config.format || "Arabic";
          var divtype = 'qowt-field-' + _fieldType;
          _rootNode = document.createElement('span');
          _rootNode.id = config.newFieldId;
          _rootNode.setAttribute('qowt-divtype', divtype);
          _rootNode.setAttribute('qowt-number-format', _format);
          _rootNode.classList.add('qowt-field');
          _rootNode.classList.add(divtype);
        }

        function _constructFromNode() {
          var node = config.fromNode;

          if (node) {
            _rootNode = node;
            _format = node.getAttribute('qowt-number-format');
            var divtype = node.getAttribute('qowt-divtype');
            _fieldType = divtype.match(/qowt-field-(.+)/)[1];
          }
          if (!_verifyNodes()) {
            _reset();
          }
        }

        function _verifyNodes() {
          var nodeOK = _rootNode && _rootNode.classList &&
              _rootNode.classList.contains('qowt-field');

          return nodeOK && _fieldType && _format;
        }

        function _reset() {
          _rootNode = undefined;
          _fieldType = undefined;
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
