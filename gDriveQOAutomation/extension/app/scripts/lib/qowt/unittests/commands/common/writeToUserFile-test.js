// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the WriteToUserFile command.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
    'qowtRoot/commands/common/writeToUserFile',
    'qowtRoot/pubsub/pubsub',
    'qowtRoot/savestate/saveStateManager',
    'qowtRoot/savestate/saveNotificationHandler'
  ],
  function(
    WriteToUserFileCmd,
    PubSub,
    SaveStateManager,
    SaveNotificationHandler) {

  'use strict';

  describe('The WriteToUserFile command', function() {
    var cmd;

    beforeEach(function() {
      cmd = WriteToUserFileCmd.create();
    });

    describe('creation', function() {
      it('should create a non-optimistic command', function() {
        expect(cmd.isOptimistic()).toBeFalsy();
      });

      it('should create a service-calling command', function() {
        expect(cmd.callsService()).toBeTruthy();
      });
    });

    describe('dcpData() method', function() {
      it('should call userFileSaveStarted() on the Save State Manager',
        function() {
        spyOn(SaveStateManager, 'userFileSaveStarted');
        spyOn(SaveNotificationHandler, 'suppressUnloadDialog');
        cmd.dcpData();
        expect(SaveStateManager.userFileSaveStarted).toHaveBeenCalled();
        expect(SaveNotificationHandler.suppressUnloadDialog)
          .toHaveBeenCalled();
      });
    });

    describe('onSuccess() method', function() {
      it('should call userFileSaveSucceeded() on the Save State Manager',
        function() {
        spyOn(SaveStateManager, 'userFileSaveSucceeded');
        spyOn(SaveNotificationHandler, 'unsuppressUnloadDialog');
        var response = {};
        cmd.onSuccess(response);
        expect(SaveStateManager.userFileSaveSucceeded).toHaveBeenCalled();
        expect(SaveNotificationHandler.unsuppressUnloadDialog)
          .toHaveBeenCalled();
      });

      it('should not call userFileSaveSucceeded() on the Save State Manager ' +
        'if the user cancelled the operation',
        function() {
        spyOn(SaveStateManager, 'userFileSaveSucceeded');
        spyOn(SaveNotificationHandler, 'unsuppressUnloadDialog');
        spyOn(SaveStateManager, 'userFileSaveCanceled');
        var response = {userCancelled: true};
        cmd.onSuccess(response);
        expect(SaveStateManager.userFileSaveSucceeded).not.toHaveBeenCalled();
        expect(SaveStateManager.userFileSaveCanceled).toHaveBeenCalled();
        expect(SaveNotificationHandler.unsuppressUnloadDialog)
          .toHaveBeenCalled();
      });

      it('should call userFileSaveCanceled() on the Save State Manager ' +
          'if the user cancelled the operation',
        function () {
        spyOn(SaveStateManager, 'userFileSaveCanceled');
        spyOn(SaveNotificationHandler, 'unsuppressUnloadDialog');
        var response = {userCancelled: true};
        cmd.onSuccess(response);
        expect(SaveStateManager.userFileSaveCanceled).toHaveBeenCalled();
        expect(SaveNotificationHandler.unsuppressUnloadDialog)
          .toHaveBeenCalled();
      });

      it('should update the display name of file on call of ' +
        'userFileSaveSucceeded() on the Save State Manager ', function() {

          spyOn(SaveStateManager, 'userFileSaveSucceeded');
          spyOn(SaveNotificationHandler, 'unsuppressUnloadDialog');
          spyOn(PubSub, 'publish');

          var response = {displayName: 'savedFile'};
          cmd.onSuccess(response);
          expect(SaveStateManager.userFileSaveSucceeded).toHaveBeenCalled();
          expect(PubSub.publish.callCount).toBe(1);
          expect(PubSub.publish).toHaveBeenCalledWith('qowt:updateFileName',
            'savedFile');
          PubSub.publish.reset();
          expect(SaveNotificationHandler.unsuppressUnloadDialog)
            .toHaveBeenCalled();
        });
    });

    describe('onFailure() method', function() {
      it("should call userFileSaveFailed() on the Save State Manager " +
        "if the user didn't cancel", function() {
        spyOn(SaveStateManager, 'userFileSaveFailed');
        spyOn(SaveNotificationHandler, 'unsuppressUnloadDialog');
        var response = {};
        var errorPolicy = {};
        cmd.onFailure(response, errorPolicy);
        expect(SaveStateManager.userFileSaveFailed).toHaveBeenCalled();
        expect(SaveNotificationHandler.unsuppressUnloadDialog)
          .toHaveBeenCalled();
      });
    });
  });
});
