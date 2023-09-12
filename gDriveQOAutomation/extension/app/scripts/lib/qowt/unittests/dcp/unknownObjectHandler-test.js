define([
  'qowtRoot/dcp/unknownObjectHandler',
  'qowtRoot/dcp/dcpManager'
], function(
    UO,
    DcpManager) {

  'use strict';

  describe('QOWT/dcp/unknownObjectHandler.js', function() {

    it('should register itself with the DCP Manager', function() {
      expect(DcpManager.handlers.uo).toBeDefined();
    });

    it('should have an etp property of uo and return undefined for other DCP ' +
        'with any other etp', function() {
      expect(UO.etp).toBe('uo');
      expect(DcpManager.handlers.uo.etp).toBe('uo');
      var uoHandlerOutput = DcpManager.handlers.uo.visit(
          {el: [{'etp': 'not_uo'}]});
      expect(uoHandlerOutput).toBeUndefined();
    });

  });

});
