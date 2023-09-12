/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the button drop down widget
 *
 * @author upasana.kumari@quickoffice.com (Upasana Kumari)
 */

define([
  'qowtRoot/widgets/ui/buttonDropdown'
], function(
    ButtonDropdown) {

  'use strict';

  describe('Button Dropdown Widget Factory', function() {

    var _kButtonDropdown, dummyDiv, buttonDropdownWidget, buttonElement;

    beforeEach(function() {
      _kButtonDropdown = {
        className: 'qowt-button-dropdown',
        classNameActive: 'qowt-menu-active',
        node: 'div',
        action: 'Arial',
        label: true
      };
      dummyDiv = document.createElement(_kButtonDropdown.node);
      buttonDropdownWidget = ButtonDropdown.create(_kButtonDropdown);
      buttonDropdownWidget.appendTo(dummyDiv);
      buttonElement = dummyDiv.getElementsByClassName('qowt-button-label')[0];
    });

    afterEach(function() {
      buttonDropdownWidget = undefined;
      dummyDiv = undefined;
      buttonElement = undefined;
    });

    describe('API', function() {

      it('should support widget factory creation', function() {
        expect(buttonDropdownWidget).not.toBe(undefined);
      });

      it('should set correct ARIA attributes to buttonDropdown created',
         function() {
           expect(buttonElement.getAttribute('role')).toBe('button');
           expect(buttonElement.getAttribute('aria-haspopup')).toBe('true');
           expect(buttonElement.getAttribute('aria-expanded')).toBe('false');
           var buttonDropdownElement =
               dummyDiv.getElementsByClassName('qowt-button-dropdown')[0];
           expect(buttonDropdownElement.getAttribute('aria-haspopup')).
               toBe('true');
         });

      it('should be able to enable the dropdown button', function() {
        buttonDropdownWidget.setEnabled(true);
        expect(buttonElement.disabled).toBe(false);
      });

      it('should be able to disable the dropdown button', function() {
        buttonDropdownWidget.setEnabled(false);
        expect(buttonElement.disabled).toBe(true);
      });

      it('should return correct value if the dropdown is enable', function() {
        buttonDropdownWidget.setEnabled(true);
        expect(buttonDropdownWidget.isEnabled()).toBe(true);
        buttonDropdownWidget.setEnabled(false);
        expect(buttonDropdownWidget.isEnabled()).toBe(false);
      });
    });
  });
  return {};
});




