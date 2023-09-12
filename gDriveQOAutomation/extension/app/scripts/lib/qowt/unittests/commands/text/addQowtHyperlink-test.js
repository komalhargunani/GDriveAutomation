// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview Unit test for the addQowtHyperlink command.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
  'qowtRoot/commands/text/addQowtHyperlink',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    AddQowtHyperlinkCmd,
    CommandUtils,
    TextCommandStandardAsserts) {

  'use strict';

  describe('Add QOWT Hyperlink', function() {
    var context = {
      nodeId: 'E78',
      parentId: 'E84',
      target: 'http://www.tfl.gov.uk'
    };
    var command = AddQowtHyperlinkCmd.create(context);

    TextCommandStandardAsserts.assertUsing(command);

    it('should not throw during correct creation', function() {
      expect(function() {
        AddQowtHyperlinkCmd.create(context);
      }).not.toThrow();
    });

    it('should not throw when target is empty', function() {
      var missingTargetContext = {
        nodeId: 'E78',
        parentId: 'E84'
      };
      expect(function() {
        AddQowtHyperlinkCmd.create(missingTargetContext);
      }).not.toThrow();
    });

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('addQowtHyperlink');
    });

    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
        undefined,
        {
          /* Missing all args */
        },
        { // Missing nodeId
          target: 'http://www.tfl.gov.uk',
          parentId: 'E84'
        },
        { // Missing parentId
          nodeId: 'E78',
          target: 'http://www.tfl.gov.uk'
        }
      ];

      CommandUtils.expectInvalidConstructionContextsToThrow(
          AddQowtHyperlinkCmd, invalidContexts);
    });
  });
});
