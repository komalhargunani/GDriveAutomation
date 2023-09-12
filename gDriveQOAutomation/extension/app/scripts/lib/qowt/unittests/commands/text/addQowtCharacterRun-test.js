
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the addQowtCharacterRun command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */
define([
  'qowtRoot/commands/text/addQowtCharacterRun',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    AddQowtCharacterRunCmd,
    CommandUtils,
    TextCommandStandardAsserts) {

  'use strict';

  describe('commands/text/addQowtCharacterRun-test.js', function() {
    var context = {
      node: {},
      nodeId: 'E1',
      parentId: 'E2'
    };
    var command = AddQowtCharacterRunCmd.create(context);

    TextCommandStandardAsserts.assertUsing(command);

    it('should not throw during correct creation', function() {
      expect(function() {
        AddQowtCharacterRunCmd.create(context);
      }).not.toThrow();
    });

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('addQowtCharacterRun');
    });

    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
        {
          /* Missing all args*/},
        {// Missing nodeId
          parentId: '1'},
        {// Missing parentId
          nodeId: '1'}
      ];

      CommandUtils.expectInvalidConstructionContextsToThrow(
          AddQowtCharacterRunCmd, invalidContexts);
    });
  });
});
