// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * Defines an 'Cell Contents Left Align' button.
 */

/**
 * Return a button configuration.
 *
 * @param returns {object} A button configuration.
 * @param returns {string} config.type The type of widget to create.
 * @param returns {string} config.action The widgets requested action.
 * @param returns {string} config.contentType Optional contentType.
 *                If present the widget will directly signal 'doAction'
 *                If absent the widget the will signal 'requestAction'
 */

define([
  'qowtRoot/widgets/factory'
], function(
  WidgetFactory) {

  'use strict';

  return {
    type: 'button',
    action: 'cellVAlignCenter',
    sticky: true,
    groupId: 'vertical-alignment',
    subscribe: {
      /**
       * Update the button status as a result of a changed selection.
       * @param {string} signal The signal name.
       * @param {string} signalData Contextual information about selection.
       */
      'qowt:selectionChanged': function(signal, signalData) {
        signal = signal || '';
        var widget = WidgetFactory.create(signalData);

        if (widget && widget.hasVAlignCenter) {
          this.setActive(widget.hasVAlignCenter());
        }
      }
    }
  };
});
