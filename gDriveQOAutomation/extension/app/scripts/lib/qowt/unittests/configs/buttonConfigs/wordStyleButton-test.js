
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit Test module for the WordStyleButton module.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/configs/buttonConfigs/wordStyleButton'
], function(WordStyleButton) {

  'use strict';

  describe('configs/buttonConfigs/wordStyleButton', function() {

    describe('Basic configuration.', function() {
      it('should be type dropdown.', function() {
        expect(WordStyleButton.type).toBe('dropdown');
      });
      it('should defined a text label.', function() {
        expect(WordStyleButton.label).toBe(true);
      });
      it('should define the style action.', function() {
        expect(WordStyleButton.action).toBe('style');
      });
      it('should subscribe to list style updates.', function() {
        expect(WordStyleButton.subscribe).toBeDefined();
        expect(WordStyleButton.subscribe['qowt:styleListUpdate']).toBeDefined();
      });
      it('should subscribe to selection changed signals.', function() {
        expect(WordStyleButton.subscribe['qowt:selectionChanged']).
            toBeDefined();
      });
    });
  });
});




