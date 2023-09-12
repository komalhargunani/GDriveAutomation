/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the menu pane widget
 *
 * @author upasana.kumari@quickoffice.com (Upasana Kumari)
 */

define([
  'qowtRoot/widgets/ui/menuPane',
  'qowtRoot/widgets/ui/menuItem'
], function(
    Pane,
    MenuItem) {

  'use strict';

  describe('MenuPane Widget Factory', function() {

    var config, dummyNode, paneWidget, paneElement, menuConfig;

    beforeEach(function() {
      config = {
        className: 'qowt-menuPane',
        node: 'menu'

      };

    });

    afterEach(function() {
      paneWidget = undefined;
      dummyNode = undefined;
      paneElement = undefined;
    });



    describe('API', function() {

      beforeEach(function() {
        menuConfig = {
          stringid: 'menu_item_help_center',
          string: 'Help',
          action: 'dummyAction',
          context: {
            dummyValue: 1
          }
        };
      });
      afterEach(function() {
      });

      it('should support widget factory creation', function() {
        dummyNode = document.createElement(config.node);
        paneWidget = Pane.create(config);
        paneWidget.appendTo(dummyNode);
        expect(paneWidget).not.toBe(undefined);
      });

      it('should be in an initialised state after construction', function() {
        dummyNode = document.createElement(config.node);
        paneWidget = Pane.create(config);
        paneWidget.appendTo(dummyNode);
        expect(paneWidget).toBeDefined();
      });

      it('should be able to add menu items', function() {
        var menuItem = MenuItem.create(menuConfig);
        dummyNode = document.createElement(config.node);
        paneWidget = Pane.create(config);
        paneWidget.addMenuItem(menuItem);
        paneWidget.appendTo(dummyNode);
        expect(dummyNode.childNodes.length).toBeGreaterThan(0);
      });

      it('should set proper role to menuPane created', function() {
        var menuItem = MenuItem.create(menuConfig);
        dummyNode = document.createElement(config.node);
        paneWidget = Pane.create(config);
        paneWidget.addMenuItem(menuItem);
        paneWidget.appendTo(dummyNode);
        paneElement = dummyNode.getElementsByClassName('qowt-menuPane')[0];
        expect(paneElement.getAttribute('role')).toBe('menu');
      });
    });
  });
  return {};
});

