// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview Unit test for the addQowtTableCell command.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
  'qowtRoot/commands/text/addQowtTableCell',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    AddQowtTableCellCmd,
    CommandUtils,
    TextCommandStandardAsserts) {

  'use strict';

  describe('commands/text/addQowtTableCell-test.js', function() {
    var context = {
      nodeId: 'E78',
      parentId: 'E84'
    };
    var command = AddQowtTableCellCmd.create(context);

    TextCommandStandardAsserts.assertUsing(command);

    it('should not throw during correct creation', function() {
      expect(function() {
        AddQowtTableCellCmd.create(context);
      }).not.toThrow();
    });

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('addQowtTableCell');
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
          AddQowtTableCellCmd, invalidContexts);
    });
  });
});
