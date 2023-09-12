/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test for the menu base widget.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/widgets/ui/menuBase',
  'qowtRoot/widgets/factory'
], function(
    MenuBase,
    WidgetFactory) {

  'use strict';

  describe('Menu Base Widget Factory', function() {

    var menuBaseWidget, menuBaseElm, menuItemWidget, menuItemWidget2,
        parentNode;

    var widgetConfig = {
      opt_scrollable: true
    };

    var menuItemConfig = {
      type: 'menuItem',
      string: 'foo',
      action: 'dummyAction'
    };

    beforeEach(function() {
    });

    afterEach(function() {
      menuBaseWidget = undefined;
      menuBaseElm = undefined;
      menuItemWidget = undefined;
      menuItemWidget2 = undefined;
      parentNode = undefined;
    });

    it('should set proper role to created menu base', function() {
      menuBaseWidget = MenuBase.create(widgetConfig);
      menuBaseElm = menuBaseWidget.getElement();

      expect(menuBaseElm.getAttribute('role')).toBe('menu');
    });

    it('should set proper class to created menu base', function() {
      menuBaseWidget = MenuBase.create(widgetConfig);
      menuBaseElm = menuBaseWidget.getElement();

      expect(menuBaseElm.classList.contains('qowt-menu-mouse-mode')).toBe(true);
    });

    it('should add a menu item to the menu when the addMenuItem method is ' +
        'called', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuItemWidget = WidgetFactory.create(menuItemConfig);
          menuBaseWidget.addMenuItem(menuItemWidget);
          menuBaseElm = menuBaseWidget.getElement();

          expect(menuBaseElm.childNodes.length).toBe(1);
          expect(menuBaseElm.childNodes[0].textContent).toBe('foo');
        });

    it('should remove a menu item from the menu when the removeMenuItem ' +
        'method is called', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuItemWidget = WidgetFactory.create(menuItemConfig);
          menuBaseWidget.addMenuItem(menuItemWidget);
          menuBaseElm = menuBaseWidget.getElement();

          expect(menuBaseElm.childNodes.length).toBe(1);
          menuBaseWidget.removeMenuItem(menuItemWidget);
          expect(menuBaseElm.childNodes.length).toBe(0);
        });

    it('should remove all the menu items from the menu when the ' +
        'removeAllMenuItems method is called', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuItemWidget = WidgetFactory.create(menuItemConfig);
          menuItemWidget2 = WidgetFactory.create(menuItemConfig);
          menuBaseWidget.addMenuItem(menuItemWidget);
          menuBaseWidget.addMenuItem(menuItemWidget2);
          menuBaseElm = menuBaseWidget.getElement();

          expect(menuBaseElm.childNodes.length).toBe(2);
          menuBaseWidget.removeAllMenuItems();
          expect(menuBaseElm.childNodes.length).toBe(0);
        });

    it('should hide all the visible menu items when the ' +
        'hideVisibleMenuItems method is called', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuBaseElm = menuBaseWidget.getElement();
          menuBaseWidget.updateMenuItemsBase(['hello', 'world']);

          expect(menuBaseElm.childNodes.length).toBe(2);
          expect(menuBaseElm.childNodes[0].style.display).not.toBe('none');
          expect(menuBaseElm.childNodes[1].style.display).not.toBe('none');
          menuBaseWidget.hideVisibleMenuItems();
          expect(menuBaseElm.childNodes[0].style.display).toBe('none');
          expect(menuBaseElm.childNodes[1].style.display).toBe('none');
        });

    it('should create menu items when the updateMenuItemsBase method is ' +
        'called and they do not exist yet', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuBaseElm = menuBaseWidget.getElement();

          expect(menuBaseElm.childNodes.length).toBe(0);
          menuBaseWidget.updateMenuItemsBase(['hello', 'world']);
          expect(menuBaseElm.childNodes.length).toBe(2);
          expect(menuBaseElm.childNodes[0].getAttribute('role')).
              toBe('menuitem');
          expect(menuBaseElm.childNodes[0].textContent).toBe('hello');
          expect(menuBaseElm.childNodes[1].getAttribute('role')).
              toBe('menuitem');
          expect(menuBaseElm.childNodes[1].textContent).toBe('world');
        });

    it('should not create menu items when the updateMenuItemsBase method is ' +
        'called and they exist already', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuBaseElm = menuBaseWidget.getElement();

          menuBaseWidget.updateMenuItemsBase(['hello', 'world']);
          expect(menuBaseElm.childNodes.length).toBe(2);
          menuBaseWidget.updateMenuItemsBase(['foo', 'hello', 'world']);
          expect(menuBaseElm.childNodes.length).toBe(3);
          expect(menuBaseElm.childNodes[0].textContent).toBe('hello');
          expect(menuBaseElm.childNodes[1].textContent).toBe('world');
          expect(menuBaseElm.childNodes[2].textContent).toBe('foo');
        });

    it('should hide menu items when the updateMenuItemsBase method is called ' +
        'and the corresponding strings are not available anymore', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuBaseElm = menuBaseWidget.getElement();

          menuBaseWidget.updateMenuItemsBase(['hello', 'world']);
          expect(menuBaseElm.childNodes.length).toBe(2);
          menuBaseWidget.updateMenuItemsBase(['hello']);
          expect(menuBaseElm.childNodes.length).toBe(2);
          expect(menuBaseElm.childNodes[0].style.display).toBe('block');
          expect(menuBaseElm.childNodes[1].style.display).toBe('none');
        });

    it('should set the visibility to visible when the showBase method is ' +
        'called', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuBaseElm = menuBaseWidget.getElement();

          expect(menuBaseElm.style.visibility).toBe('hidden');
          menuBaseWidget.showBase();
          expect(menuBaseElm.style.visibility).toBe('visible');
        });

    it('should set the visibility to hidden when the hideBase method is ' +
        'called', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuBaseElm = menuBaseWidget.getElement();
          menuBaseWidget.showBase();

          expect(menuBaseElm.style.visibility).toBe('visible');
          menuBaseWidget.hideBase();
          expect(menuBaseElm.style.visibility).toBe('hidden');
        });

    it('should append the menu base when the appendTo method is ' +
        'called', function() {
          parentNode = document.createElement('div');
          menuBaseWidget = MenuBase.create(widgetConfig);

          expect(parentNode.childNodes.length).toBe(0);
          menuBaseWidget.appendTo(parentNode);
          expect(parentNode.childNodes.length).toBe(1);
          expect(parentNode.childNodes[0].getAttribute('role')).toBe('menu');
        });

    it('should set proper class to scrollable menu', function() {
      parentNode = document.createElement('div');
      menuBaseWidget = MenuBase.create(widgetConfig);
      menuBaseElm = menuBaseWidget.getElement();

      expect(
          menuBaseElm.classList.contains('qowt-scroll-vertical')).toBe(false);
      menuBaseWidget.appendTo(parentNode);
      expect(menuBaseElm.classList.contains('qowt-scroll-vertical')).toBe(true);
    });

    it('should set the menu position when the setPosition method is ' +
        'called', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuBaseWidget.setPosition(3, 5);
          menuBaseElm = menuBaseWidget.getElement();

          expect(menuBaseElm.style.left).toBe('3px');
          expect(menuBaseElm.style.top).toBe('5px');
        });

    it('should set the menu max width when the setMaxWidth method is ' +
        'called', function() {
          menuBaseWidget = MenuBase.create(widgetConfig);
          menuBaseWidget.setMaxWidth('200');
          menuBaseElm = menuBaseWidget.getElement();

          expect(menuBaseElm.style.maxWidth).toBe('200px');
          menuBaseWidget.setMaxWidth('none');
          expect(menuBaseElm.style.maxWidth).toBe('none');
        });
  });
});
