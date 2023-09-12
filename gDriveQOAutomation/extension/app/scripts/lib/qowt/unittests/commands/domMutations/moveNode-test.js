
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the moveNode command.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/commands/domMutations/moveNode'
], function(
    MoveNodeCmd) {

  'use strict';


  describe('commands/domMutations/moveNode.js', function() {
    var cmd = MoveNodeCmd.create({nodeId: 'E11', parentId: 'E10',
      oldParentId: 'E12', siblingId: 'E13'});
    beforeEach(function() {
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
      expect(cmd.name).toBe('moveNode');
    });
    it('should generate a dcpData packet with the correct opcode name',
       function() {
         expect(cmd.dcpData().name).toBe('moveNode');
       });
    it('should generate a dcpData packet with the correct contextual data',
       function() {
         var dcpData = cmd.dcpData();
         expect(dcpData.nodeId).toBe('E11');
         expect(dcpData.parentId).toBe('E10');
         expect(dcpData.oldParentId).toBe('E12');
         expect(dcpData.siblingId).toBe('E13');
       });
    it('should check for missing crucial contextual information', function() {
      expect(function() {
        MoveNodeCmd.create();
      }).toThrow();

      expect(function() {
        MoveNodeCmd.create({
          nodeId: 'E12'
        });
      }).toThrow();

      expect(function() {
        MoveNodeCmd.create({
          nodeId: 'E12',
          parentId: 'E10'
        });
      }).toThrow();

      expect(function() {
        MoveNodeCmd.create({
          nodeId: 'E12',
          parentId: 'E10',
          oldParentId: 'E11'
        });
      }).not.toThrow();
    });
  });

});
