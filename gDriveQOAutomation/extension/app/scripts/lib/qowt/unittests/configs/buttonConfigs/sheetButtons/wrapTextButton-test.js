// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the Sheet WrapTextButton module.
 *
 * @author upasana.kumari@synerzip.com (Upasana Kumari)
 */

define([
  'qowtRoot/configs/buttonConfigs/sheetButtons/wrapTextButton'
], function(
    WrapTextButton) {

  'use strict';

  describe('Sheet Wrap Text Button', function() {

    describe('Basic configuration.', function() {

      it('should subscribe to menu item selected signals.', function() {
        expect(WrapTextButton.subscribe).toBeDefined();
        expect(WrapTextButton.subscribe['qowt:formattingChanged']).
          toBeDefined();
      });
    });
  });
});
