define([
  'qowtRoot/commands/quickpoint/edit/editCommandBase',
  'test/qowt/commands/quickpoint/edit/editCommandStandardAsserts'
], function(EditCommandBase, EditCommandStandardAsserts) {

  'use strict';

  describe('Point: "editCommandBase" - test', function() {
    describe('create:', function() {
      it('should create a correctly named command.', function() {
        var command = EditCommandBase.create();
        EditCommandStandardAsserts.standard(command);
        assert.strictEqual(command.name, 'pointEditCmdBase', 'Command is ' +
            'created with default name - pointEditCmdBase');
      });

      it('should use a command name if passed one on construction',
          function() {
            var myName = 'customCommandName';
            var command = EditCommandBase.create(myName);
            EditCommandStandardAsserts.standard(command);
            assert.strictEqual(command.name, myName, 'Command is created with' +
                'custom name passed as paraneter');
          });

      it('should throw when optimistic and callService, both are false',
          function() {
            assert.throws(function() {
              EditCommandBase.create('someComand', false, false);
            }, undefined,
            'pointEditCmdBase: Command should either optimistic or it ' +
                'should call service', 'Error is thrown when command ' +
                'is neither optimistic nor callService');
          });

      it('should pass standard non-optimistic asserts', function() {
        var command = EditCommandBase.create('someCommand', false, true);
        EditCommandStandardAsserts.standard(command);
        EditCommandStandardAsserts.asOptimistic(command, false, false);
        EditCommandStandardAsserts.asCallsService(command, true);
      });

      it('should pass standard optimistic asserts (no callService)',
          function() {
            var command = EditCommandBase.create('someCommand', true, false);
            EditCommandStandardAsserts.standard(command);
            EditCommandStandardAsserts.asOptimistic(command, true, true);
            EditCommandStandardAsserts.asCallsService(command, false);

          });

      it('should pass standard optimistic asserts (callService)', function() {
        var command = EditCommandBase.create('someCommand', true, true);
        EditCommandStandardAsserts.standard(command);
        EditCommandStandardAsserts.asOptimistic(command, true, true);
        EditCommandStandardAsserts.asCallsService(command, true);

      });
    });

    describe('changeHtml:', function() {
      it('should implement the changeHtml function to throw', function() {
        var command = EditCommandBase.create();
        EditCommandStandardAsserts.standard(command);
        assert.isFunction(command.changeHtml, 'EditCommandBase.changeHtml()');
        assert.throws(command.changeHtml, undefined,
            'pointEditCmdBase changeHtml() is not overridden',
            'changeHtml throws not overridden error');
      });
    });

    describe('dcpData:', function() {
      it('should implement the dcpData function to throw when command ' +
          'is call service', function() {
            var command = EditCommandBase.create('someCommand', true, true);
            EditCommandStandardAsserts.standard(command);
            assert.isFunction(command.dcpData, 'EditCommandBase.dcpData()');
            assert.throws(command.dcpData, undefined,
                'pointEditCmdBase dcpData() is not overridden for a ' +
                    'command that calls service.', 'dcpData throws not' +
                    ' overridden error for a command that calls service.');
          });
    });

    describe('doRevert:', function() {
      it('should implement a doRevert function to throw when command is' +
          ' optimistic and does not call service', function() {
            var command = EditCommandBase.create('someCommand', true, false);
            EditCommandStandardAsserts.standard(command);
            EditCommandStandardAsserts.asOptimistic(command, true, true);
            assert.isFunction(command.doRevert, 'EditCommandBase.doRevert()');
            assert.throws(command.doRevert, undefined,
                'pointEditCmdBase: doRevert() is not overridden' +
                    'for optimistic command',
                'doRevert throws not overridden for optimistic command');
          }
      );
    });

  });

});

