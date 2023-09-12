
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the deleteNode command.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */

define([
  'qowtRoot/commands/domMutations/deleteNode'
], function(
    DeleteNodeCmd) {

  'use strict';


  describe('commands/domMutations/deleteNode.js', function() {
    var node = document.createElement('div');
    var cmd = DeleteNodeCmd.create({
      node: node,
      nodeEid: 'E11',
      parentEid: 'E10'});
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
      expect(cmd.name).toBe('deleteNode');
    });
    it('should generate a dcpData packet with the correct opcode name',
       function() {
         expect(cmd.dcpData().name).toBe('deleteNode');
       });
    it('should check for missing crucial contextual information', function() {
      expect(function() {
        DeleteNodeCmd.create();
      }).toThrow();

      expect(function() {
        DeleteNodeCmd.create({
          parentEid: 'E12'
        });
      }).toThrow();

      expect(function() {
        DeleteNodeCmd.create({
          node: document.createElement('div'),
          nodeEid: 'E12',
          parentEid: 'E10'
        });
      }).not.toThrow();
    });
  });

});
