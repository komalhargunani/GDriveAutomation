/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */


/**
 * JsDoc description
 */
define([
  'qowtRoot/dcp/wordHandlers/table',
  'qowtRoot/models/dcp',
  'qowtRoot/fixtures/dodgyElementFixture'
], function(TableHandler, DcpModel, FixDodgy) {

  'use strict';

  describe('dcp word table handler', function() {

    var visitableFoobarEl, rootNode;

    beforeEach(function() {
      rootNode = document.createElement('DIV');
      visitableFoobarEl = {
        el: FixDodgy.foobarElement(),
        node: rootNode,
        accept: function() {}
      };
      // the dcpTables entry in the model should only be used during the
      // processing of dcp, and should be removed after that process. So
      // check that it is underfined before and after the test
      expect(DcpModel.dcpTables).toBe(undefined);
    });


    afterEach(function() {
      // the dcpTables entry in the model should only be used during the
      // processing of dcp, and should be removed after that process. So
      // check that it is underfined before and after the test
      expect(DcpModel.dcpTables).toBe(undefined);
    });


    it('should ignore non table dcp elements', function() {
      TableHandler.visit(visitableFoobarEl);
      expect(DcpModel.dcpTables).toBe(undefined);
    });

    // TODO: WRITE ME!
    it('should store the table id of the current table in the model',
        function() {
          expect(true).toBe(true);
        }
    );

    // TODO: WRITE ME!
    it("should store the id's of nested tables in the model", function() {
      expect(true).toBe(true);
    });

  });

  return {};
});
