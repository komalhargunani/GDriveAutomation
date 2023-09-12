define(['qowtRoot/commands/common/downloadFile'], function(DownloadFileCmd) {

  'use strict';

  describe('The DownloadFile command', function() {
    var command_;

    beforeEach(function() {
      command_ = DownloadFileCmd.create();
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.strictEqual(command_.name, 'download', 'Command name');
      });
    });

    describe('creation', function() {
      it('should create a non-optimistic command', function() {
        assert.isFalse(command_.isOptimistic(),
            'downloadFile is a non-optimistic command');
      });

      it('should create a service-calling command', function() {
        assert.isTrue(command_.callsService(),
            'downloadFile command calls service');
      });
    });

    describe('dcpData:', function() {
      it('should override dcpData', function() {
        assert.isFunction(command_.dcpData, 'downloadFile.dcpData()');
      });

      it('should return a JSON object', function() {
        var data = command_.dcpData();
        assert.isObject(data, 'dcp data is an object');
      });

      it('should define the name property', function() {
        var data = command_.dcpData();
        assert.strictEqual(data.name, 'download', 'name values are equal');
      });
    });
  });
});
