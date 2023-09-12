
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the deleteQowtElement command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/common/deleteQowtElement',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    QowCmd,
    CommandUtils,
    TextCommandStandardAsserts) {

  'use strict';

  describe('commands/common/deleteQowtElement-test.js', function() {
    var context = {
      node: {},
      nodeId: 'E1',
      parentId: 'E2'
    };
    var command = QowCmd.create(context);

    TextCommandStandardAsserts.assertUsing(command);

    it('should not throw during correct creation', function() {
      expect(function() {
        QowCmd.create(context);
      }).not.toThrow();
    });

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('deleteQowtElement');
    });

    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
      ];

      CommandUtils.expectInvalidConstructionContextsToThrow(
          QowCmd, invalidContexts);
    });
  });
});
