/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview This widget encapsulates the part of the HTML DOM representing
 * a text body. Shape widget is responsible for creation of this widget. Also,
 * whenever we click on a text, we follow the path of shape selection and then
 * shape widget delegates the work to this widget.
 *
 * @author wasim.pathan@synerzip.com (Wasim Pathan)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/arrayUtils',
  'qowtRoot/utils/domTextSelection',
  'qowtRoot/utils/navigationUtils',
  'qowtRoot/widgets/factory'
], function(
    PubSub,
    ArrayUtils,
    DomTextSelection,
    NavigationUtils,
    WidgetFactory) {

  'use strict';

  var _factory = {

    /**
     * Name this widget
     * This is mainly for debug purposes, widgets output in the console are not
     * identifiable by their methods alone
     */
    name: 'Shape Text Body Widget Factory',

    supportedActions: ['textEditing'],

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
     * @param {object} config Configuration object, consists of:
     *        config.fromNode {HTML Element} Determine if this widget can be
     *                                       constructed given this as a base
     *        config.supportedActions {Array} a list of features the widget must
     *                                        support
     *
     * @return {number} Confidence Score;
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
      if (config.supportedActions && !ArrayUtils.subset(
          config.supportedActions,
          _factory.supportedActions)) {
        return 0;
      }
      var score = 0;
      // Now check that the config node matches
      var node = config.fromNode;

      if (node && node.getAttribute &&
          node.getAttribute('qowt-divtype') === 'textBox') {
        score = 100;
      }
      return score;
    },

    /**
     * @constructor Constructor for the Shape Text Body widget
     * @param {object} config configuration object to create the widget
     * @return {object} A Shape Text Body widget
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        var _shapeTextBodyNode,
            _pHTextBodyNode;

        var _api = {
          /**
           * Activates shape text body i.e. publishes requestFocus, so that,
           * textTool gets activated with text body node as a scope.
           */
          activate: function() {
            if (!_api.isActive()) {
              // TODO(jliebrand): we should deprecate the use of qowt-editable
              // in favour of the more accurate contentEditable attribute. That
              // attribute will ensure the correct css is set, rather than that
              // we do that ourselves. Also note that once we move to polymer
              // for point, the shape element should set this itself just like
              // the <qowt-msdoc> element does. And finally: I'm not sure why
              // we only set this when the shape is active? The shape should
              // surely always be editable, not just when active. It just means
              // it only has a caret when it's active and focused.
              // For now (backward compatibility) I'm keeping both the css class
              // and setting the attribute.
              _shapeTextBodyNode.classList.add('qowt-editable');
              _shapeTextBodyNode.setAttribute('contenteditable', 'true');
              _shapeTextBodyNode.setAttribute('spellcheck', 'true');
              // Wait till browser makes _shapeTextBodyNode actually editable,
              // otherwise it won't get focus. Try to focus the 
              // _shapeTextBodyNode in the next cycle of event loop.
              if (!NavigationUtils.undoRedoUsingTBButton(
                  document.activeElement)) {
                setTimeout(function() {_shapeTextBodyNode.focus();}, 0);
              }
            }

            var context = DomTextSelection.getRange();
            context.contentType = 'text';
            context.scope = _shapeTextBodyNode;
            PubSub.publish('qowt:requestFocus', context);
          },

          /**
           * Returns weather or not the widget has focus
           */
          isActive: function() {
            return _shapeTextBodyNode.classList.contains('qowt-editable');
          },

          /**
           * Deactivate shape text body i.e. publishes requestFocusLost, so
           * that, textTool gets deactivated. Also it disables spell check and
           * removes editable class of text body node.
           */
          deactivate: function() {
            if (_api.isActive()) {
              if (_pHTextBodyNode &&
                  _shapeTextBodyNode.textContent.length === 0) {
                _pHTextBodyNode.style.display = 'block';
              }
              _shapeTextBodyNode.setAttribute('spellcheck', 'false');

              // TODO(jliebrand): see todo in this.activate. I dont understand
              // why we are making this element non-editable when it's not
              // active. By virtue of not being focussed it should just work?
              _shapeTextBodyNode.classList.remove('qowt-editable');
              _shapeTextBodyNode.removeAttribute('contenteditable');

              _shapeTextBodyNode = undefined;

              PubSub.publish('qowt:requestFocusLost', {contentType: 'text'});
            }
          },

          /**
           * Returns true if node is the only paragraph in text box.
           * @param {Element} node
           * @param {number} pageNumber
           * @return {boolean}
           */
          isOnlyParagraph: function(node /* pageNumber */) {
            // Ignoring the pageNumber parameter as text boxes do not support
            // pagination.
            return (_shapeTextBodyNode.contains(node) &&
              _api.getParagraphCount() === 1) ? true : false;
          },

          /**
           * Place cursor in text body
           */
          focus: function() {
            _shapeTextBodyNode.focus();
          },

          /**
           * Returns shape text body node
           * @return {HTMLElement} Shape text body node
           */
          getWidgetElement: function() {
            return _shapeTextBodyNode;
          },

          /**
           * Returns the total number of paragraphs within the text body node
           * @return {number} Count of paragraphs
           */
          getParagraphCount: function() {
            return _api.getAllParagraphNodes().length;
          },

          /**
           * Gets the paragraph node at given index
           * @param {number} index - Index of paragraph where it stands in DOM
           * @return {HTMLElement} HTML node of paragraph
           */
          getParagraphNode: function(index) {
            return _api.getAllParagraphNodes()[index];
          },

          /**
           * Returns a list of HTML nodes having qowt-divtype as para which
           * represents a paragraph
           * @return {NodeList} List of paragraph nodes
           * @private
           */
          getAllParagraphNodes: function() {
            return _shapeTextBodyNode.querySelectorAll(
                '[is="qowt-point-para"]');
          },

          /**
           * Gets the paragraph widget at given index
           * @param {number} index - Index of paragraph where it stands in DOM
           * @return {Object} paragraph widget object
           */
          getParagraphWidget: function(index) {
            return _api.getParagraphNode(index);
          }
        };

        function _init() {
          var containerNode = config.fromNode.parentNode;

          // Get shape text body node
          _shapeTextBodyNode = containerNode.querySelector(
              '[qowt-divtype=textBox]:not(.placeholder-text-body');

          // Get place holder text body node
          _pHTextBodyNode = containerNode.querySelector(
              '.placeholder-text-body');
          // If there exists placeholder text body, hide it.
          if (_pHTextBodyNode) {
            // TODO(elqursh): Should not modify DOM upon widget creation. This
            // should be handleed by control or upon activation/deactivation
            _pHTextBodyNode.style.display = 'none';
          }
        }

        _init();

        // only return the module if we were successfully created
        return _shapeTextBodyNode ? _api : undefined;
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
