
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the start transaction command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */


define([
  'qowtRoot/commands/common/transactionStart',
  'qowtRoot/selection/selectionManager'
], function(
    TxStartCmd,
    SelectionManager) {

  'use strict';

  describe('commands/common/transactionStart', function() {
    var cmd;
    beforeEach(function() {
      cmd = TxStartCmd.create();
    });
    describe('creation', function() {
      it('should give a non-optimistic command', function() {
        expect(cmd.isOptimistic()).toBeFalsy();
      });
      it('should give a service-calling command', function() {
        expect(cmd.callsService()).toBeTruthy();
      });
    });
    describe('dcpData', function() {
      it('should specify the correct opcode', function() {
        var payload = cmd.dcpData();
        expect(payload.name).toBeDefined();
        expect(payload.name).toBe('txStart');
      });
    });

    describe('Set context in payload', function() {

      it('should set the context if includeContext is set to true', function() {
        var dummyContext = {
          eid: 'E71'
        };
        spyOn(SelectionManager, 'snapshot').andReturn(dummyContext);
        var cmd = TxStartCmd.create('txStart', false, true, true);

        expect(cmd.dcpData().context).toBe(JSON.stringify(dummyContext));
      });

      it('should not set context if includeContext is undefined', function() {
        var dummyContext = {
          eid: 'E71'
        };
        spyOn(SelectionManager, 'snapshot').andReturn(dummyContext);
        var cmd = TxStartCmd.create();

        expect(cmd.dcpData().context).not.toBeDefined();
      });
    });
  });
});
