// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for UpdateRowsColumnsBase command
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/commands/quicksheet/updateRowsColumnsBase',
  'qowtRoot/savestate/saveStateManager',
  'qowtRoot/utils/typeUtils'
], function(
    UpdateRowsColumnsBase,
    SaveStateManager,
    TypeUtils) {

  'use strict';

  describe('UpdateRowsColumnsBase command', function() {

    var expectValidCommand = function(cmd, cmdName) {
      expect(cmd).toBeDefined();
      expect(cmd.name).toBe(cmdName);
      expect(cmd.id()).toBeDefined();
      expect(cmd.isOptimistic()).toBe(true);
      expect(cmd.callsService()).toBe(true);
      expect(TypeUtils.isFunction(cmd.doOptimistic)).toBe(true);
    };

    describe('creation', function() {
      it('constructor should create a command successfully with undefined ' +
          'parameters', function() {
            var cmdName;
            var cmd = UpdateRowsColumnsBase.create(cmdName);
            expectValidCommand(cmd, cmdName);
          });

      it('constructor should create a command successfully with defined ' +
          'parameters', function() {
            var cmdName = 'blah';
            var cmd = UpdateRowsColumnsBase.create(cmdName);
            expectValidCommand(cmd, cmdName);
          });

      it('doOptimistic() method should dirty the document', function() {
        var cmdName = 'blah';
        var cmd = UpdateRowsColumnsBase.create(cmdName);
        expect(SaveStateManager.isSaved()).toBe(true);
        cmd.doOptimistic();
        expect(SaveStateManager.isSaved()).toBe(false);
      });
    });
  });
});
