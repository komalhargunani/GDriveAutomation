
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the formatElement command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/domMutations/formatElement'
], function(
    FormatElementCmd) {

  'use strict';

  describe('commands/domMutations/formatElement.js', function() {
    var cmd = FormatElementCmd.create({
      eid: 'E10',
      rpr: {clr: 'blue'}
    });

    it('should not be optimistic', function() {
      expect(cmd.isOptimistic()).toBe(false);
    });
    it('should call the service', function() {
      expect(cmd.callsService()).toBe(true);
    });
    it('should create a correctly named command', function() {
      expect(cmd.name).toBe('formatElement');
    });
    it('should generate a dcpData packet with the correct opcode name',
       function() {
         expect(cmd.dcpData().name).toBe('formatElement');
       });
    it('should check for missing crucial contextual information', function() {
      // Check for no mandatory arguments
      expect(function() {
        FormatElementCmd.create();
      }).toThrow();

      // Missing formatting information
      expect(function() {
        FormatElementCmd.create({
          eid: 'E12'
        });
      }).toThrow();

      // Missing eid
      expect(function() {
        FormatElementCmd.create({
          rpr: {clr: 'blue'}
        });
      }).toThrow();

      // All mandatory arguments should succeed. (empty formatting)
      expect(function() {
        FormatElementCmd.create({
          eid: 'E12',
          rpr: {}
        });
      }).not.toThrow();

      // All mandatory arguments should succeed.
      expect(function() {
        FormatElementCmd.create({
          eid: 'E12',
          rpr: {clr: 'blue'}
        });
      }).not.toThrow();

    });
    it('should check ump and all other errors', function() {
      var cmd = FormatElementCmd.create({
        eid: 'E12',
        rpr: {clr: 'blue'}});
      var myErrPolicyUMP = {};
      var myErrPolicyUEX = {};

      // ump errors should not be ignored
      expect(function() {
        cmd.onFailure({
          e: 'ump',
          id: '12',
          name: 'formatElement'
        }, myErrPolicyUMP);
      }).toThrow();

      // and check other errors are not ignored
      expect(function() {
        cmd.onFailure({
          e: 'uex',
          id: '12',
          name: 'formatElement'
        }, myErrPolicyUEX);
      }).toThrow();
    });

  });
});
