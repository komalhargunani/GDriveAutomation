
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the Word FontFaceButton module.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/configs/buttonConfigs/documentButtons/fontFaceButton'
], function(
    FontFaceButton) {

  'use strict';

  describe('Word Font Face Button', function() {

    describe('Basic configuration.', function() {

      it('should subscribe to model update signals.', function() {
        expect(FontFaceButton.subscribe).toBeDefined();
        expect(FontFaceButton.subscribe['qowt:modelUpdate']).toBeDefined();
      });
      it('should have a styleFunc method defined.', function() {
        expect(FontFaceButton.styleFunc).toBeDefined();
      });
    });
  });
});
