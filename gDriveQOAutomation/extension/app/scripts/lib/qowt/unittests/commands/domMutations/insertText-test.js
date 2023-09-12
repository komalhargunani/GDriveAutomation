
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the insertText command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/domMutations/insertText'
], function(
    InsertTextCmd) {

  'use strict';


  describe('commands/domMutations/insertText.js', function() {
    var cmd = InsertTextCmd.create({spanEid: 'id1', offset: 1, text: 'hello'});
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
      expect(cmd.name).toBe('insertText');
    });
    it('should generate a dcpData packet with the correct opcode name',
       function() {
         expect(cmd.dcpData().name).toBe('insertText');
       });
    it('should check for missing crucial contextual information', function() {
      expect(function() {
        InsertTextCmd.create();
      }).toThrow();

      expect(function() {
        InsertTextCmd.create({
          spanEid: 'E12'
        });
      }).toThrow();

      expect(function() {
        InsertTextCmd.create({
          spanEid: 'E12',
          offset: 'E10'
        });
      }).toThrow();

      expect(function() {
        InsertTextCmd.create({
          spanEid: 'E12',
          offset: 'E10',
          text: 'xxx'
        });
      }).not.toThrow();
    });
  });

});
