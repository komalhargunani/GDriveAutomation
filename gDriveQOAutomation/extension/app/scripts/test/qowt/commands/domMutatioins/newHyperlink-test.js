define([
  'qowtRoot/commands/domMutations/newHyperlink'
], function(NewHyperlinkCmd) {

  'use strict';

  describe('Word; "newHyperlink" Command.', function() {
    var cmd_;
    beforeEach(function() {
      cmd_ = NewHyperlinkCmd.create({
        nodeId: 'id1',
        parentId: 'id2',
        siblingId: 'id3'
      });
    });

    afterEach(function() {
      cmd_ = undefined;
    });

    describe('name:', function() {
      it('Should have the expected name.', function() {
        assert.equal(cmd_.name, 'newHyperlink', 'Command name');
      });
    });

    describe('isOptimistic:', function() {
      it('Should provide isOptimistic', function() {
        assert.isTrue(cmd_.isOptimistic(), 'newHyperlink.isOptimistic()');
      });
    });

    describe('callsService:', function() {
      it('Should provide callsService', function() {
        assert.isTrue(cmd_.callsService(), 'newHyperlink.callsService()');
      });
    });

    describe('dcpData:', function() {
      it('Should override dcpData', function() {
        assert.isFunction(cmd_.dcpData, 'newHyperlink.dcpData()');
      });

      it('Should return the payload', function() {
        var expectedPayload = {
          'name': 'newHyperlink',
          'nodeId': 'id1',
          'parentId': 'id2',
          'siblingId': 'id3',
          'target': ''
        };
        var payload = cmd_.dcpData();
        assert.deepEqual(payload, expectedPayload, 'correct payload');
      });
    });
  });

});
