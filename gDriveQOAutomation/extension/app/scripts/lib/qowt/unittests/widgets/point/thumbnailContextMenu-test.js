// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test cases for thumbnail context menu
 * @author kunjan.thakkar@synerzip.com (Kunjan Thakkar)
 */

define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/ui/menuItem',
  'qowtRoot/widgets/point/thumbnailContextMenu',
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
    ThumbnailContextMenu,
    HideSlideConfig,
    UnhideSlideConfig,
    InsertSlideConfig,
    DeleteSlideConfig,
    DuplicateSlideConfig,
    SpacerWidget) {

  'use strict';

  describe('Thumbnail Context Menu test', function() {

    it('should subscribe to qowt events on init', function() {
      spyOn(PubSub, 'subscribe');
      ThumbnailContextMenu.init();
      expect(PubSub.subscribe.calls[0].args[0]).toEqual('qowt:destroy');
    });

    it('should throw error when ThumbnailContextMenu.create() called multiple' +
        ' times', function() {
          ThumbnailContextMenu.init();
          expect(ThumbnailContextMenu.init).toThrow(
              'thumbnailContextMenu.init() called multiple times.');
        });

    it('should create context menu', function() {
      var _contextMenu = {
        addMenuItem: function() {},
        removeTabindex: function() {}
      };
      spyOn(WidgetFactory, 'create').andReturn(_contextMenu);
      spyOn(MenuItem, 'create').andCallThrough();
      spyOn(SpacerWidget, 'create');
      ThumbnailContextMenu.init();
      expect(WidgetFactory.create).toHaveBeenCalledWith(
          {type: 'contextMenu'});
      expect(MenuItem.create.calls[0].args[0]).toEqual(InsertSlideConfig);
      expect(MenuItem.create.calls[1].args[0]).toEqual(DuplicateSlideConfig);
      expect(MenuItem.create.calls[2].args[0]).toEqual(DeleteSlideConfig);
      expect(MenuItem.create.calls[3].args[0]).toEqual(HideSlideConfig);
      expect(MenuItem.create.calls[4].args[0]).toEqual(UnhideSlideConfig);

      expect(SpacerWidget.create.calls[0].args[0]).toEqual(SpacerWidget);
    });

    it('should return proper context menu item node', function() {
      var _contextMenu = {
        addMenuItem: function() {},
        removeTabindex: function() {}
      };
      spyOn(WidgetFactory, 'create').andReturn(_contextMenu);
      ThumbnailContextMenu.init();

      var insertSlideMenuNode = ThumbnailContextMenu.
          getContextMenuItemNode('menuitem-insertSlide');
      var deleteSlideMenuNode = ThumbnailContextMenu.
          getContextMenuItemNode('menuitem-deleteSlide');
      var duplicateSlideMenuNode = ThumbnailContextMenu.
          getContextMenuItemNode('menuitem-duplicateSlide');
      var showSlideMenuNode = ThumbnailContextMenu.
          getContextMenuItemNode('menuitem-showSld');

      expect(insertSlideMenuNode.id).toEqual('menuitem-insertSlide');
      expect(deleteSlideMenuNode.id).toEqual('menuitem-deleteSlide');
      expect(duplicateSlideMenuNode.id).toEqual('menuitem-duplicateSlide');
      expect(showSlideMenuNode.id).toEqual('menuitem-showSld');
    });
  });
});
