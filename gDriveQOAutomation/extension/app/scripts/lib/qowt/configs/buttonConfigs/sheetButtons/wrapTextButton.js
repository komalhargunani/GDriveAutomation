// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'wrapText' button for Sheet by extending
 * the generic wrapText button to include app-specific signal subscriptions.
 * Returns a button configuration.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */
define([
  'qowtRoot/configs/buttonConfigs/wrapTextButton'
], function(
    WrapTextButton) {

  'use strict';

  WrapTextButton.subscribe = WrapTextButton.subscribe || {};

  /**
   * Update the button status and trigger the required action when a
   * formatting-changed signal is received.
   *
   * @param signal {string} The signal name
   * @param signalData {string} The signal data
   */
  WrapTextButton.subscribe['qowt:formattingChanged'] =
    function(signal, signalData) {
      signal = signal || '';
      if (signalData && signalData.action === 'wrapText') {
        this.setActive(signalData.context.formatting.wrapText);
      }
    };

  return WrapTextButton;
});
