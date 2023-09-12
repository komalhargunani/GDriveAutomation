
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview A reusable test suite specifically for Qowt Text Commands.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/utils/typeUtils'
], function(
    CommandUtils,
    TypeUtils) {

  'use strict';

  var _api = {
    /**
     * Allows performing a set of multiple checks that are common to all
     * the text commands.
     *
     * @param {Object} textCommand Text command to be checked.
     */
    assertUsing: function(textCommand) {
      describe('standard text command asserts', function() {
        it('should be optimistic', function() {
          CommandUtils.expectIsOptimistic(textCommand);
        });

        it('should not call the core', function() {
          CommandUtils.expectCallsService(textCommand, false);
        });

        it('should not be able to invert', function() {
          CommandUtils.expectCanInvert(textCommand, false);
        });

        it('should implement a changeHtml function', function() {
          expect(textCommand.changeHtml).toBeDefined();
          expect(TypeUtils.isFunction(textCommand.changeHtml)).toBe(true);
        });
      });
    }
  };

  return _api;
});




