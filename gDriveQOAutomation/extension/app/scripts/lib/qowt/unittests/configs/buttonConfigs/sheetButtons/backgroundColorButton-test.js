
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the Sheet BackgroundColorButton module.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/configs/buttonConfigs/sheetButtons/backgroundColorButton'
], function(
    BackgroundColorButton) {

  'use strict';

  describe('Sheet Background Color Button', function() {

    describe('Basic configuration.', function() {

      it('should be type colorDropdown.', function() {
        expect(BackgroundColorButton.type).toBe('colorDropdown');
      });
      it('should not define a text label.', function() {
        expect(BackgroundColorButton.label).not.toBeDefined();
      });
      it('should define the correct action.', function() {
        expect(BackgroundColorButton.action).toBe('backgroundColor');
      });
      it('should not be sticky.', function() {
        expect(BackgroundColorButton.sticky).not.toBeDefined();
      });
      it('should define an items array.', function() {
        expect(BackgroundColorButton.items).toBeDefined();
      });
      it('should subscribe to selection changed signals.', function() {
        expect(BackgroundColorButton.subscribe).toBeDefined();
        expect(BackgroundColorButton.subscribe['qowt:selectionChanged']).
            toBeDefined();
      });
    });
  });
});
