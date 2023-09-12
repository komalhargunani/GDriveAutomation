define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/fixtures/dodgyElementFixture',
  'qowtRoot/fixtures/paragraphFixture',
  'qowtRoot/dcp/paragraphHandler',
  'qowtRoot/models/dcp'
], function(
  TestUtils,
  FoobarFixture,
  ParagraphFixture,
  ParagraphHandler,
  DCPModel) {

  'use strict';

  describe('Paragraph handler', function() {

    var _testAppendArea, rootNode, handler, returnValue;
    var visitableFoobarEl, visitableEl;

    beforeEach(function() {
      rootNode = document.createElement('DIV');
      _testAppendArea = TestUtils.createTestAppendArea();
      _testAppendArea.appendChild(rootNode);
      visitableFoobarEl = {
        el: FoobarFixture.foobarElement(),
        node: rootNode,
        accept: function() {}
      };
      visitableEl = {
        el: ParagraphFixture.paragraphElement(),
        node: rootNode,
        accept: function() {}
      };
      handler = ParagraphHandler;

      // Ensure QOWT knows that we are testing DCP version 2
      DCPModel.version = 2;
    });

    afterEach(function() {
      _testAppendArea.clear();
      _testAppendArea = undefined;
      rootNode = undefined;
    });

    it('should ignore any DCP element that is not a para', function() {
      returnValue = handler.visit(visitableFoobarEl);
      expect(returnValue).toBe(undefined);
      expect(visitableFoobarEl.node.childNodes.length).toBe(0);
    });


    it('should ignore any DCP element that does not have an ID', function() {
      visitableEl.el.eid = undefined;
      returnValue = handler.visit(visitableEl);
      expect(returnValue).toBe(undefined);
      expect(visitableEl.node.childNodes.length).toBe(0);
    });


    it('should create a QowtWordPara element in the postTraverse', function() {
      returnValue = handler.visit(visitableEl);
      handler.postTraverse(visitableEl);
      var next = visitableEl.node.childNodes[0];

      expect(returnValue).toBeDefined();
      expect(visitableEl.node.childNodes.length).toEqual(1);
      expect(next instanceof QowtWordPara).toBe(true);
    });


  });
});
