
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the generic FontSizeButton module.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/configs/buttonConfigs/fontSizeButton'
], function(
    FontSizeButton) {

  'use strict';

  describe('Generic Font Size Button', function() {

    describe('Basic configuration.', function() {

      it('should be type dropdown.', function() {
        expect(FontSizeButton.type).toBe('dropdown');
      });
      it('should define a text label.', function() {
        expect(FontSizeButton.label).toBe(true);
      });
      it('should define the correct action.', function() {
        expect(FontSizeButton.action).toBe('fontSize');
      });
      it('should not be sticky.', function() {
        expect(FontSizeButton.sticky).not.toBeDefined();
      });
      it('should be scrollable.', function() {
        expect(FontSizeButton.opt_scrollable).toBe(true);
      });
      it('should define an items array.', function() {
        expect(FontSizeButton.items).toBeDefined();
      });
      it('should subscribe to selection changed signals.', function() {
        expect(FontSizeButton.subscribe).toBeDefined();
        expect(FontSizeButton.subscribe['qowt:selectionChanged']).toBeDefined();
      });
    });
  });
});
