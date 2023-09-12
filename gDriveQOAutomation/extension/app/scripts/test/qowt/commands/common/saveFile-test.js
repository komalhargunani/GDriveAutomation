define([
  'qowtRoot/commands/common/saveFile',
  'qowtRoot/errors/unique/outOfMemoryError'], function(
    SaveFileCmd,
    OutOfMemoryError) {

  'use strict';

  describe('Savefile Command', function() {

    describe('onFailure() method', function() {
      it('should throw OutOfMemoryError', function() {
        var cmd = SaveFileCmd.create();
        var errorPolicy = {};
        expect(function() {
          cmd.onFailure({e: 'out_of_memory'}, errorPolicy);
        }).to.throw(OutOfMemoryError);
      });
    });
  });
});
