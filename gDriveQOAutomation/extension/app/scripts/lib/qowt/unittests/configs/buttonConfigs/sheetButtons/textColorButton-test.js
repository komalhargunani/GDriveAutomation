
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the Sheet TextColorButton module.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/configs/buttonConfigs/sheetButtons/textColorButton',
  'qowtRoot/configs/buttonConfigs/sheetButtons/paletteColors'
], function(
    TextColorButton,
    SheetPaletteColors) {

  'use strict';

  describe('Sheet Text Color Button', function() {

    describe('Basic configuration.', function() {

      it('should use Sheet-specific colors.', function() {
        expect(TextColorButton.items).toBe(SheetPaletteColors);
      });
    });
  });
});
