/**
 * @fileoverview This file has Unit Test cases for DrawingHandler
 *
 * @author alok.guha@quickoffice.com (Alok Guha)
 */
define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/fixtures/drawingFixture',
  'qowtRoot/dcp/drawingHandler'
], function(TestUtils, drawingFixture, drawingHandler) {

  'use strict';

  describe('Drawing Handler', function() {

    var visitableEl,
        handler,
        rootNode,
        _testAppendArea,
        returnValue;

    beforeEach(function() {

      rootNode = document.createElement('DIV');
      _testAppendArea = TestUtils.createTestAppendArea();
      _testAppendArea.appendChild(rootNode);

      visitableEl = {
        el: drawingFixture.drawingElement(),
        node: rootNode,
        accept: function() {
        }
      };
      handler = drawingHandler;
    });

    afterEach(function() {
      visitableEl = undefined;
      handler = undefined;
      returnValue = undefined;

    });

    it('should ignore any DCP element that is not a drawing', function() {
      visitableEl.el.etp = 'SOMW_NON_DRW_ELEMENT';
      returnValue = handler.visit(visitableEl);
      handler.postTraverse(visitableEl);
      expect(returnValue).toBe(undefined);
    });

    it('should process DCP element which is a type drawing', function() {
      returnValue = handler.visit(visitableEl);
      expect(returnValue).not.toBe(undefined);
      expect(visitableEl.node).not.toBe('undefined');
      expect(visitableEl.node.childNodes.length).toBe(1);

    });
  });
});
