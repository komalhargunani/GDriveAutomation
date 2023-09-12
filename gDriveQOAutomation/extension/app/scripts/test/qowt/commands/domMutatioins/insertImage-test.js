define([
  'qowtRoot/commands/domMutations/insertImage'
], function(InsertImageCmd) {

  'use strict';

  describe('commands/domMutations/inserImage.js', function() {
    var cmd = InsertImageCmd.create({
      nodeId: 'E-2',
      parentId: 'E-1',
      src: './TestImage.jpg',
      frmt: 'jpg'
    });


    it('should not be an optimistic command', function() {
      assert.isFalse(cmd.isOptimistic());
    });


    it('should call the service', function() {
      assert.isTrue(cmd.callsService());
    });


    it('should create a correctly named command', function() {
      assert.strictEqual(cmd.name, 'insertImage');
    });


    it('should generate a dcpData packet with the correct opcode name',
        function() {
          assert.strictEqual(cmd.dcpData().name, 'insertImage');
        });


    it('should check for missing crucial contextual information', function() {
      assert.throw(function() {
        InsertImageCmd.create();
      });

      assert.throw(function() {
        InsertImageCmd.create({
          nodeId: 'E-2'
        });
      });

      assert.throw(function() {
        InsertImageCmd.create({
          nodeId: 'E12',
          parentId: 'E10'
        });
      });

      assert.throw(function() {
        InsertImageCmd.create({
          nodeId: 'E12',
          parentId: 'E10',
          src: './TestImage.jpg'
        });
      });

      assert.doesNotThrow(function() {
        InsertImageCmd.create({
          nodeId: 'E12',
          parentId: 'E10',
          src: './TestImage.jpg',
          frmt: 'jpg'
        });
      });
    });
  });
});
