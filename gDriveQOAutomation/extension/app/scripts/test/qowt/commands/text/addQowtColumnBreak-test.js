define([
  'qowtRoot/commands/text/addQowtColumnBreak',
  'test/qowt/commands/commandTestUtils'
], function(
    AddQowtColumnBreak,
    CommandUtils) {

  'use strict';

  describe('addQowtColumnBreak Command', function() {

    var context_, command_;

    beforeEach(function() {
      context_ = {
        nodeId: 2,
        parentId: 1
      };
      command_ = AddQowtColumnBreak.create(context_);
    });

    afterEach(function() {
      context_ = undefined;
      command_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(command_.name, 'addQowtColumnBreak', 'Command name');
      });
    });

    describe('create:', function() {
      it('should not throw during correct creation', function() {
        assert.doesNotThrow(function() {
          AddQowtColumnBreak.create(context_);
        }, Error, 'should not throw error during creation');
      });


      it('should check for missing crucial contextual information', function() {
        var invalidContexts = [
          {
            // Missing all args
            context: undefined,
            errorMsg: 'addQowtColumnBreak missing context'
          },
          {
            // Missing parent Id
            context: {nodeId: 2},
            errorMsg: 'addQowtColumnBreak missing parentId'
          },
          {
            // Missing node Id
            context: {parentId: 1},
            errorMsg: 'addQowtColumnBreak missing nodeId'
          }
        ];

        CommandUtils.expectInvalidConstructionContextsToThrow(
            AddQowtColumnBreak, invalidContexts);
      });
    });

  });
});
