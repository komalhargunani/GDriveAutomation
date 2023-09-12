define([
  'test/qowt/commands/commandTestUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/commands/commandBase',
  'qowtRoot/savestate/saveStateManager'
], function(
    CommandUtils,
    TypeUtils,
    CommandBase,
    SaveStateManager) {

  'use strict';

  var _api = {

    /**
     *
     * Asserts common aspect for a point edit command irrespective of optimistic
     * and callService aspects.
     * Import this module as require module to your point command test suite.
     * say, by name EditCommandStandardAsserts; and let your command be ABC.
     * Then you can assert as
     * EditCommandStandardAsserts.standard(ABC);
     * @param {Object} pointEditCommand The point edit command
     */
    standard: function(pointEditCommand) {

      describe('standard point edit command asserts - common', function() {
        it('should be a command', function() {
          assert.isTrue(CommandBase.isCommand(pointEditCommand),
              'pointEditCommand should be a command');
        });

        it('should implement a changeHtml function', function() {
          assert.isDefined(pointEditCommand.changeHtml,
              'changeHtml is defined');
          assert.isTrue(TypeUtils.isFunction(pointEditCommand.changeHtml),
              'pointEditCommand.changeHtml()');
        });
      });
    },

    /**
     * Asserts a point edit command considering callService aspect
     * Say your command does not call service and you want to assert accordingly
     * EditCommandStandardAsserts.asCallsService(ABC, false);
     * @param {Object} pointEditCommand The point edit command
     * @param {Boolean} doCallService Flag to assert considering command to
     *     call service or not. True if command calls service, false otherwise.
     *     Default is true.
     */
    asCallsService: function(pointEditCommand, doCallService) {
      if (doCallService) {
        describe('standard point edit command asserts which calls service',
            function() {
              it('should call the core', function() {
                CommandUtils.expectCallsService(pointEditCommand, true);
              });
            });
      } else {
        describe('standard point edit command asserts which does not call' +
            ' service', function() {
              it('should not call the core', function() {
                CommandUtils.expectCallsService(pointEditCommand, false);
              });

            }
        );

      }
    },

    /**
     * Asserts a point edit command considering optimistic aspect
     * If your command is ABC and it is optimistic then use asOptimistic() to
     * assert common optimistic aspects, like
     * EditCommandStandardAsserts.asOptimistic(ABC, true);
     * where parameter passed to asOptimistic() method tell optimistic nature.
     * Same is true for callService aspect, like
     * @param {Object} pointEditCommand The point edit command
     * @param {Boolean} isOptimistic Flag to assert considering command to
     *     be optimistic or not. True if command is optimistic, false otherwise.
     * @param {Boolean} isRevertible Flag to assert whether the command is
     *     is revertible or not. If true the command should implement a
     *     doRevert().
     */
    asOptimistic: function(pointEditCommand, isOptimistic, isRevertible) {
      if (isOptimistic) {
        describe('standard point edit command asserts which are optimistic',
            function() {
              it('should be optimistic', function() {
                CommandUtils.expectIsOptimistic(pointEditCommand, true);
              });

              it('should implement a doRevert function', function() {
                CommandUtils.expectIsRevertible(pointEditCommand, isRevertible);
              });

              it('should implement a doOptimistic function', function() {
                assert.isFunction(pointEditCommand.doOptimistic,
                    'pointEditCommand.doOptimistic()');
              });

              it('should mark the file state as dirty', function() {
                pointEditCommand.changeHtml = function() {};
                sinon.spy(SaveStateManager, 'markAsDirty');
                pointEditCommand.doOptimistic();
                assert.isTrue(
                    SaveStateManager.markAsDirty.calledOnce,
                    'markAsDirty method called once');
                SaveStateManager.markAsDirty.restore();
              });
            });

      } else {
        describe('standard point edit command asserts which are non-optimistic',
            function() {
              it('should not be optimistic', function() {
                CommandUtils.expectIsOptimistic(pointEditCommand, false);
              });

              it('should not implement a doOptimistic function', function() {
                assert.isUndefined(pointEditCommand.doOptimistic,
                    'doOptimistic is undefined');
              });

              it('should not implement a doRevert function', function() {
                assert.isUndefined(pointEditCommand.doRevert,
                    'doRevert is undefined');
              });

              it('should mark the file state as dirty', function() {
                pointEditCommand.changeHtml = function() {};
                sinon.spy(SaveStateManager, 'markAsDirty');
                pointEditCommand.onSuccess();
                assert.isTrue(
                    SaveStateManager.markAsDirty.calledOnce,
                    'markAsDirty method called once');
                SaveStateManager.markAsDirty.restore();
              });
            });
      }
    }
  };

  return _api;
});




