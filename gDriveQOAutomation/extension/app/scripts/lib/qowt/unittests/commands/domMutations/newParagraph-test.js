
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the newParagraph command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/domMutations/newParagraph'
], function(
    NewParagraphCmd) {

  'use strict';

  describe('commands/domMutations/newParagraph.js', function() {
    var cmd;
    beforeEach(function() {
      cmd = NewParagraphCmd.create({
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
    it('should create a correctly named newParagraph command', function() {
      expect(cmd.name).toBe('newParagraph');
    });
    it('should generate a dcpData packet with the newParagraph opcode name',
       function() {
         expect(cmd.dcpData().name).toBe('newParagraph');
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
        NewParagraphCmd.create();
      }).toThrow();

      expect(function() {
        NewParagraphCmd.create({
          nodeId: 'E12'
        });
      }).toThrow();

      expect(function() {
        NewParagraphCmd.create({
          nodeId: 'E12',
          parentId: 'E10'
        });
      }).not.toThrow();

      expect(function() {
        NewParagraphCmd.create({
          nodeId: 'E12',
          parentId: 'E10'
        });
      }).not.toThrow();
    });
  });

});
