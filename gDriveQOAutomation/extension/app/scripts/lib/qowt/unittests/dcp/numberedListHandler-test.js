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
 * To be able to run this test suite, please make sure to include
 * fixtures/tableDCP.js for the actual fake DCP table elements used by this test
 * suite.
 * The data is kept in a separate file so that this is easier to read and so
 * that the same data can be used for the table, rowGroup, colGroup, row, and
 * cell test suites
 */

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/fixtures/numberedListFixture',
  'qowtRoot/fixtures/dodgyElementFixture',
  'qowtRoot/dcp/numberedListHandler'
], function(
    UnittestUtils,
    NumberedListFixture,
    FoobarFixture,
    NumberedListHandler) {

  'use strict';


  describe('Numbered List NumberedList', function() {

    var rootNode, returnValue;
    var visitableFoobarEl, visitableEl;
    var _nextEl, _checkSimpleNode;
    var _testAppendArea;

    beforeEach(function() {
      rootNode = document.createElement('DIV');

      _testAppendArea = UnittestUtils.createTestAppendArea();
      _testAppendArea.appendChild(rootNode);

      visitableFoobarEl = {
        el: FoobarFixture.foobarElement(),
        node: rootNode,
        accept: function() {}
      };
      visitableEl = {
        el: NumberedListFixture.listElement(),
        node: rootNode,
        accept: function() {}
      };
    });

    afterEach(function() {
      if (_checkSimpleNode) {
        expect(returnValue).toBeDefined();
        expect(visitableEl.node.childNodes.length).toEqual(1);
        expect(_nextEl.nodeName).toBe('OL');
        expect(_nextEl.textContent.length > 0).toBeTruthy();
      }
      _testAppendArea.clear();
      _testAppendArea = undefined;
      rootNode = undefined;
    });

    it('should ignore any DCP element that is not a numbered list', function() {
      _checkSimpleNode = false;
      returnValue = NumberedListHandler.visit(visitableFoobarEl);
      expect(returnValue).toBe(undefined);
      expect(visitableFoobarEl.node.childNodes.length).toBe(0);
    });

    it('should ignore any DCP element that does not have an ID set.',
        function() {
          _checkSimpleNode = false;
          visitableEl.el.eid = undefined;
          returnValue = NumberedListHandler.visit(visitableEl);
          expect(returnValue).toBe(undefined);
          expect(visitableFoobarEl.node.childNodes.length).toBe(0);
        });

    it('should create a default numbered list html element without styling ' +
        'for the most simple numbered list DCP element', function() {
          returnValue = NumberedListHandler.visit(visitableEl);
          _nextEl = visitableEl.node.childNodes[0];
          // the afterEach routine performs this basic test.
        });

  });
});
