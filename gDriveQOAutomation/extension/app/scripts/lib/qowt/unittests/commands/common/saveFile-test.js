// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the SaveFile command.
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
    'qowtRoot/commands/common/saveFile',
    'qowtRoot/commands/commandBase',
    'qowtRoot/models/env',
    'qowtRoot/pubsub/pubsub'
  ],
  function(
    SaveFileCmd,
    CommandBase,
    EnvModel,
    PubSub) {

  'use strict';

  describe('The SaveFile command', function() {

    describe('creation', function() {
      it('should create a non-optimistic command', function() {
        var cmd = SaveFileCmd.create();
        expect(cmd.isOptimistic()).toBeFalsy();
      });

      it('should create a service-calling command', function() {
        var cmd = SaveFileCmd.create();
        expect(cmd.callsService()).toBeTruthy();
      });
    });

    describe('dcpData() method', function() {
      it("should publish a 'qowt:ss:saving' signal", function() {
        var cmd = SaveFileCmd.create();
        spyOn(PubSub, 'publish').andCallThrough();
        EnvModel.app = 'sheet';
        cmd.dcpData();
        expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:saving',
          {twoPhaseSave: false});
        expect(PubSub.publish.callCount).toBe(1);

        PubSub.publish.reset();
        cmd.addChild(CommandBase.create('overwriteUserFile', false, true));
        cmd.dcpData();
        expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:saving',
          {twoPhaseSave: true});
        expect(PubSub.publish.callCount).toBe(1);
      });
    });

    describe('onFailure() method', function() {
      it('should call saveFailed() on the Save State Manager',
        function() {
        var cmd = SaveFileCmd.create();
        spyOn(PubSub, 'publish').andCallThrough();
        cmd.onFailure({e: 'blah'});
        expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:savingFailed',
          {twoPhaseSave: false});
        expect(PubSub.publish.callCount).toBe(2);

        PubSub.publish.reset();
        cmd.addChild(CommandBase.create('overwriteUserFile', false, true));
        cmd.onFailure({e: 'blah'});
        expect(PubSub.publish).toHaveBeenCalledWith('qowt:ss:savingFailed',
          {twoPhaseSave: true});
        expect(PubSub.publish.callCount).toBe(2);
      });
    });
  });
});
