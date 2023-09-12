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
  'qowtRoot/widgets/grid/colResizeHandle'
], function(
    ColResizeHandle) {

  'use strict';

  describe('The sheet col resize handle widget', function() {
    var _kSheet_Right_Arrow_Class = 'qowt-sheet-col-resize-handle';

    var colResizeHandle, colResizeNode, rootNode;

    beforeEach(function() {
      rootNode = document.createElement('div');
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      colResizeHandle = undefined;
      colResizeNode = undefined;
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should exist with the correct class after construction', function() {
      colResizeHandle = ColResizeHandle.create();
      colResizeHandle.appendTo(rootNode);

      colResizeNode = rootNode.childNodes[0];
      expect(colResizeNode.classList.contains(
            _kSheet_Right_Arrow_Class)).toBe(true);
    });

    it('should exist but be invisible after construction', function() {
      colResizeHandle = ColResizeHandle.create();
      colResizeHandle.appendTo(rootNode);

      colResizeNode = rootNode.childNodes[0];
      expect(colResizeNode.style.visibility).toBe('hidden');
    });

    it('should be able to be made visible', function() {
      colResizeHandle = ColResizeHandle.create();
      colResizeHandle.appendTo(rootNode);

      colResizeNode = rootNode.childNodes[0];
      expect(colResizeNode.style.visibility).toBe('hidden');

      colResizeHandle.setVisible(true);
      expect(colResizeNode.style.visibility).toBe('visible');
    });

    it('should be able to be made invisible', function() {
      colResizeHandle = ColResizeHandle.create();
      colResizeHandle.appendTo(rootNode);

      colResizeNode = rootNode.childNodes[0];
      expect(colResizeNode.style.visibility).toBe('hidden');

      colResizeHandle.setVisible(true);
      expect(colResizeNode.style.visibility).toBe('visible');

      colResizeHandle.setVisible(false);
      expect(colResizeNode.style.visibility).toBe('hidden');
    });

    it('should be able set its left position', function() {
      colResizeHandle = ColResizeHandle.create();
      colResizeHandle.appendTo(rootNode);

      colResizeNode = rootNode.childNodes[0];
      var leftPos = 14;
      colResizeHandle.setLeftPosition(leftPos);
      expect(colResizeNode.style.left).toBe(leftPos + 'px');
    });
  });

});
