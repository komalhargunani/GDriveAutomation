/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * @fileoverview unit test for the button widget
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/widgets/ui/button',
  'qowtRoot/utils/i18n'
], function(
    Widget,
    I18n) {

  'use strict';

  describe('Button Widget Factory', function() {

    var config;

    beforeEach(function() {
      /**
       * Create a new instance of a button widget.
       * @param {object} config The button configuration.
       * @param {'button'} config.type Defines this as a button widget.
       * @param {string} config.action The action for this button when
       *     activated.
       * @param {string} config.value The value to use when the button is
       *     pressed.
       * @param {boolean} config.sticky If true this button latches when
       *     pressed.
       * @param {string} config.groupId If true defines this button to
       *     participate in a radio-button relationship with other buttons.
       * @param {object} config.subscribe Defines button-specific behaviour to
       *      invoke for different signals of interest.
       */
      config = {
        type: 'button',
        action: 'dummyAction'
      };
    });

    afterEach(function() {
    });

    it('should return a positive integer for calls to the confidence() ' +
        'method for supported configs', function() {
          var supported = Widget.confidence(config);
          expect(supported > 0).toBe(true);
        });

    it('should return 0 for calls to the confidence() method for ' +
        'non-supported configs', function() {
          var config, supported;

          config = {type: ''};
          supported = Widget.confidence(config);
          expect(supported).toBe(0);

          config = {};
          supported = Widget.confidence(config);
          expect(supported).toBe(0);
        });

    it('should create a widget instance for correctly structured button config',
       function() {
         var widget = Widget.create(config);

         expect(widget).not.toBe(undefined);
       });
  });

  describe('Button Widget Using ARIA attributes', function() {
    var ariaConfig, dummyNode, buttonWidget, buttonElement;

    beforeEach(function() {
      ariaConfig = {
        className: 'qowt-button-label',
        node: 'button',
        action: 'bold'
      };
    });
    afterEach(function() {
      dummyNode = undefined;
      buttonElement = undefined;
    });

    it('should support widget factory creation', function() {
      dummyNode = document.createElement(ariaConfig.node);
      buttonWidget = Widget.create(ariaConfig);
      buttonWidget.appendTo(dummyNode);
      expect(Widget).not.toBe(undefined);
    });

    it('should set proper role and label to button', function() {
      dummyNode = document.createElement(ariaConfig.node);
      buttonWidget = Widget.create(ariaConfig);
      buttonWidget.appendTo(dummyNode);
      var buttonClass = 'icon-' + ariaConfig.action;
      buttonElement = dummyNode.getElementsByClassName(buttonClass)[0];
      expect(buttonElement.getAttribute('role')).toBe('button');
      expect(buttonElement.getAttribute('aria-label')).
          toBe(I18n.getMessage(ariaConfig.action + '_aria_spoken_word'));
    });
  });

  return {};
});
