
// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit tests for the start transaction command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */


define([
    'qowtRoot/commands/common/transactionEnd',
    'qowtRoot/selection/selectionManager'
  ], function(
    TxEndCmd,
    SelectionManager) {

  'use strict';

  describe('commands/common/transactionEnd', function() {
    var cmd,
        dummyContext = {
          end: {
            eid: "E82",
            offset: 12
          },
          start: {
            eid: "E82",
            offset: 12
          }
        };

    beforeEach(function() {
      spyOn(SelectionManager, 'snapshot').andReturn(dummyContext);
      cmd = TxEndCmd.create('txEnd', true, true, SelectionManager.snapshot());
    });
    describe('creation', function() {
      it('should give an optimistic command', function() {
        expect(cmd.isOptimistic()).toBeTruthy();
      });
      it('should give a service-calling command', function() {
        expect(cmd.callsService()).toBeTruthy();
      });
    });
    describe('dcpData', function() {
      it('should specify the correct opcode', function() {
        var payload = cmd.dcpData();
        expect(payload.name).toBeDefined();
        expect(payload.name).toBe('txEnd');
        expect(payload.context).toEqual(JSON.stringify(dummyContext));
      });
    });
  });
});
