
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the newCharRun command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/domMutations/newCharRun'
], function(
    NewCharRunCmd) {

  'use strict';


  describe('commands/domMutations/newCharRun.js', function() {
    var cmd;
    beforeEach(function() {
      cmd = NewCharRunCmd.create({
        nodeId: 'id1',
        parentId: 'id2',
        siblingId: 'id3'
      });
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
      expect(cmd.name).toBe('newCharRun');
    });
    it('should generate a dcpData packet with the correct opcode name',
       function() {
         expect(cmd.dcpData().name).toBe('newCharRun');
       });
    it('should generate a complete dcp packet based on complete command ' +
        'context', function() {
          var payload = cmd.dcpData();
          expect(payload.nodeId).toBe('id1');
          expect(payload.parentId).toBe('id2');
          expect(payload.siblingId).toBe('id3');
        });
    it('should check for missing crucial contextual information', function() {
      expect(function() {
        NewCharRunCmd.create();
      }).toThrow();

      expect(function() {
        NewCharRunCmd.create({
          nodeId: 'E12'
        });
      }).toThrow();

      expect(function() {
        NewCharRunCmd.create({
          nodeId: 'E12',
          parentId: 'E10'
        });
      }).not.toThrow();
    });
  });

});
