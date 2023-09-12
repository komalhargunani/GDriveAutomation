
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the getDocumentStatistics command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/quickword/getDocumentStatistics',
  'qowtRoot/utils/typeUtils'
], function(
    GetDocStatsCmd,
    TypeUtils) {

  'use strict';

  describe('commands/quickword/GetDocumentStatistics-test', function() {
    var cmd;
    beforeEach(function() {
      cmd = GetDocStatsCmd.create();
    });

    describe('initialisation', function() {
      it('should create a correctly configured command', function() {
        expect(cmd.isOptimistic()).toBe(false);
        expect(cmd.callsService()).toBe(true);
        expect(cmd.name).toBe('getDocumentStatistics');
      });
    });
    describe('dcpData', function() {
      it('must be implemented', function() {
        expect(cmd.dcpData).toBeDefined();
        expect(TypeUtils.isFunction(cmd.dcpData)).toBe(true);
      });
      it('must return a JSON object', function() {
        var data = cmd.dcpData();
        expect(data).toBeDefined();
        expect(TypeUtils.isObject(data)).toBe(true);
      });
      it('must set the name property', function() {
        var payload = cmd.dcpData();
        expect(payload.name).toBe('getDocumentStatistics');
      });
    });

    describe('onFailure', function() {
      it('should be implemented', function() {
        expect(cmd.onFailure).toBeDefined();
        expect(TypeUtils.isFunction(cmd.onFailure)).toBe(true);
      });
      it('should ignore any generated error', function() {
        var response = {},
            policy = {};

        cmd.onFailure(response, policy);
        expect(policy.ignoreError).toBe(true);
      });
    });
  });
});
