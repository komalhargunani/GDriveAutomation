// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview UT module for shape item's pane widget.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/point/shapeItemsPane'
], function(
    I18n,
    ShapeItemsPane) {

  'use strict';

  describe('ShapeItemsPane Widget Factory', function() {

    var _kDummyDiv, dummyDiv, shapeItemsPaneWidget, shapeItemsPaneElement,
        config;

    beforeEach(function() {
      _kDummyDiv = {
        node: 'div'
      };
      config = {
        'string': I18n.getMessage('menu_item_arrows'),
        'action': 'initAddShape',
        'items': [
          48, //'Right Arrow',
          83, //'Left Arrow',
          85 //'Up Arrow'
        ],
        'iconClass': 'arrows'
      };
      dummyDiv = document.createElement(_kDummyDiv.node);
      shapeItemsPaneWidget = ShapeItemsPane.create(config);
      shapeItemsPaneWidget.appendTo(dummyDiv);
      shapeItemsPaneElement = shapeItemsPaneWidget.getElement();
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
          'to shapeItemsPane created', function() {
            expect(shapeItemsPaneElement.classList.contains('qowt-shape-pane')).
                toBe(true);
            expect(shapeItemsPaneElement.getAttribute('id')).
                toBe(config.string);
          });

      it('should set display to block on mouse over of the shapeItemsPane node',
          function() {
            var mouseOverEvt = document.createEvent('Event');
            mouseOverEvt.initEvent('mouseover', true, false);
            shapeItemsPaneElement.dispatchEvent(mouseOverEvt);
            expect(shapeItemsPaneElement.style.display).toBe('block');
            expect(shapeItemsPaneElement.style.opacity).toBe('1');
          });

      it('should set display to none on mouse out of the shapeItemsPane node',
          function() {
            var mouseOverEvt = document.createEvent('Event');
            mouseOverEvt.initEvent('mouseout', true, false);
            shapeItemsPaneElement.dispatchEvent(mouseOverEvt);
            expect(shapeItemsPaneElement.style.display).toBe('none');
            expect(shapeItemsPaneElement.style.opacity).toBe('0');
          });
    });
  });
  return {};
});


