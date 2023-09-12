// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview UT module for shape item's pane widget.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/point/shapeMenuItem'
], function(
    I18n,
    ShapeMenuItem) {

  'use strict';

  describe('shapeMenuItem Widget Factory', function() {

    var _kDummyDiv, dummyDiv, shapeItemsPaneWidget, shapeItemsPaneElement,
        config;

    beforeEach(function() {
      _kDummyDiv = {
        node: 'div'
      };
      config = {
        'type': 'shapeMenuItem',
        'string': I18n.getMessage('menu_item_arrows'),
        'action': 'initAddShape',
        'items': [
          'Right Arrow',
          'Left Arrow',
          'Up Arrow'
        ],
        'iconClass': 'arrows'
      };
      dummyDiv = document.createElement(_kDummyDiv.node);
      shapeItemsPaneWidget = ShapeMenuItem.create(config);
      shapeItemsPaneWidget.appendTo(dummyDiv);
      shapeItemsPaneElement = shapeItemsPaneWidget.getNode();
    });

    afterEach(function() {
      shapeItemsPaneWidget = undefined;
      config = undefined;
      dummyDiv = undefined;
      shapeItemsPaneElement = undefined;
    });

    describe('API', function() {

      it('should support widget factory creation', function() {
        expect(shapeItemsPaneWidget).not.toBe(undefined);
      });

      it('should create proper id and attach classes ' +
          'to shapeMenuItem created', function() {
            expect(shapeItemsPaneElement.classList.contains(
                  'qowt-menuitem')).toBe(true);
            expect(shapeItemsPaneElement.classList.contains(
                'shapemenuitem-' + config.action)).toBe(true);
            expect(shapeItemsPaneElement.getAttribute('qowt-menutype')).toBe(
                config.string);
            expect(shapeItemsPaneElement.getAttribute('qowt-divtype')).toBe(
                'qowt-menuitem');
          });

      it('should throw error when create called with undefined config',
          function() {
           config = undefined;
           expect(function() {
             ShapeMenuItem.create(config);
           }).toThrow('ShapeMenuItem widget create with bad config');
          });

      it('should throw error when create called with undefined config.type',
          function() {
           config.type = undefined;
           expect(function() {
             ShapeMenuItem.create(config);
           }).toThrow('ShapeMenuItem widget create with bad config');
          });

      it('should throw error when create called with config.type other than' +
          ' shapeMenuItem', function() {
           config.type = 'someConfig';
           expect(function() {
             ShapeMenuItem.create(config);
           }).toThrow('ShapeMenuItem widget create with bad config');
          });

      it('should set display to block of the shapeMenuItem node',
          function() {
            shapeItemsPaneWidget.show();
            expect(shapeItemsPaneElement.style.display).toBe('block');
          });

      it('should set display to none of the shapeMenuItem node',
          function() {
            shapeItemsPaneWidget.hide();
            shapeItemsPaneElement = shapeItemsPaneWidget.getNode();
            expect(shapeItemsPaneElement.style.display).toBe('none');
          });
    });
  });
  return {};
});


