/**
 * @fileoverview contains helper methods for cloning thumbnail data into slide
 * node
 *
 * @author devesh.chanchlani@quickoffice.com (Devesh Chanchlani)
 */
define([
  'qowtRoot/utils/deprecatedUtils',
  'qowtRoot/dcp/decorators/hyperlinkDecorator'
], function(DeprecatedUtils, HyperlinkDecorator) {

  'use strict';

  var _hyperlinkDecorator;

  var _api = {

    /**
     * cloning thumbnails into slideNode
     * @param {HTML} thumbNode - thumb node
     * @param {HTML} slideNode - slide node
     */
    cloneChildNodes: function(thumbNode, slideNode) {
      var childNodes = thumbNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        // Do not copy 'index' element
        if (!childNodes[i].classList.contains("qowt-point-index")) {
          DeprecatedUtils.cloneAndAttach(childNodes[i], slideNode, undefined);
        }
      }
    },

    /**
     * Cloning shapeJson data from thumbNode to slideNode
     * @param {HTML} thumbNode - thumb node
     * @param {HTML} slideNode - slide node
     */
    cloneSmartArtJSON: function(thumbNode, slideNode) {
      var destinationNodes =
          slideNode.querySelectorAll('.smart-art, .oleObject');

      for (var i = 0; i < destinationNodes.length; i++) {
        var sourceNode =
            thumbNode.querySelector('[id="' + destinationNodes[i].id + '"]');
        if (sourceNode) {
          destinationNodes[i].shapeJson = sourceNode.shapeJson;
        }
      }
    },

    /**
     * stores the canvas nodes into model
     * @param {HTML} slideNode - slide node
     * @param {JSON} thumbnailToSlideCanvasMap - thumb-to-slide-canva map
     */
    mapClonedCanvas: function(slideNode, thumbnailToSlideCanvasMap) {
      var clonedCanvasesArr = slideNode.querySelectorAll('canvas');
      for (var j = 0; j < clonedCanvasesArr.length; j++) {
        var clonedCanvas = clonedCanvasesArr[j];
        thumbnailToSlideCanvasMap[clonedCanvas.id] = clonedCanvas;
      }
    },

    /**
     *  stores shapeFill divs in model
     * @param {HTML} slideNode - slide node
     * @param {JSON} thumbnailToSlideCanvasMap - thumb-to-slide-shapefill map
     */
    mapClonedShapeFills: function(slideNode, thumbnailToSlideShapeFillMap) {
      //fetches html-elements which have ID starting with 'shapeFill'.
      var clonedShapeFillDivArr = slideNode.querySelectorAll('[id$=shapeFill]');
      for (var k = 0; k < clonedShapeFillDivArr.length; k++) {
        var clonedShapeFillDiv = clonedShapeFillDivArr[k];
        thumbnailToSlideShapeFillMap[clonedShapeFillDiv.id] =
          clonedShapeFillDiv;
      }

      var clonedBackgroundDiv =
        slideNode.querySelectorAll('.slideBackground')[0];
      if (clonedBackgroundDiv) {
        thumbnailToSlideShapeFillMap[clonedBackgroundDiv.id] =
          clonedBackgroundDiv;
      }
    },

    /**
     * handle shape with hyperlink
     * @param {HTML} slideNode - slide node
     */
    handleShapesWithHyperlink: function(slideNode) {
      //fetches html-elements which have  "hyperlink" property in the
      // qowt-marker attribute
      var shapesWithHyperlinkArr =
        slideNode.querySelectorAll('[qowt-marker*=hyperlink]');
      for (var l = 0; l < shapesWithHyperlinkArr.length; l++) {
        var shapeWithLink = shapesWithHyperlinkArr[l];

        if (!_hyperlinkDecorator) {
          _hyperlinkDecorator = HyperlinkDecorator.create();
        }

        _hyperlinkDecorator.decorate(shapeWithLink).withLinkForShape();
      }
    },

    /**
     * handle text with hyperlink
     * @param {HTML} slideNode - slide node
     */
    handleTextWithHyperlink: function(slideNode) {
      //fetches html-elements which have  "textHyperlink" property in the
      // qowt-marker attribute
      var textRunsWithHlinkArr =
        slideNode.querySelectorAll('[qowt-marker*=textHyperlink]');

      if (!_hyperlinkDecorator) {
        _hyperlinkDecorator = HyperlinkDecorator.create();
      }

      for (var m = 0; m < textRunsWithHlinkArr.length; m++) {
        var textRunElement = textRunsWithHlinkArr[m];
        _hyperlinkDecorator.decorate(textRunElement).withLinkForText();
      }

    }
  };

  return _api;
});
