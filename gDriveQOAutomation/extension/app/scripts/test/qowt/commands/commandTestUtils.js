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

    /**
     * Test a command for invalid context. If context is invalid, throws error
     * @param {object} factory Any command factory
     * @param {array} list Context array
     */
    expectInvalidConstructionContextsToThrow: function(factory, list) {
      assert.isTrue(TypeUtils.isFunction(factory.create), 'factory.create()');
      list.forEach(function(item) {
        assert.throws(
            factory.create.bind(this, item.context),
            undefined,
            item.errorMsg,
            'throws an invalid construction contexts error');
      });
    },

    /**
     * Test if a command is optimistic as expected.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean} isOptimistic Flag to assert considering command to
     *     be optimistic or not.
     */
    expectIsOptimistic: function(command, isOptimistic) {
      assert.strictEqual(command.isOptimistic(), isOptimistic, command.name +
          '.isOptimistic() return value should be same as isOptimistic');
    },


    expectIsCmdCreationSuccessful: function(command, cmdName) {
      assert.isDefined(command, cmdName + ' command should be defined');
    },


    expectIsCmdNameAsExpected: function(command, cmdName) {
      assert.strictEqual(command.name, cmdName,
          'Command name should be as expected');
    },


    expectCommandId: function(command) {
      assert.isDefined(command.id(), command.name + '.id()');
    },


    /**
     * Test if a command is revertible as expected.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean} isRevertible Flag to assert whether the command is
     *     is revertible or not.
     */
    expectIsRevertible: function(command, isRevertible) {
      if (isRevertible) {
        assert.isFunction(command.doRevert, 'command.doRevert()');
      } else {
        assert.isNotFunction(command.doRevert, 'doRevert');
      }
    },

    /**
     * Test if a command calls the core as expected.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean} doCallService Flag to assert considering command should
     *     calls service or not.
     */
    expectCallsService: function(command, doCallService) {
      assert.strictEqual(command.callsService(), doCallService, command.name +
          '.callsService() return value should be same as doCallService');

      if (doCallService) {
        assert.isFunction(command.dcpData, 'command.dcpData()');
      } else {
        assert.isNotFunction(command.dcpData, 'dcpData');
      }
    },

    /**
     * Test if a command is invertible.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean} canInvert Flag to assert considering command is
     *     invertible or not.
     */
    expectCanInvert: function(command, canInvert) {
      assert.strictEqual(command.canInvert, canInvert,
          'command.canInvert should have same value as canInvert');
      if (canInvert) {
        assert.isFunction(command.getInverse, 'command.getInverse()');
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
      assert.isTrue(CommandBase.isCommand(inverse),
          'inverse should be a command');
      assert.isTrue(TypeUtils.isObject(inverse), 'inverse is an object');
      assert.strictEqual(inverse.name, expectedInverse,
          'name should have same value as expectedInverse value');
    },

    /**
     * Tests if a command's doOptimistic() implementation will result in a
     * a dirty save state.
     *
     * @param {Object} command The command instance to test.
     * @param {Boolean} expectToBeDirty The expectation to test.
     */
    expectMakesDocumentDirty: function(command, expectToBeDirty) {
      assert.isTrue(SaveStateManager.isSaved(), 'save state');
      command.doOptimistic();
      assert.strictEqual(SaveStateManager.isSaved(), !expectToBeDirty,
          'dirty state');
    }
  };

  return _api;
});
