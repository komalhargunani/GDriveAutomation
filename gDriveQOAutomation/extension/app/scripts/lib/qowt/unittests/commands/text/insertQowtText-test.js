
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the insertQowtText command.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/text/insertQowtText',
  'qowtRoot/unittests/commands/commandTestUtils',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    InsertQowtTextCmd,
    CommandUtils,
    TextCommandStandardAsserts) {

  'use strict';

  describe('commands/text/insertQowtText.js', function() {
    var context = {
      spanId: '1',
      offset: 1,
      text: 'hello'
    };
    var command = InsertQowtTextCmd.create(context);

    TextCommandStandardAsserts.assertUsing(command);

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('insertQowtText');
    });

    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
        {
          /* Missing all args*/
        },
        {
          // Missing spanId
          offset: 1,
          text: 'hello'
        },
        {
          // Missing offset
          spanId: '1',
          text: 'hello'
        },
        {
          // Missing text
          spanId: '1',
          offset: 1
        }
      ];

      CommandUtils.expectInvalidConstructionContextsToThrow(
          InsertQowtTextCmd, invalidContexts);
    });
  });
});
