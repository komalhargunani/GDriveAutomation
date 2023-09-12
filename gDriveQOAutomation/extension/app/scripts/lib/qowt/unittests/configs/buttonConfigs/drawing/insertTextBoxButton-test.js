// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview UT module for insert text box button.
 *
 * @author pankaj.avhad@synerzip.com (Pankaj Avhad)
 */

define([
  'qowtRoot/configs/buttonConfigs/drawing/insertTextBoxButton'
], function(InsertTextBoxButton) {

  'use strict';

  describe('configs/buttonConfigs/drawing/insertTextBoxButton', function() {
    describe('Basic configuration.', function() {
      it('should be type button.', function() {
        expect(InsertTextBoxButton.type).toBe('button');
      });
      it('should not define a text label.', function() {
        expect(InsertTextBoxButton.label).not.toBeDefined();
      });
      it('should define the correct action.', function() {
        expect(InsertTextBoxButton.action).toBe('initAddShape');
      });
      it('should be sticky.', function() {
        expect(InsertTextBoxButton.sticky).toBe(true);
      });
      it('should subscribe to selection changed signals.', function() {
        expect(InsertTextBoxButton.subscribe['qowt:addShapeDone']).
            toBeDefined();
        expect(InsertTextBoxButton.subscribe['qowt:transientActionClear']).
            toBeDefined();
        expect(InsertTextBoxButton.subscribe['qowt:presentationNonEmpty']).
            toBeDefined();
        expect(InsertTextBoxButton.subscribe['qowt:presentationEmpty']).
            toBeDefined();
      });
    });
  });
});
