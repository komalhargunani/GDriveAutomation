/*!
 * Copyright Quickoffice, Inc, 2005-2011
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * tests for point table row handler
 */
define([
  'qowtRoot/dcp/pointHandlers/pointTableRowHandler'
], function(PointTableRowHandler) {

  'use strict';


  describe(' test for point table row handler ', function() {
    var pointTableRowHandler = PointTableRowHandler;
    var element = {};
    var visitable = {};
    var node = {
      appendChild: function() {
      }
    };

    beforeEach(function() {
      visitable.el = element;
      visitable.node = node;
    });


    it(' should return undefined if etp is undefined', function() {
      element.etp = undefined;
      var row = pointTableRowHandler.visit(visitable);
      expect(row).toEqual(undefined);
    });

    it('should return undefined if etp is not pTbleR', function() {
      element.etp = 'xyz';
      var table = pointTableRowHandler.visit(visitable);
      expect(table).toEqual(undefined);
    });

    it(' should return HTMLTrElement if etp is  pTbleR', function() {
      element.etp = 'pTbleR';
      var row = pointTableRowHandler.visit(visitable);
      expect(row.localName).toEqual('tr');
    });

    it('should call createElement method of document with TR as parameter',
        function() {
          element.etp = 'pTbleR';
          var rowElement = {
            style: {}
          };
          spyOn(document, 'createElement').andReturn(rowElement);
          pointTableRowHandler.visit(visitable);
          expect(document.createElement).toHaveBeenCalledWith('TR');
        });

    it('should set id for row element with eid', function() {
      element.etp = 'pTbleR';
      element.eid = 111;
      var rowElement = {
        style: {}
      };
      spyOn(document, 'createElement').andReturn(rowElement);
      pointTableRowHandler.visit(visitable);
      expect(rowElement.id).toEqual(111);

    });
  });
});
