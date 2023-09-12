// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the generic WrapTextButton module.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */

define([
  'qowtRoot/configs/buttonConfigs/wrapTextButton'
], function(
    WrapTextButton) {

  'use strict';

  describe('Generic Wrap Text Button', function() {

    describe('Basic configuration.', function() {

      it('should be type button.', function() {
        expect(WrapTextButton.type).toBe('button');
      });
      it('should not define a text label.', function() {
        expect(WrapTextButton.label).not.toBeDefined();
      });
      it('should define the correct action.', function() {
        expect(WrapTextButton.action).toBe('wrapText');
      });
      it('should be sticky.', function() {
        expect(WrapTextButton.sticky).toBe(true);
      });
      it('should subscribe to selection changed signals.', function() {
        expect(WrapTextButton.subscribe).toBeDefined();
        expect(WrapTextButton.subscribe['qowt:selectionChanged']).toBeDefined();
      });
    });
  });
});
