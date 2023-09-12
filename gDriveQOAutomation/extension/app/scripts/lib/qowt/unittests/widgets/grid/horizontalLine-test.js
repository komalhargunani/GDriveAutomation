//
// Copyright Quickoffice, Inc, 2005-2011
//
// NOTICE: The intellectual and technical concepts contained
// herein are proprietary to Quickoffice, Inc. and is protected by
// trade secret and copyright law. Dissemination of any of this
// information or reproduction of this material is strictly forbidden
// unless prior written permission is obtained from Quickoffice, Inc.
//

define([
  'qowtRoot/widgets/grid/horizontalLine'
], function(HorizontalLine) {

  'use strict';

  describe('The resizing horizontal line widget', function() {
    var _kDummyHorizontal_Line_Class = 'qowt-sheet-dummy-line-horizontal';

    var lineWidget, lineNode, rootNode;

    beforeEach(function() {
      rootNode = document.createElement('div');
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      lineWidget = undefined;
      lineNode = undefined;
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should exist with the specified class after construction', function() {
      lineWidget = HorizontalLine.create(_kDummyHorizontal_Line_Class);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];
      expect(
          lineNode.classList.contains(_kDummyHorizontal_Line_Class)).toBe(true);

      rootNode.removeChild(lineNode);
      lineWidget = undefined;
      var anotherClassName = 'blah';
      lineWidget = HorizontalLine.create(anotherClassName);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];
      expect(lineNode.classList.contains(anotherClassName)).toBe(true);

    });

    it('should exist but be invisible after construction', function() {
      lineWidget = HorizontalLine.create(_kDummyHorizontal_Line_Class);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];
      expect(lineNode.style.visibility).toBe('hidden');
    });

    it('should be able to be made visible', function() {
      lineWidget = HorizontalLine.create(_kDummyHorizontal_Line_Class);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];
      expect(lineNode.style.visibility).toBe('hidden');

      lineWidget.setVisible(true);
      expect(lineNode.style.visibility).toBe('visible');
    });

    it('should be able to be made invisible', function() {
      lineWidget = HorizontalLine.create(_kDummyHorizontal_Line_Class);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];
      expect(lineNode.style.visibility).toBe('hidden');

      lineWidget.setVisible(true);
      expect(lineNode.style.visibility).toBe('visible');

      lineWidget.setVisible(false);
      expect(lineNode.style.visibility).toBe('hidden');
    });

    it('should be able set its top position', function() {
      lineWidget = HorizontalLine.create(_kDummyHorizontal_Line_Class);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];
      var topPos = 115;
      lineWidget.setTopPosition(topPos);
      expect(lineNode.style.top).toBe(topPos + 'px');
    });

    it('should be able set its bottom position', function() {
      lineWidget = HorizontalLine.create(_kDummyHorizontal_Line_Class);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];
      var bottomPos = 108;
      lineWidget.setBottomPosition(bottomPos);
      expect(lineNode.style.top).toBe(bottomPos - lineNode.clientHeight + 'px');
    });

    it('should be able set its width', function() {
      lineWidget = HorizontalLine.create(_kDummyHorizontal_Line_Class);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];
      var width = 88;
      lineWidget.setWidth(width);
      expect(lineNode.style.width).toBe(width + 'px');
    });

    it('should be able to be reset', function() {
      lineWidget = HorizontalLine.create(_kDummyHorizontal_Line_Class);
      lineWidget.appendTo(rootNode);

      lineNode = rootNode.childNodes[0];

      lineWidget.setVisible(true);
      expect(lineNode.style.visibility).toBe('visible');

      lineWidget.reset();
      expect(lineNode.style.visibility).toBe('hidden');
    });
  });
});
