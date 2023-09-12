/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview Unit test for the convertToDocs common command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/common/convertToDocs',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/pubsub/pubsub'
], function(
    ConvertToDocsCmd,
    CommandUtils,
    PubSub
) {

  'use strict';

  describe('commands/common/convertToDocs.js', function() {
    var command;

    beforeEach(function() {
      command = ConvertToDocsCmd.create();
    });

    afterEach(function() {
      command = undefined;
    });

    it('should not throw during correct creation', function() {
      expect(function() {
        ConvertToDocsCmd.create();
      }).not.toThrow();
    });

    it('should create a correctly named command', function() {
      expect(command.name).toBe('convertToDocs');
    });

    it('should generate a dcpData packet with the correct opcode', function() {
       expect(command.dcpData().name).toBe('convertToDocs');
     });

    it('should be an optimistic command', function() {
        expect(command.isOptimistic()).toBeTruthy();
      });

    it('should be a core command', function() {
      CommandUtils.expectCallsService(command);
    });

    it('should publish a signal with the doOptimistic() method', function() {
      spyOn(PubSub, 'publish');
      command.doOptimistic();
      expect(PubSub.publish.callCount).toBe(1);
      expect(PubSub.publish).toHaveBeenCalledWith('qowt:driveFileNotification',
        {type: 'convertStart'});

      PubSub.publish.reset();
    });
  });
});
