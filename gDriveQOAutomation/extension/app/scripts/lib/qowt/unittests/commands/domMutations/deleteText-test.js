
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the deleteText command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/domMutations/deleteText'
], function(
    DeleteTextCmd) {

  'use strict';


  describe('commands/domMutations/deleteText.js', function() {
    var cmd;
    beforeEach(function() {
      cmd = DeleteTextCmd.create({spanEid: 'id1', offset: 2, text: 'the'});
    });

    afterEach(function() {
    });

    it('should not be optimistic', function() {
      expect(cmd.isOptimistic()).toBeFalsy();
    });
    it('should call the service', function() {
      expect(cmd.callsService()).toBeTruthy();
    });
    it('should create a correctly named command', function() {
      expect(cmd.name).toBe('deleteText');
    });
    it('should generate a dcpData packet with the correct opcode name',
       function() {
         expect(cmd.dcpData().name).toBe('deleteText');
       });
    it('should generate a complete dcp packet based on complete command ' +
        'context', function() {
          var payload = cmd.dcpData();
          expect(payload.spanId).toBe('id1');
          expect(payload.offset).toBe(2);
          expect(payload.length).toBe(3);
        });
    it('should check for missing crucial contextual information', function() {
      expect(function() {
        DeleteTextCmd.create();
      }).toThrow();

      expect(function() {
        DeleteTextCmd.create({
          spanEid: 'E12'
        });
      }).toThrow();

      expect(function() {
        DeleteTextCmd.create({
          spanEid: 'E12',
          offset: 23
        });
      }).toThrow();

      expect(function() {
        DeleteTextCmd.create({
          spanEid: 'E12',
          offset: 23,
          text: 'xxx'
        });
      }).not.toThrow();

    });

  });

});
