
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the Word TextColorButton module.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/configs/buttonConfigs/documentButtons/textColorButton'
], function(
    TextColorButton) {

  'use strict';

  describe('Word Text Color Button', function() {

    describe('Basic configuration.', function() {

      it('should have a document contentType.', function() {
        expect(TextColorButton.contentType).toBe('document');
      });
    });
  });
});
