// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for MarkDocDirtyCommandBase
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/commands/markDocDirtyCommandBase',
  'qowtRoot/savestate/saveStateManager',
  'qowtRoot/utils/typeUtils'
], function(
    MarkDocDirtyCommandBase,
    SaveStateManager,
    TypeUtils) {

  'use strict';

  describe('MarkDocDirtyCommandBase', function() {

    var expectValidCommand = function(cmd, cmdName) {
      expect(cmd).toBeDefined();
      expect(cmd.name).toBe(cmdName);
      expect(cmd.id()).toBeDefined();
      expect(cmd.isOptimistic()).toBe(true);
      expect(TypeUtils.isFunction(cmd.doOptimistic)).toBe(true);
    };

    describe('creation', function() {
      it('constructor should create a command successfully with undefined ' +
          'parameters', function() {
            var cmdName;
            var callsService;
            var cmd = MarkDocDirtyCommandBase.create(cmdName, callsService);
            expectValidCommand(cmd, cmdName);
            // defaults to false if param is undefined
            expect(cmd.callsService()).toBe(false);

            cmdName = 'blah';
            cmd = MarkDocDirtyCommandBase.create(cmdName, callsService);
            expectValidCommand(cmd, cmdName);
            // defaults to false if param is undefined
            expect(cmd.callsService()).toBe(false);

            cmdName = undefined;
            callsService = true;
            cmd = MarkDocDirtyCommandBase.create(cmdName, callsService);
            expectValidCommand(cmd, cmdName);
            expect(cmd.callsService()).toBe(true);
          });

      it('constructor should create a command successfully with defined ' +
          'parameters', function() {
            var cmdName = 'blah';
            var callsService = false;
            var cmd = MarkDocDirtyCommandBase.create(cmdName, callsService);
            expectValidCommand(cmd, cmdName);
            expect(cmd.callsService()).toBe(false);
          });

      it('doOptimistic() method should dirty the document', function() {
        var cmdName;
        var callsService;
        var cmd = MarkDocDirtyCommandBase.create(cmdName, callsService);
        expect(SaveStateManager.isSaved()).toBe(true);
        cmd.doOptimistic();
        expect(SaveStateManager.isSaved()).toBe(false);
      });

      it('doOptimistic() method should not be able to be overwritten',
         function() {
           var cmdName;
           var callsService;
           var cmd = MarkDocDirtyCommandBase.create(cmdName, callsService);

           var errorThrown;
           try {
             cmd.doOptimistic = function() {
             };
           }
           catch (e) {
             errorThrown = e;
           }

           expect(errorThrown).toBeDefined();
           expect(errorThrown.message.indexOf(
               'Cannot assign to read only property')).not.toBe(-1);
         });
    });
  });
});
