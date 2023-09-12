// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit tests for Sequencer singleton.
 *
 * @author harish.khattri@synerzip.com (Harish Khattri)
 */

define([
  'qowtRoot/tools/text/mutations/sequencer'
], function(Sequencer) {

  'use strict';

  describe('Sequencer test', function() {
    beforeEach(function() {
      Sequencer.init();
    });

    it('should throw error when init called multiple times', function() {
      expect(Sequencer.init).toThrow('sequencer.init() called multiple times.');
    });
  });
});
