// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview A reusable test suite specifically for Core Commands.
 *
 * @author sakhyaghosh@google.com (Sakhya Ghosh)
 */

define([
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/utils/typeUtils'
], function(
    CommandUtils,
    TypeUtils) {

  'use strict';

  var _api = {

    assertUsing: function(coreCommand) {

      describe('standard core command asserts', function() {

        it('should be optimistic', function() {
          CommandUtils.expectIsOptimistic(coreCommand);
        });

        it('should call the core', function() {
          CommandUtils.expectCallsService(coreCommand, true);
        });

        it('should implement the dcpData function', function() {
          expect(coreCommand.dcpData).toBeDefined();
          expect(TypeUtils.isFunction(coreCommand.dcpData)).toBe(true);
        });
      });
    }
  };

  return _api;
});
