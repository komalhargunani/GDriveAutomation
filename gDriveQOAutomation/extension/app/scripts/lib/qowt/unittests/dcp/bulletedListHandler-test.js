define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/dcp/bulletedListHandler',
  'qowtRoot/fixtures/dodgyElementFixture',
  'qowtRoot/fixtures/bulletedListFixture',
  'qowtRoot/models/word',
  'qowtRoot/dcp/dcpManager'], function(
  TestUtils,
  BulletedListHandler,
  FixDodgy,
  BulletedListFixture,
  WordModel
  /* DcpManager */) {

  'use strict';

  describe('Bulleted List handler', function() {

    var rootNode, handler, returnValue;
    var visitableFoobarEl, visitableEl;
    var _nextEl, _checkSimpleNode;
    var _testAppendArea;

    beforeEach(function() {
      rootNode = document.createElement('DIV');
      _testAppendArea = TestUtils.createTestAppendArea();
      _testAppendArea.appendChild(rootNode);
      handler = BulletedListHandler;
      visitableFoobarEl = {
        el: FixDodgy.foobarElement(),
        node: rootNode,
        accept: function() {}
      };
      visitableEl = {
        el: BulletedListFixture.bulletedListElement(),
        node: rootNode,
        accept: function() {}
      };
      handler = BulletedListHandler;
    });

    afterEach(function() {
      if (_checkSimpleNode) {
        expect(returnValue).toBeDefined();
        expect(visitableEl.node.childNodes.length).toEqual(1);
        expect(_nextEl.nodeName).toBe('UL');
        expect(_nextEl.textContent.length > 0).toBeTruthy();
      }
      _testAppendArea.clear();
      _testAppendArea = undefined;
      rootNode = undefined;
    });

    it('should ignore any DCP element that is not a bulleted list', function() {
      _checkSimpleNode = false;
      returnValue = handler.visit(visitableFoobarEl);
      expect(returnValue).toBe(undefined);
      expect(visitableFoobarEl.node.childNodes.length).toBe(0);
    });

    it('should ignore any DCP element that does not have an ID set.',
        function() {
          _checkSimpleNode = false;
          visitableEl.el.eid = undefined;
          returnValue = handler.visit(visitableEl);
          expect(returnValue).toBe(undefined);
          expect(visitableFoobarEl.node.childNodes.length).toBe(0);
        });

    it('should create a default bulleted list html element without styling ' +
        'for the most simple bulleted list DCP element', function() {
          returnValue = handler.visit(visitableEl);
          _nextEl = visitableEl.node.childNodes[0];
          // the afterEach routine performs this basic test.
        });

    it('should create a style list html element for each of the supported ' +
        'list style types', function() {
          // circle
          visitableEl.el.setStyles({
            'lst': 'circle'
          });
          returnValue = handler.visit(visitableEl);
          //TODO: Service does not return list style type for bullet list, so
          // handler uses defaults for now.
          expect(WordModel.bulletListTypeLevels[0]).toBe('disc');
          rootNode.clear();
          // square
          visitableEl.el.setStyles({
            'lst': 'square'
          });
          returnValue = handler.visit(visitableEl);
          //TODO: Service does not return list style type for bullet list, so
          // handler uses defaults for now.
          expect(WordModel.bulletListTypeLevels[0]).toBe('disc');
          rootNode.clear();
          // disc
          // This is the default setting for a bulleted list and is not
          // explicitly set none
          visitableEl.el.setStyles({
            'lst': 'none'
          });
          returnValue = handler.visit(visitableEl);
          //TODO: Service does not return list style type for bullet list, so
          // handler uses defaults for now.
          expect(WordModel.bulletListTypeLevels[0]).toBe('disc');
          rootNode.clear();
        });

  });
});
