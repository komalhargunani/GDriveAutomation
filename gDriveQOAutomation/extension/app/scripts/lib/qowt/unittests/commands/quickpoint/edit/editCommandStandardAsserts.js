// Copyright 2014 Google Inc. All Rights Reserved.

/**
 * @fileoverview A reusable test suite specifically for QOWT point editCommands.
 *
 * Which ever module extending editCommandBase module should use this base
 * set of asserts as a part of unit tests
 *
 * Usage ==
 * Import this module as require module to your point command test suite.
 * say, by name EditCommandStandardAsserts; and let your command be ABC.
 *
 * Then you can assert as
 * EditCommandStandardAsserts.standard(ABC);
 *
 * If your command is optimistic then use asOptimistic() to assert common
 * optimistic aspects, like
 *
 * EditCommandStandardAsserts.asOptimistic(ABC, true);
 *
 * where parameter passed to asOptimistic() method tell optimistic nature.
 * Same is true for callService aspect, like
 *
 * Say your command does not call service and you want to assert accordingly
 * EditCommandStandardAsserts.asCallsService(ABC, false);
 *
 * @author rahul.tarafdar@synerzip.com (Rahul Tarafdar)
 */

define([
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/utils/typeUtils',
  'qowtRoot/commands/commandBase',
  'qowtRoot/savestate/saveStateManager'
], function(CommandUtils, TypeUtils, CommandBase, SaveStateManager) {

  'use strict';

  var _api = {

    /**
     *
     * Asserts common aspect for a point edit command irrespective of optimistic
     * and callService aspects
     *
     * @param {Object} pointEditCommand The point edit command
     */
    standard: function(pointEditCommand) {

      describe('standard point edit command asserts - common', function() {
        it('should be a command', function() {
          expect(CommandBase.isCommand(pointEditCommand));
        });

        it('should implement a changeHtml function', function() {
          expect(pointEditCommand.changeHtml).toBeDefined();
          expect(TypeUtils.isFunction(pointEditCommand.changeHtml)).toBe(true);
        });
      });
    },

    /**
     * Asserts a point edit command considering callService aspect
     *
     * @param {Object} pointEditCommand The point edit command
     * @param {Boolean=} opt_doCallService Flag to assert considering command to
     *     call service or not. True if command calls service, false otherwise.
     *     Default is true.
     */
    asCallsService: function(pointEditCommand, opt_doCallService) {

      opt_doCallService =
          (opt_doCallService === undefined) ? true : opt_doCallService;

      if (opt_doCallService) {
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
     *
     * @param {Object} pointEditCommand The point edit command
     * @param {Boolean=} opt_isOptimistic Flag to assert considering command to
     *     be optimistic or not. True if command is optimistic, false otherwise.
     *     Default is true
     * @param {Boolean=} opt_isRevertible Flag to assert whether the command is
     *     is revertible or not. If true the command should implement a
     *     doRevert(). Default is true.
     */
    asOptimistic: function(pointEditCommand, opt_isOptimistic,
                           opt_isRevertible) {

      opt_isOptimistic =
          (opt_isOptimistic === undefined) ? true : opt_isOptimistic;

      if (opt_isOptimistic) {
        describe('standard point edit command asserts which are optimistic',
            function() {
              it('should be optimistic', function() {
                CommandUtils.expectIsOptimistic(pointEditCommand, true);
              });

              it('should implement a doRevert function', function() {
                CommandUtils.expectIsRevertible(pointEditCommand,
                    opt_isRevertible);
              });

              it('should implement a doOptimistic function', function() {
                expect(pointEditCommand.doOptimistic).toBeDefined();
                expect(TypeUtils.isFunction(pointEditCommand.doOptimistic)).
                    toBe(true);
              });

              it('should mark the file state as dirty', function() {
                pointEditCommand.changeHtml = function() {};
                spyOn(SaveStateManager, 'markAsDirty');
                pointEditCommand.doOptimistic();
                expect(SaveStateManager.markAsDirty).toHaveBeenCalled();
              });
            });

      } else {
        describe('standard point edit command asserts which are non-optimistic',
            function() {
              it('should not be optimistic', function() {
                CommandUtils.expectIsOptimistic(pointEditCommand, false);
              });

              it('should not implement a doOptimistic function', function() {
                expect(pointEditCommand.doOptimistic).not.toBeDefined();
              });

              it('should not implement a doRevert function', function() {
                expect(pointEditCommand.doRevert).not.toBeDefined();
              });

              it('should mark the file state as dirty', function() {
                pointEditCommand.changeHtml = function() {};
                spyOn(SaveStateManager, 'markAsDirty');
                pointEditCommand.onSuccess();
                expect(SaveStateManager.markAsDirty).toHaveBeenCalled();
              });
            });
      }
    },

    asUndoGeneratedCommand: function() {

    }
  };

  return _api;
});




