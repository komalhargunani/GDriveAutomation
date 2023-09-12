define([
  'qowtRoot/dcp/dcpManager'], function(
    DcpManager) {

  'use strict';


  describe('QOWT/dcp/sectionHandler.js', function() {

    var rootNode;
    var sv;
    var visitableEl;
    var wrongType;
    var noType;

    beforeEach(function() {

      wrongType = {
        etp: 'foobar',
        eid: '42',
        data: 'scumbag'
      };
      noType = {
        eid: 42,
        data: 'scumbag'
      };

      rootNode = document.createElement('DIV');

      visitableEl = {
        node: rootNode,
        accept: function() {}
      };

      sv = DcpManager.handlers.sct;
    });

    afterEach(function() {
      rootNode = undefined;
    });

    it('should ignore any response element that is not a section', function() {
      visitableEl.el = wrongType;

      var returnValue = sv.visit(visitableEl);
      expect(returnValue).toBe(undefined);
      expect(visitableEl.node.childNodes.length).toBe(0);
    });

    it('should ignore any response element that has no element type at all',
        function() {
          visitableEl.el = noType;
          var returnValue = sv.visit(visitableEl);
          expect(returnValue).toBe(undefined);
          expect(visitableEl.node.childNodes.length).toBe(0);
        });

  });
});
