// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Unit Tests for the docHandler DCP module.
 *
 * @author dskelton@google.com (Duncan Skelton)
 */

define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/docHandler'
], function(
  UnittestUtils,
  Doc) {

  'use strict';

  describe('document response handler', function() {

    var nonDocumentResponseElement;
    var invalidResponseElement;
    var rootNode;
    var _testAppendArea;
    var visitableEl;
    var docNode;

    beforeEach(function() {
      nonDocumentResponseElement = {
        etp: 'yeah',
        data: 'right'
      };

      invalidResponseElement = {
        data: 'right'
      };

      rootNode = document.createElement('DIV');
      docNode = document.createElement('DIV');
      docNode.id = 42;
      rootNode.appendChild(docNode);

      _testAppendArea = UnittestUtils.createTestAppendArea();
      _testAppendArea.appendChild(rootNode);

      visitableEl = {
        el: {},
        node: rootNode,
        accept: function() {}
      };

    });

    afterEach(function() {
      _testAppendArea.clear();
      _testAppendArea = undefined;
      rootNode = undefined;
    });

    it('should not handle other than document responses', function() {
      visitableEl.el = nonDocumentResponseElement;

      expect(visitableEl.node.childNodes.length).toBe(1);
      var returnValue = Doc.visit(visitableEl);
      expect(returnValue).toBe(undefined);
      expect(visitableEl.node.childNodes.length).toBe(1);
    });

    it("should not handle dcp without etp", function() {
      visitableEl.el = invalidResponseElement;

      expect(visitableEl.node.childNodes.length).toBe(1);
      var returnValue = Doc.visit(visitableEl);
      expect(returnValue).toBe(undefined);
      expect(visitableEl.node.childNodes.length).toBe(1);
    });

  });
});