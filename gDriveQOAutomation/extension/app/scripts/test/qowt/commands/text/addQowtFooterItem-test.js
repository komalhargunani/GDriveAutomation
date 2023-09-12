define([
  'test/qowt/commands/commandTestUtils',
  'qowtRoot/commands/text/addQowtFooterItem'
], function(
    CommandTestUtils,
    AddQowtFooterItemCmd) {

  'use strict';

  describe('addQowtFooterItem command creation', function() {

    var context = {
      node: {},
      nodeId: 'E1',
      parentId: 'E2'
    };
    var textCommand = AddQowtFooterItemCmd.create(context);

    it('should be optimistic', function() {
      CommandTestUtils.expectIsOptimistic(textCommand, true);
    });

    it('should not call the core', function() {
      CommandTestUtils.expectCallsService(textCommand, false);
    });

    it('should not be able to invert', function() {
      CommandTestUtils.expectCanInvert(textCommand, false);
    });

    it('should implement a changeHtml function', function() {
      assert.isDefined(textCommand.changeHtml);
      assert.isFunction(textCommand.changeHtml);
    });

    it('should not throw error during creation when correct input parameters ' +
        'are passed', function() {
      assert.doesNotThrow(function() {
        AddQowtFooterItemCmd.create(context);
      }, Error, 'should not throw error during creation');
    });

    it('should create a correctly named command.', function() {
      assert.strictEqual(textCommand.name, 'addQowtFooterItem',
          'Command name should be as expected');
    });

    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
        {
          // Missing all args
        },
        {// Missing nodeId
          parentId: '1'
        },
        {// Missing parentId
          nodeId: '1'
        }
      ];

      CommandTestUtils.expectInvalidConstructionContextsToThrow(
          AddQowtFooterItemCmd, invalidContexts);
    });
  });
});
