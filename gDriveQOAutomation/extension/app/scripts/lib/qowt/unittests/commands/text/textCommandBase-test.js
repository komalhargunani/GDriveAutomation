
// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit test for the textCommandBase module.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/commands/commandBase',
  'qowtRoot/commands/text/textCommandBase',
  'qowtRoot/unittests/commands/text/textCommandStandardAsserts'
], function(
    CommandBase,
    TextCmdBase,
    TextCommandStandardAsserts) {

  'use strict';

  describe('commands/text/textCommandBase.js', function() {
    var command = TextCmdBase.create();

    TextCommandStandardAsserts.assertUsing(command);

    it('should be a command', function() {
      expect(CommandBase.isCommand(command));
    });

    it('should create a correctly named command.', function() {
      expect(command.name).toBe('txtCmdBase');
    });

    it('should use a command name if passed one on construction', function() {
      var myName = 'customCommandName';
      var command = TextCmdBase.create(myName);
      expect(command.name).toBe(myName);
    });

    it('should implement the changeHtml function to throw', function() {
      expect(command.changeHtml).toBeDefined();
      expect(command.changeHtml).toThrow();
    });
  });

});
