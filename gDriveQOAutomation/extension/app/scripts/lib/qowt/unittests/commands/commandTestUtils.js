
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Helper utilities and functions for testing command modules.
 * Use these to help reduce the amount of code you need to write in your
 * unit testing of commands.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/savestate/saveStateManager',
  'qowtRoot/utils/typeUtils'
], function(
    CommandBase,
    SaveStateManager,
    TypeUtils) {

  'use strict';

  var _api = {

    expectInvalidConstructionContextsToThrow: function(factory, list) {
      expect(TypeUtils.isFunction(factory.create)).toBe(true);
      list.forEach(function(context) {
        expect(factory.create.bind(this, context)).toThrow();
      });
    },

    /**
     * Test if a command is optimistic as expected.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean=} opt_expectation Defaults to expecting True.
     */
    expectIsOptimistic: function(command, opt_expectation) {
      opt_expectation = (opt_expectation === undefined) ?
          true :
          opt_expectation;
      expect(command.isOptimistic()).toBe(opt_expectation);
    },

    /**
     * Test if a command is revertible as expected.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean=} opt_expectation Defaults to expecting True.
     */
    expectIsRevertible: function(command, opt_expectation) {
      opt_expectation = (opt_expectation === undefined) ?
          true :
          opt_expectation;
      if (opt_expectation) {
        expect(command.doRevert).toBeDefined();
        expect(TypeUtils.isFunction(command.doRevert)).toBe(true);
      } else {
        expect(command.doRevert).not.toBeDefined();
      }
    },

    /**
     * Test if a command calls the core as expected.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean=} opt_expectation Defaults to expecting True.
     */
    expectCallsService: function(command, opt_expectation) {
      opt_expectation = (opt_expectation === undefined) ?
          true :
          opt_expectation;
      expect(command.callsService()).toBe(opt_expectation);

      if (!opt_expectation) {
        expect(command.dcpData).not.toBeDefined();
      }
    },

    /**
     * Test if a command is invertible.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean=} opt_expectation Defaults to expecting True.
     */
    expectCanInvert: function(command, opt_expectation) {
      opt_expectation = (opt_expectation === undefined) ?
          true :
          opt_expectation;
      expect(command.canInvert).toBe(opt_expectation);
      if (opt_expectation) {
        expect(command.getInverse).toBeDefined();
        expect(TypeUtils.isFunction(command.getInverse)).toBe(true);
      }
    },

    /**
     * Test if a command can revert.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean=} opt_expectation Defaults to expecting True.
     */
    expectCanRevert: function(command, opt_expectation) {
      opt_expectation = (opt_expectation === undefined) ?
          true :
          opt_expectation;
      if (opt_expectation) {
        expect(command.doRevert).toBeDefined();
        expect(TypeUtils.isFunction(command.doRevert)).toBe(true);
      } else {
        expect(command.doRevert).toBeUndefined();
      }
    },

    /**
     * Tests that a command generates an inverse command object with the
     * expected name, and that the inverse is of type CommandBase.
     *
     * Note that while inverses can be of other types (Future<CommandBase>,
     * QueueableCommand, Future<QueueableCommand>) for the purposes of command
     * unit tests this API only checks for type CommandBase.
     *
     * @param {Object} command The command instance to test.
     * @param {String} expectedInverse The name of the expected inverse command.
     */
    generatesExpectedInverse: function(command, expectedInverse) {
      var inverse = command.getInverse();
      expect(CommandBase.isCommand(inverse)).toBe(true);
      expect(TypeUtils.isObject(inverse)).toBe(true);
      expect(inverse.name).toBe(expectedInverse);
    },

    /**
     * Tests if a command's doOptimistic() implementation will result in a
     * a dirty save state.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean} expectToBeDitry The expectation to test.
     */
    expectMakesDocumentDirty: function(command, expectToBeDirty) {
      expect(SaveStateManager.isSaved()).toBe(true);
      command.doOptimistic();
      expect(SaveStateManager.isSaved()).toBe(!expectToBeDirty);
    }
  };

  return _api;
});
