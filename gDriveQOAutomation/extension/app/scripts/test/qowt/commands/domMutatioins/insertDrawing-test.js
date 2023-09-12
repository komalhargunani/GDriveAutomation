define([
  'qowtRoot/commands/domMutations/insertDrawing'
], function(InsertDrawingCmd) {

  'use strict';

  describe('commands/domMutations/insertDrawing.js', function() {
    var cmd = InsertDrawingCmd.create({
      nodeId: 'E-2',
      parentId: 'E-1'
    });


    it('should not be an optimistic command', function() {
      assert.isFalse(cmd.isOptimistic());
    });


    it('should call the service', function() {
      assert.isTrue(cmd.callsService());
    });


    it('should create a correctly named command', function() {
      assert.strictEqual(cmd.name, 'insertDrawing');
    });


    it('should generate a dcpData packet with the correct opcode name',
        function() {
          assert.strictEqual(cmd.dcpData().name, 'insertDrawing');
        });


    it('should check for missing crucial contextual information', function() {
      assert.throw(function() {
        InsertDrawingCmd.create();
      });

      assert.throw(function() {
        InsertDrawingCmd.create({
          nodeId: 'E-2'
        });
      });

      assert.doesNotThrow(function() {
        InsertDrawingCmd.create({
          nodeId: 'E12',
          parentId: 'E10'
        });
      });
    });
  });
});
