// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the Save State Manager.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
    'qowtRoot/savestate/saveStateManager',
    'qowtRoot/pubsub/pubsub'
    ],
    function(
      SaveStateManager,
      PubSub) {

  'use strict';

  describe('The Save State Manager', function() {

    it('should respond to dirtying the document', function() {
      expect(SaveStateManager.isSaved()).toBe(true);
      spyOn(PubSub, 'publish').andCallThrough();

      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      expect(PubSub.publish.callCount).toBe(2);
      expect(PubSub.publish.calls[0].args[0]).toBe('qowt:ss:editApplied');
      expect(PubSub.publish.calls[1].args[0]).toBe('qowt:ss:dirty');
      PubSub.publish.reset();

      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      expect(PubSub.publish.callCount).toBe(1);
      expect(PubSub.publish.calls[0].args[0]).toBe('qowt:ss:editApplied');
    });

    it('should properly handle starting and finishing a user file save',
      function() {
      expect(SaveStateManager.isSaved()).toBe(true);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);

      spyOn(PubSub, 'publish').andCallThrough();
      var token = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      expect(PubSub.publish).not.toHaveBeenCalled();
      SaveStateManager.userFileSaveSucceeded(token);
      expect(SaveStateManager.isSaved()).toBe(true);
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:saved');
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);

      PubSub.publish.reset();
      token = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      expect(PubSub.publish).not.toHaveBeenCalled();
      SaveStateManager.userFileSaveFailed(token);
      expect(SaveStateManager.isSaved()).toBe(false);
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:writingFailed',
        {errorCode: undefined});
      expect(SaveStateManager.isSaved()).toBe(false);
    });

    it('should support saving the doc when it is not dirty', function() {
      expect(SaveStateManager.isSaved()).toBe(true);

      spyOn(PubSub, 'publish').andCallThrough();
      var token = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      expect(PubSub.publish).not.toHaveBeenCalled();
      SaveStateManager.userFileSaveSucceeded(token);
      expect(SaveStateManager.isSaved()).toBe(true);
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:saved');
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
    });

    it('should correctly determine when a doc is saved or not', function() {
      expect(SaveStateManager.isSaved()).toBe(true);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.userFileSaveSucceeded(token);
      expect(SaveStateManager.isSaved()).toBe(true);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      token = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
    });

    it('should support concurrent successful saves', function() {
      expect(SaveStateManager.isSaved()).toBe(true);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token1 = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token2 = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      spyOn(PubSub, 'publish').andCallThrough();
      SaveStateManager.userFileSaveSucceeded(token1);
      expect(PubSub.publish).not.toHaveBeenCalled();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.userFileSaveSucceeded(token2);
      expect(SaveStateManager.isSaved()).toBe(true);
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:saved');
    });

    it('should support concurrent failed saves', function() {
      expect(SaveStateManager.isSaved()).toBe(true);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token1 = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token2 = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      spyOn(PubSub, 'publish').andCallThrough();
      SaveStateManager.userFileSaveFailed(token1);
      expect(PubSub.publish).not.toHaveBeenCalled();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.userFileSaveFailed(token2);
      expect(SaveStateManager.isSaved()).toBe(false);
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:writingFailed',
        {errorCode: undefined});
    });

    it('should support concurrent failed then successful saves', function() {
      expect(SaveStateManager.isSaved()).toBe(true);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token1 = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token2 = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      spyOn(PubSub, 'publish').andCallThrough();
      SaveStateManager.userFileSaveFailed(token1);
      expect(PubSub.publish).not.toHaveBeenCalled();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.userFileSaveSucceeded(token2);
      expect(SaveStateManager.isSaved()).toBe(true);
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:saved');
    });

    it('should support concurrent successful then failed saves', function() {
      expect(SaveStateManager.isSaved()).toBe(true);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token1 = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token2 = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      spyOn(PubSub, 'publish').andCallThrough();
      SaveStateManager.userFileSaveSucceeded(token1);
      expect(PubSub.publish).not.toHaveBeenCalled();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.userFileSaveFailed(token2);
      expect(SaveStateManager.isSaved()).toBe(false);
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:writingFailed',
        {errorCode: undefined});
    });

    it('should handle concurrent dirtying and saving', function() {
      expect(SaveStateManager.isSaved()).toBe(true);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      var token = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.markAsDirty();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.userFileSaveSucceeded(token);
      expect(SaveStateManager.isSaved()).toBe(true);
      token = SaveStateManager.userFileSaveStarted();
      expect(SaveStateManager.isSaved()).toBe(false);
      SaveStateManager.userFileSaveSucceeded(token);
      expect(SaveStateManager.isSaved()).toBe(true);
    });
  });
});
