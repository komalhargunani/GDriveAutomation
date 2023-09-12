// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * Test suite for Mutation manager.
 *
 * @author priya.birajdar@synerzip.com (Priya Birajdar)
 */

define([
  'qowtRoot/contentMgrs/mutationMgr'
], function(MutationManager) {

  'use strict';

  describe('Test initialisation of Mutation Manager', function() {
    it('should throw error when MutationManager.init() called multiple times',
        function() {
          MutationManager.init();
          expect(MutationManager.init).toThrow(
              'Mutation Manager initialized multiple times.');
        });
  });
});
