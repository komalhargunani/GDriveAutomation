define([
  'test/qowt/commands/commandTestUtils',
  'qowtRoot/commands/drawing/deleteQowtBBD'
], function(
    CommandTestUtils,
    DeleteQowtBBDCmd) {

  'use strict';

  describe('deleteQowtBBD command creation', function() {

    var context = {
      loc: 'location of image'
    };
    var deleteBBDCmd = DeleteQowtBBDCmd.create(context);

    it('should be optimistic', function() {
      CommandTestUtils.expectIsOptimistic(deleteBBDCmd, true);
    });


    it('should not call the core', function() {
      CommandTestUtils.expectCallsService(deleteBBDCmd, false);
    });


    it('should not be able to invert', function() {
      CommandTestUtils.expectCanInvert(deleteBBDCmd, false);
    });


    it('should implement a changeHtml function', function() {
      assert.isDefined(deleteBBDCmd.changeHtml);
      assert.isFunction(deleteBBDCmd.changeHtml);
    });


    it('should not throw error during creation when correct input parameters ' +
        'are passed', function() {
          assert.doesNotThrow(function() {
            DeleteQowtBBDCmd.create(context);
          }, Error, 'should not throw error during creation');
        });


    it('should create a correctly named command.', function() {
      assert.strictEqual(deleteBBDCmd.name, 'deleteQowtBBD',
          'Command name should be as expected');
    });


    it('should check for missing crucial contextual information', function() {
      var invalidContexts = [
        {
          // Missing loc
        },
      ];

      CommandTestUtils.expectInvalidConstructionContextsToThrow(
          DeleteQowtBBDCmd, invalidContexts);
    });
  });
});
