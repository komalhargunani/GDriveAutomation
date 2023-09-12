define([
  'qowtRoot/commands/commandManager',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/contentMgrs/textContentMgr'], function(
  CommandManager,
  PubSub,
  TextContentManager) {

  'use strict';

  describe('Text Content Manager', function() {

    beforeEach(function() {
      sinon.stub(CommandManager, 'addCommand');
    });
    afterEach(function() {
      CommandManager.addCommand.restore();
    });

    TextContentManager.supportedActions.forEach(function(action) {
      describe('qowt:doAction ' + action, function() {
        it('Should create and add a ' + action + ' command', function() {
          PubSub.publish('qowt:doAction', {
            context: {
              contentType: TextContentManager.contentType
            },
            action: action
          }).then(function() {
            assert.strictEqual(
              CommandManager.addCommand.args[0][0].name, action,
              action + ' command created and added');
          });
        });
      });
    });

  });
});
