// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview unit tests for text tool singleton
 *
 * @author harish.khattri@synerzip.com (Harish Khattri)
 */

define([
  'qowtRoot/tools/text/textTool',
  'qowtRoot/tools/text/mutations/sequencer'
], function(TextTool, MutationSequencer) {

  'use strict';

  describe('Sequencer test', function() {
    beforeEach(function() {
      spyOn(MutationSequencer, 'init');
      TextTool.init();
    });

    afterEach(function() {
      TextTool.destroy();
    });

    it('should throw error when init called multiple times', function() {
      expect(TextTool.init).toThrow('textTool.init() called multiple times.');
    });

    it('should initializes sequencer when text tool gets initialized',
        function() {
          expect(MutationSequencer.init).toHaveBeenCalled();
        });
  });
});
