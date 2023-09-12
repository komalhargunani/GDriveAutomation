
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the generic FontFaceButton module.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/configs/buttonConfigs/fontFaceButton'
], function(
    FontFaceButton) {

  'use strict';

  describe('Generic Font Face Button', function() {

    describe('Basic configuration.', function() {

      it('should be type dropdown.', function() {
        expect(FontFaceButton.type).toBe('dropdown');
      });
      it('should define a text label.', function() {
        expect(FontFaceButton.label).toBe(true);
      });
      it('should define the correct action.', function() {
        expect(FontFaceButton.action).toBe('fontFace');
      });
      it('should not be sticky.', function() {
        expect(FontFaceButton.sticky).not.toBeDefined();
      });
      it('should be scrollable.', function() {
        expect(FontFaceButton.opt_scrollable).toBe(true);
      });
      it('should subscribe to selection changed signals.', function() {
        expect(FontFaceButton.subscribe).toBeDefined();
        expect(FontFaceButton.subscribe['qowt:selectionChanged']).toBeDefined();
      });
    });
  });
});
