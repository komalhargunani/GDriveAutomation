define([
  'qowtRoot/commands/domMutations/insertBBD'
], function(NewBBDCmd) {

  'use strict';

  describe('commands/domMutations/insertBBD.js', function() {
    var cmd = NewBBDCmd.create({
      loc: './TestImage.jpg',
      data: new ArrayBuffer()
    });


    it('should not be an optimistic command', function() {
      assert.isFalse(cmd.isOptimistic());
    });


    it('should call the service', function() {
      assert.isTrue(cmd.callsService());
    });


    it('should create a correctly named command', function() {
      assert.strictEqual(cmd.name, 'insertBBD');
    });


    it('should generate a dcpData packet with the correct opcode name',
        function() {
          assert.strictEqual(cmd.dcpData().name, 'insertBBD');
        });


    it('should check for missing crucial contextual information', function() {
      assert.throw(function() {
        NewBBDCmd.create();
      });

      assert.doesNotThrow(function() {
        NewBBDCmd.create({
          loc: './TestImage.jpg'
        });
      });
    });
  });
});
