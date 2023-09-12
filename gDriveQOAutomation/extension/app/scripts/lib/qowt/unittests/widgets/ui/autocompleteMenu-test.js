/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test for the autocomplete menu widget.
 *
 * @author gbiagiotti@google.com (Gio Biagiotti)
 */

define([
  'qowtRoot/widgets/factory',
  'qowtRoot/widgets/ui/autocompleteMenu',
  'qowtRoot/utils/domListener'
], function(
    WidgetFactory,
    AutocompleteMenu,
    DomListener) {

  'use strict';

  describe('Autocomplete Menu Widget Factory', function() {

    var autocompleteMenuWidget, autocompleteMenuElm;

    var widgetConfig = {
      type: 'autocompleteMenu',
      action: 'injectAutocomplete'
    };

    beforeEach(function() {
    });

    afterEach(function() {
      autocompleteMenuWidget = undefined;
      autocompleteMenuElm = undefined;
    });

    it('should return a positive integer for calls to the confidence ' +
        'method for supported configs', function() {
          var supported = AutocompleteMenu.confidence(widgetConfig);

          expect(supported > 0).toBe(true);
        });

    it('should support widget factory creation', function() {
      autocompleteMenuWidget = WidgetFactory.create(widgetConfig);

      expect(autocompleteMenuWidget).not.toBe(undefined);
    });

    it('should set proper role to created autocomplete menu', function() {
      autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
      autocompleteMenuElm = autocompleteMenuWidget.getElement();

      expect(autocompleteMenuElm.getAttribute('role')).toBe('menu');
    });

    it('should set proper class and id to created autocomplete menu',
       function() {
         autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
         autocompleteMenuElm = autocompleteMenuWidget.getElement();

         expect(autocompleteMenuElm.id).toBe('qowt-autocomplete-menu');
         expect(autocompleteMenuElm.classList.contains(
               'qowt-contextmenu')).toBe(true);
       });

    it('should create menu items when the updateMenuItems method is called ' +
        'and they do not exist yet', function() {
          autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
          autocompleteMenuElm = autocompleteMenuWidget.getElement();

          expect(autocompleteMenuElm.childNodes.length).toBe(0);
          autocompleteMenuWidget.updateMenuItems(['hello', 'world']);
          expect(autocompleteMenuElm.childNodes.length).toBe(2);
          expect(autocompleteMenuElm.childNodes[0].getAttribute('role')).
              toBe('menuitem');
          expect(autocompleteMenuElm.childNodes[0].textContent).toBe('hello');
          expect(autocompleteMenuElm.childNodes[1].getAttribute('role')).
              toBe('menuitem');
          expect(autocompleteMenuElm.childNodes[1].textContent).toBe('world');
        });

    it('should not create menu items when the updateMenuItems method is ' +
        'called and they exist already', function() {
          autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
          autocompleteMenuElm = autocompleteMenuWidget.getElement();

          autocompleteMenuWidget.updateMenuItems(['hello', 'world']);
          expect(autocompleteMenuElm.childNodes.length).toBe(2);
          autocompleteMenuWidget.updateMenuItems(['foo', 'hello', 'world']);
          expect(autocompleteMenuElm.childNodes.length).toBe(3);
          expect(autocompleteMenuElm.childNodes[0].textContent).toBe('hello');
          expect(autocompleteMenuElm.childNodes[1].textContent).toBe('world');
          expect(autocompleteMenuElm.childNodes[2].textContent).toBe('foo');
        });

    it('should hide menu items when the updateMenuItems method is called and ' +
        'the corresponding suggestions are not available anymore', function() {
          autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
          autocompleteMenuElm = autocompleteMenuWidget.getElement();

          autocompleteMenuWidget.updateMenuItems(['hello', 'world']);
          expect(autocompleteMenuElm.childNodes.length).toBe(2);
          autocompleteMenuWidget.updateMenuItems(['hello']);
          expect(autocompleteMenuElm.childNodes.length).toBe(2);
          expect(autocompleteMenuElm.childNodes[0].style.display).toBe('block');
          expect(autocompleteMenuElm.childNodes[1].style.display).toBe('none');
        });

    it('should add event listeners when the menu is shown', function() {
      autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
      spyOn(DomListener, 'add');
      autocompleteMenuWidget.show();

      expect(DomListener.add).toHaveBeenCalled();
      expect(DomListener.add.callCount).toBe(4);
    });

    it('should remove event listeners when the menu is hidden', function() {
      autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
      autocompleteMenuWidget.show();
      spyOn(DomListener, 'removeGroup');
      autocompleteMenuWidget.hide();

      expect(DomListener.removeGroup).toHaveBeenCalled();
    });

    it('should set the visibility to visible when the show method is ' +
        'called', function() {
          autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
          autocompleteMenuElm = autocompleteMenuWidget.getElement();

          expect(autocompleteMenuElm.style.visibility).toBe('hidden');
          autocompleteMenuWidget.show();
          expect(autocompleteMenuElm.style.visibility).toBe('visible');
        });

    it('should set the visibility to hidden when the hide method is ' +
        'called', function() {
          autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
          autocompleteMenuElm = autocompleteMenuWidget.getElement();
          autocompleteMenuWidget.show();

          expect(autocompleteMenuElm.style.visibility).toBe('visible');
          autocompleteMenuWidget.hide();
          expect(autocompleteMenuElm.style.visibility).toBe('hidden');
        });

    it('should hide the menu and remove all the menu items when the reset' +
        ' method is called', function() {
          autocompleteMenuWidget = WidgetFactory.create(widgetConfig);
          autocompleteMenuElm = autocompleteMenuWidget.getElement();
          autocompleteMenuWidget.updateMenuItems(['hello', 'world']);
          autocompleteMenuWidget.show();

          expect(autocompleteMenuElm.style.visibility).toBe('visible');
          expect(autocompleteMenuElm.childNodes.length).toBe(2);

          autocompleteMenuWidget.reset();
          expect(autocompleteMenuElm.style.visibility).toBe('hidden');
          expect(autocompleteMenuElm.childNodes.length).toBe(0);
        });
  });
});
