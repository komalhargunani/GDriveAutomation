
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the deleteQowtText command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/text/deleteQowtText',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    DeleteQowtTextCmd,
    CommandUtils,
    TextCommandStandardAsserts) {

  'use strict';

  describe('commands/text/deleteQowtText.js', function() {
    var context = {
      spanId: '1',
      offset: 1,
      length: 3
    };
    var command = DeleteQowtTextCmd.create(context);

    TextCommandStandardAsserts.assertUsing(command);

    it('should not throw during correct creation', function() {
      expect(function() {
        DeleteQowtTextCmd.create(context);
      }).not.toThrow();
    });

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('deleteQowtText');
    });

    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
        {
          /* Missing all args*/
        },
        {
          // Missing spanId
          offset: 1,
          length: 3
        },
        {
          // Missing offset
          spanId: '1',
          length: 3
        },
        {
          // Missing length
          spanId: '1',
          offset: 1
        }
      ];

      CommandUtils.expectInvalidConstructionContextsToThrow(
          DeleteQowtTextCmd, invalidContexts);
    });
  });
});
