// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview context menu widget for thumbnail
 *
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/ui/menuItem',
  'qowtRoot/configs/contextMenuConfigs/point/hideSlideConfig',
  'qowtRoot/configs/contextMenuConfigs/point/unhideSlideConfig',
  'qowtRoot/configs/contextMenuConfigs/point/insertSlideConfig',
  'qowtRoot/configs/contextMenuConfigs/point/deleteSlideConfig',
  'qowtRoot/configs/contextMenuConfigs/point/duplicateSlideConfig',
  'qowtRoot/widgets/ui/spacer'
], function(
    PubSub,
    WidgetFactory,
    MenuItem,
    HideSlideConfig,
    UnhideSlideConfig,
    InsertSlideConfig,
    DeleteSlideConfig,
    DuplicateSlideConfig,
    SpacerWidget) {

  'use strict';

  var _destroyToken, _contextMenu, _menuItems;

  // Menu configs to be added as menu items in the context menu.
  var menuConfigs = [InsertSlideConfig,
                     DuplicateSlideConfig,
                     DeleteSlideConfig,
                     SpacerWidget,
                     HideSlideConfig,
                     UnhideSlideConfig];
  /**
   * Creates and adds menu item to the context menu.
   *
   * @private
   */
  var _createMenuItems = function() {
    _menuItems = [];
    for (var i = 0; i < menuConfigs.length; i++) {
      var menuItem;
      if (menuConfigs[i] === SpacerWidget) {
        menuItem = SpacerWidget.create(menuConfigs[i]);
      } else {
        menuItem = MenuItem.create(menuConfigs[i]);
        _menuItems[menuItem.getId()] = menuItem;
      }
      _contextMenu.addMenuItem(menuItem);
    }
    _contextMenu.removeTabindex();
  };

  /**
   * Remove all references.
   */
  var _destroy = function() {
    _contextMenu = undefined;
    _menuItems = undefined;

    PubSub.unsubscribe(_destroyToken);
    _destroyToken = undefined;
  };

  var _api = {
    /**
     * Initializes the context menu.
     */
    init: function() {
      if (_destroyToken) {
        throw new Error('thumbnailContextMenu.init() called multiple times.');
      }
      _contextMenu = WidgetFactory.create({type: 'contextMenu'});
      if (_contextMenu) {
        _createMenuItems();
      }

      _destroyToken = PubSub.subscribe('qowt:destroy', _destroy);

      return _contextMenu;
    },

    /**
     * Returns the DOM element of context menu item based on the 'id'.
     * @param {string} id - Menu item id
     * @return {HTMLElement|undefined} - DOM element of menuItem corresponding
     *                                   to id, if present. Otherwise undefined.
     */
    getContextMenuItemNode: function(id) {
      var menuItemWidget = _menuItems[id];
      return menuItemWidget ? menuItemWidget.getNode() : undefined;
    },

    /**
     * Returns context menu items.
     * @return {Array} - an array of context menu item widgets
     */
    getMenuItems: function() {
      return _menuItems;
    }
  };

  return _api;
});
