// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview The Shape item widget encapsulates the part of the HTML DOM
 * representing a square with picture that appears on hover of shape menu.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/utils/domListener',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/drawing/geometry/presets/_all',
  'qowtRoot/utils/i18n'
], function(
    DomListener,
    PubSub,
    ShapePresetMap,
    I18n) {

  'use strict';

  var _factory = {

    /**
     * Create a new shapeItem widget instance.
     *
     * @param {object} config Widget configuration for new instance.
     * @param {string} config.action The action associated with this menu item.
     * @param {string} config.value The action associated with this menu item.
     */
    create: function(config) {

      // use module pattern for instance object
      var module = function() {

        /**
         * Configs for our constituent html elements.
         * @private
         */
        var _kShapeItem = {
          className: 'qowt-shape-item',
          node: 'div'
        };

        /*
         * A map of the html nodes making up our shapeItem widget.
         * @private
         */
        var _domNodes = {};

        var _api = {

          /**
           * Every widget has an appendTo() method.
           * This is used to attach the HTML elements of the widget to
           * a specified node in the HTML DOM.
           *
           * @param {Node} node The HTML node we are going to append to.
           */
          appendTo: function(node) {
            if (node === undefined) {
              throw new Error('ShapeItem.appendTo() - missing node parameter!');
            }

            if (_domNodes.shapeItem !== undefined) {
              node.appendChild(_domNodes.shapeItem);
            }
          },

          /**
           * Removes the HTML elements of the widget from
           * a specified node in the HTML DOM.
           *
           * @param {Node} node The HTML node to be removed from.
           */
          removeFrom: function(node) {
            if (node === undefined) {
              throw new Error('ShapeItem.removeFrom() - missing node' +
                  ' parameter!');
            }

            if (_domNodes.shapeItem !== undefined) {
              node.removeChild(_domNodes.shapeItem);
            }
          },

          /**
           * Trigger the required action.
           */
          set: function() {
            PubSub.publish('qowt:clearSlideSelection');
            PubSub.publish('qowt:requestFocus', {contentType: 'slide'});
            PubSub.publish('qowt:requestAction', {
              'action': 'initAddShape',
              'context': {
                'set': true,
                'prstId': ShapePresetMap[config.value].id
              }
            });
          },

          /**
           * Gets the menu item html node.
           *
           * @return {object} The shape item node.
           */
          getNode: function() {
            return _domNodes.shapeItem;
          }
        };

        /**
         * @private
         * Handles a 'click' HTML DOM event, which occurs when the user
         * clicks on this shape's square.
         */
        var _handleClickEvent = function() {
          if (config.action) {
            _api.set();
          }
        };

        /**
         * Initialise a new shape item widget.
         * @private
         */
        var _init = function() {
          _domNodes.shapeItem = document.createElement(_kShapeItem.node);
          _domNodes.shapeItem.className = _kShapeItem.className;
          _domNodes.shapeItem.classList.add('icon-' +
              ShapePresetMap[config.value].preset);

         _domNodes.shapeItem.classList.add('qowt-main-toolbar');
          var description = ShapePresetMap[config.value].description;
          // The shape names can include ":", "-", quotes and spaces. The I18n
          // message key does not allow ":", "-" or quotes as a key, hence we
          // need to modify the key name.
          var messageKey = description.replace(/[:""]/g, '');
          messageKey = messageKey.replace(/[\-\s+]/g, '_');
          messageKey = 'menu_item_' + (messageKey.toLowerCase());
          _domNodes.shapeItem.title = I18n.getMessage(messageKey);

          //Setting aria attributes for cell.
          _domNodes.shapeItem.setAttribute('role', 'gridcell');
          _domNodes.shapeItem.setAttribute('tabindex', '-1');
          _domNodes.shapeItem.setAttribute('aria-label',
              I18n.getMessage(messageKey));
          DomListener.addListener(
              _domNodes.shapeItem, 'click', _handleClickEvent);
        };

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
