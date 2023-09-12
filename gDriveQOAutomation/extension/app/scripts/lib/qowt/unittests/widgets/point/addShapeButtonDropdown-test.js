// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview UT module for add shape button drop down widget.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/utils/i18n',
  'qowtRoot/widgets/point/addShapeButtonDropdown'
], function(
    I18n,
    AddShapeButtonDropdown) {

  'use strict';

  describe('Add Shape Button Dropdown Widget Factory', function() {

    var _kButtonDropdown, dummyDiv, addShapeButtonDropdownWidget,
        config;


    beforeEach(function() {
      _kButtonDropdown = {
        node: 'div'
      };
      config = {
        'type': 'addShapeDropdown',
        'label': true,
        'action': 'initAddShape',
        'opt_scrollable': true,
        'items': [
          {
            'name': I18n.getMessage('menu_item_equation'),
            'iconClass': 'equations',
            'elements': [
              163 //'Plus'
            ]
          }
        ]
      };
      dummyDiv = document.createElement(_kButtonDropdown.node);
      addShapeButtonDropdownWidget =
          AddShapeButtonDropdown.create(config);
      addShapeButtonDropdownWidget.appendTo(dummyDiv);
    });

    afterEach(function() {
      addShapeButtonDropdownWidget = undefined;
      dummyDiv = undefined;
    });

    describe('API', function() {

      it('should support widget factory creation', function() {
        expect(addShapeButtonDropdownWidget).not.toBe(undefined);
      });

      it('should return menu items', function() {
        expect(addShapeButtonDropdownWidget.getItems()).not.toBe(undefined);
      });

      it('should set correct ARIA and class attributes to buttonDropdown' +
          'created',
          function() {
            var dropDownButtonElement;
            dropDownButtonElement = addShapeButtonDropdownWidget.getElement();
            expect(dropDownButtonElement.
                classList.contains('qowt-button-addShape-dropdown')).toBe(true);
            expect(dropDownButtonElement.getAttribute('role')).toBe('listbox');
            expect(dropDownButtonElement.getAttribute('aria-haspopup')).
                toBe('true');
            expect(dropDownButtonElement.getAttribute('aria-expanded')).
                toBe('false');
          });
    });
  });
  return {};
});




