define([
  'qowtRoot/presentation/slideCloneManager'
], function(
    SlideCloneManager) {

  'use strict';

  describe('slideCloneManager tests', function() {

    var _thumbNode, _slideNode;

    beforeEach(function() {
      _thumbNode = document.createElement('div');
      _slideNode = document.createElement('div');
    });

    afterEach(function() {
      _thumbNode = undefined;
      _slideNode = undefined;
    });

    it('should clone SmartArtJSON data', function() {
      var smartArtGraphicFrameNode = document.createElement('div');
      smartArtGraphicFrameNode.id = '112';
      smartArtGraphicFrameNode.classList.add('smart-art');
      _slideNode.appendChild(smartArtGraphicFrameNode);

      var thumbSmartArtGraphicFrameNode = document.createElement('div');
      thumbSmartArtGraphicFrameNode.shapeJson = {
        eid: '112'
      };
      thumbSmartArtGraphicFrameNode.id = '112';
      _thumbNode.appendChild(thumbSmartArtGraphicFrameNode);

      var oleObjectGraphicFrameNode = document.createElement('div');
      oleObjectGraphicFrameNode.id = '113';
      oleObjectGraphicFrameNode.classList.add('oleObject');
      _slideNode.appendChild(oleObjectGraphicFrameNode);

      var thumbOleObjectGraphicFrameNode = document.createElement('div');
      thumbOleObjectGraphicFrameNode.shapeJson = {
        eid: '113'
      };
      thumbOleObjectGraphicFrameNode.id = '113';
      _thumbNode.appendChild(thumbOleObjectGraphicFrameNode);

      sinon.stub(_thumbNode, 'querySelector');
      _thumbNode.querySelector.withArgs('[id="112"]').returns(
          thumbSmartArtGraphicFrameNode);
      _thumbNode.querySelector.withArgs('[id="113"]').returns(
          thumbOleObjectGraphicFrameNode);

      SlideCloneManager.cloneSmartArtJSON(_thumbNode, _slideNode);

      assert.isDefined(smartArtGraphicFrameNode.shapeJson);
      assert.deepEqual(smartArtGraphicFrameNode.shapeJson,
          thumbSmartArtGraphicFrameNode.shapeJson);
      assert.deepEqual(thumbOleObjectGraphicFrameNode.shapeJson,
          oleObjectGraphicFrameNode.shapeJson);
      _thumbNode.querySelector.restore();
    });
  });
});
