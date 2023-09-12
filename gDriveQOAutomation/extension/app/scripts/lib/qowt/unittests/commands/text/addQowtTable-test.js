// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview Unit test for the addQowtTable command.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */

define([
  'qowtRoot/commands/text/addQowtTable',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    AddQowtTableCmd,
    CommandUtils,
    TextCommandStandardAsserts) {

  'use strict';

  describe('commands/text/addQowtTable-test.js', function() {
    var context = {
      nodeId: 'E78',
      parentId: 'E84'
    };
    var command = AddQowtTableCmd.create(context);

    TextCommandStandardAsserts.assertUsing(command);

    it('should not throw during correct creation', function() {
      expect(function() {
        AddQowtTableCmd.create(context);
      }).not.toThrow();
    });

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('addQowtTable');
    });

    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
        {
          /* Missing all args */
        },
        { // Missing nodeId
          parentId: 'E84'
        },
        { // Missing parentId
          nodeId: 'E78'
        }
      ];

      CommandUtils.expectInvalidConstructionContextsToThrow(
          AddQowtTableCmd, invalidContexts);
    });
  });
});
