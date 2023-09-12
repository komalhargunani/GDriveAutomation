define([
  'qowtRoot/commands/quicksheet/setCellStrikethroughOptimistically'
], function(
    SetCellStrikethroughOptimistically) {

  'use strict';

  describe('SetCellStrikethroughOptimistically command', function() {

    describe('creation', function() {
      it('constructor should create a command successfully', function() {
        var strikethrough = true;
        var cmd = SetCellStrikethroughOptimistically.create(strikethrough);

        assert.isDefined(cmd, 'SetCellStrikethroughOptimistically commmand ' +
            'should be defined');
        assert.strictEqual(cmd.name, 'SetCellStrikethroughOptimistically');
        assert.isDefined(cmd.id(), 'ID for SetCellStrikethroughOptimistically' +
            ' command should be defined');

        assert.isTrue(cmd.isOptimistic(), 'SetCellStrikethroughOptimistically' +
            ' should be an optimistic command');
        assert.isFalse(cmd.callsService(),
            'SetCellStrikethroughOptimistically command should not be able to' +
            ' call the services');
        assert.isDefined(cmd.doOptimistic, 'doOptimistic function for ' +
            'SetCellStrikethroughOptimistically command should be defined');
      });
    });
  });
});
