// Copyright 2014 Google Inc. All Rights Reserved.
/**
 * @fileoverview Unit test for the addQowtImage command.
 *
 * @author chehayeb@google.com (Anibal Chehayeb)
 */
define([
  'qowtRoot/commands/drawing/addQowtImage',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    AddQowtImageCmd,
    CommandUtils,
    TextCommandStandardAsserts) {

  'use strict';

  describe('commands/drawing/addQowtImage-test.js', function() {
    var context = {
      nodeId: 'E78',
      parentId: 'E84',
      src: 'url to image source'
    };
    var command = AddQowtImageCmd.create(context);

    TextCommandStandardAsserts.assertUsing(command);

    it('should not throw during correct creation', function() {
      expect(function() {
        AddQowtImageCmd.create(context);
      }).not.toThrow();
    });

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('addQowtImage');
    });

    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
        {
          /* Missing all args */
        },
        {  // Missing nodeId
          parentId: 'E84',
          src: 'url to image source'
        },
        {  // Missing parentId
          nodeId: 'E78',
          src: 'url to image source'
        },
        {  // Missing src
          nodeId: 'E78',
          parentId: 'E84'
        }
      ];

      CommandUtils.expectInvalidConstructionContextsToThrow(
          AddQowtImageCmd, invalidContexts);
    });
  });
});
