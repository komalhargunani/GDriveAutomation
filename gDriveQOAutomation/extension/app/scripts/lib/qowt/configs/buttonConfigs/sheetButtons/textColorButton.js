// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Defines a 'text color' button for Sheet by extending
 * the generic text color button.
 * Returns a button configuration.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */
define([
    'qowtRoot/configs/buttonConfigs/textColorButton',
    'qowtRoot/configs/buttonConfigs/sheetButtons/paletteColors'
  ], function(
    TextColorButton,
    PaletteColors) {

  'use strict';

  // Use Sheet-specific colors
  TextColorButton.items = PaletteColors;

  TextColorButton.subscribe = TextColorButton.subscribe || {};

  TextColorButton.formattingProp = 'clr';

  return TextColorButton;
});
