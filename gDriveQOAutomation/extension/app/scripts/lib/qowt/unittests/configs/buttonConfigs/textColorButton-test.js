
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the generic TextColorButton module.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/configs/buttonConfigs/textColorButton'
], function(TextColorButton) {

  'use strict';

  describe('Generic Text Color Button', function() {

    describe('Basic configuration.', function() {

      it('should be type colorDropdown.', function() {
        expect(TextColorButton.type).toBe('colorDropdown');
      });
      it('should not define a text label.', function() {
        expect(TextColorButton.label).not.toBeDefined();
      });
      it('should define the correct action.', function() {
        expect(TextColorButton.action).toBe('textColor');
      });
      it('should not be sticky.', function() {
        expect(TextColorButton.sticky).not.toBeDefined();
      });
      it('should define an items array.', function() {
        expect(TextColorButton.items).toBeDefined();
      });
      it('should subscribe to selection changed signals.', function() {
        expect(TextColorButton.subscribe).toBeDefined();
        expect(TextColorButton.subscribe['qowt:selectionChanged']).
            toBeDefined();
      });
    });
  });
});
