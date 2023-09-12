/*!
 * Copyright Quickoffice, Inc, 2005-2012
 *
 * NOTICE:   The intellectual and technical concepts contained
 * herein are proprietary to Quickoffice, Inc. and is protected by
 * trade secret and copyright law. Dissemination of any of this
 * information or reproduction of this material is strictly forbidden
 * unless prior written permission is obtained from Quickoffice, Inc.
 */

define([
  'qowtRoot/dcp/charRunHandler',
  'qowtRoot/fixtures/_all'
], function(
    CharRunHandler,
  FIXTURES) {

  'use strict';

  describe('QOWT/dcp/charRunHandler.js', function() {

    var rootNode, handler, returnValue;
    var visitableFoobarEl, visitableEl;
    var _nextCharRun;

    beforeEach(function() {
      rootNode = document.createElement('DIV');
      handler = CharRunHandler;
      visitableFoobarEl = {
        el: FIXTURES.foobarElement(),
        node: rootNode,
        accept: function() {}
      };
      visitableEl = {
        el: FIXTURES.nestedCharRun(20),
        node: rootNode,
        accept: function() {}
      };

    });


    it('should ignore any DCP element that is not a nested character run',
        function() {
          returnValue = handler.visit(visitableFoobarEl);
          expect(returnValue).toBe(undefined);
          expect(visitableFoobarEl.node.childNodes.length).toBe(0);
        });


    it('should ignore any DCP element that does not have an ID set.',
        function() {
          visitableEl.el.eid = undefined;
          returnValue = handler.visit(visitableEl);
          expect(returnValue).toBe(undefined);
        expect(visitableEl.node.childNodes.length).toBe(0);
        });


    it('should create a QowtWordRun element', function() {
          returnValue = handler.visit(visitableEl);
          _nextCharRun = visitableEl.node.childNodes[0];

      expect(returnValue).toBeDefined();
      expect(visitableEl.node.childNodes.length).toEqual(1);
      expect(_nextCharRun instanceof QowtWordRun).toBe(true);
      expect(_nextCharRun.textContent.length > 0).toBeTruthy();
        });

  });

});
