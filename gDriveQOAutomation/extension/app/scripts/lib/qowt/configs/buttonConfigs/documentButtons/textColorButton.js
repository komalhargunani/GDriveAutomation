// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'text color' button for Word by extending
 * the generic text color button to include app-specific signal subscriptions.
 * Returns a button configuration.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */
define([
  'qowtRoot/configs/buttonConfigs/textColorButton'],
  function(
    TextColorButton) {

  'use strict';

  TextColorButton.contentType = 'document';
  return TextColorButton;
});
