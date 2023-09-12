/**
 * @fileoverview unit test-cases for slideCloneManager
 *
 * @author devesh.chanchlani@quickoffice.com (Devesh Chanchlani)
 */
define([
  'qowtRoot/unittests/__unittest-util',
  'qowtRoot/presentation/slideCloneManager',
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/decorators/hyperlinkDecorator'
], function(
    UnittestUtils,
    SlideCloneManager,
    DeprecatedUtils,
    HyperlinkDecorator) {

  'use strict';

  describe('slideCloneManager tests', function() {

    var _thumbNode, _slideNode;
    var _testAppendArea = UnittestUtils.createTestAppendArea();

    var _hyperlinkDecorator = {
      decorate: function() {
      },
      withLinkForShape: function() {
      },
      withLinkForText: function() {
      }
    };

    beforeEach(function() {
      _thumbNode = document.createElement('div');
      var tmp = document.createElement('div');
      _thumbNode.appendChild(tmp);
      tmp = document.createElement('div');
      _thumbNode.appendChild(tmp);
      tmp = document.createElement('div');
      _thumbNode.appendChild(tmp);

      _slideNode = document.createElement('div');

      _testAppendArea.appendChild(_thumbNode);
      _testAppendArea.appendChild(_slideNode);

      spyOn(_hyperlinkDecorator, 'decorate').andReturn(_hyperlinkDecorator);
      spyOn(_hyperlinkDecorator, 'withLinkForShape').andReturn(
          _hyperlinkDecorator);
      spyOn(_hyperlinkDecorator, 'withLinkForText').andReturn(
          _hyperlinkDecorator);
      spyOn(HyperlinkDecorator, 'create').andReturn(_hyperlinkDecorator);
    });

    afterEach(function() {
      UnittestUtils.flushTestAppendArea();
    });

    it('should clone child nodes', function() {
      _thumbNode.childNodes[0].className = 'qowt-point-index';

      spyOn(DeprecatedUtils, 'cloneAndAttach');

      SlideCloneManager.cloneChildNodes(_thumbNode, _slideNode);

      expect(DeprecatedUtils.cloneAndAttach.callCount).toEqual(2);
      expect(DeprecatedUtils.cloneAndAttach.calls[0].args).toEqual(
          [_thumbNode.childNodes[1], _slideNode, undefined]);
      expect(DeprecatedUtils.cloneAndAttach.calls[1].args).toEqual(
          [_thumbNode.childNodes[2], _slideNode, undefined]);
    });

    it('should update the map on -mapClonedCanvas-', function() {
      var tmp0 = document.createElement('canvas');
      tmp0.id = 'canvas1';
      _slideNode.appendChild(tmp0);

      var tmp1 = document.createElement('canvas');
      tmp1.id = 'canvas2';
      _slideNode.appendChild(tmp1);

      var tmp2 = document.createElement('div');
      tmp2.id = 'slideBack0';
      tmp2.className = 'slideBackground';
      _slideNode.appendChild(tmp2);

      var map = {};
      SlideCloneManager.mapClonedCanvas(_slideNode, map);

      var expectedMap = {
        'canvas1': tmp0,
        'canvas2': tmp1
      };
      expect(map).toEqual(expectedMap);
    });

    it('should update the map on -mapClonedShapeFills-', function() {
      var tmp0 = document.createElement('div');
      tmp0.id = '1-shapeFill';
      _slideNode.appendChild(tmp0);

      var tmp1 = document.createElement('div');
      tmp1.id = '2-shapeFill';
      _slideNode.appendChild(tmp1);

      var tmp2 = document.createElement('div');
      tmp2.id = 'slideBack0';
      tmp2.className = 'slideBackground';
      _slideNode.appendChild(tmp2);

      var tmp3 = document.createElement('canvas');
      tmp3.id = 'canvas1';
      _slideNode.appendChild(tmp3);

      var map = {};
      SlideCloneManager.mapClonedShapeFills(_slideNode, map);

      var expectedMap = {
        '1-shapeFill': tmp0,
        '2-shapeFill': tmp1,
        'slideBack0': tmp2
      };
      expect(map).toEqual(expectedMap);
    });

    it('should handle text with hyperlink', function() {
      var tmp0 = document.createElement('div');
      tmp0.setAttribute('qowt-marker', 'textHyperlink');
      _slideNode.appendChild(tmp0);

      var tmp1 = document.createElement('div');
      tmp1.setAttribute('qowt-marker', 'hyperlink');
      _slideNode.appendChild(tmp1);

      var tmp2 = document.createElement('div');
      tmp2.setAttribute('qowt-marker', 'textHyperlink');
      _slideNode.appendChild(tmp2);

      SlideCloneManager.handleTextWithHyperlink(_slideNode);

      expect(_hyperlinkDecorator.decorate.callCount).toEqual(2);
      expect(_hyperlinkDecorator.withLinkForText.callCount).toEqual(2);
      expect(_hyperlinkDecorator.decorate.calls[0].args).toEqual([tmp0]);
      expect(_hyperlinkDecorator.decorate.calls[1].args).toEqual([tmp2]);
    });

    it('should handle shapes with hyperlink', function() {
      var tmp0 = document.createElement('div');
      tmp0.setAttribute('qowt-marker', 'hyperlink');
      _slideNode.appendChild(tmp0);

      var tmp1 = document.createElement('div');
      tmp1.setAttribute('qowt-marker', 'textHyperlink');
      _slideNode.appendChild(tmp1);

      var tmp2 = document.createElement('div');
      tmp2.setAttribute('qowt-marker', 'hyperlink');
      _slideNode.appendChild(tmp2);

      SlideCloneManager.handleShapesWithHyperlink(_slideNode);

      expect(_hyperlinkDecorator.decorate.callCount).toEqual(2);
      expect(_hyperlinkDecorator.withLinkForShape.callCount).toEqual(2);
      expect(_hyperlinkDecorator.decorate.calls[0].args).toEqual([tmp0]);
      expect(_hyperlinkDecorator.decorate.calls[1].args).toEqual([tmp2]);
    });
  });
});
