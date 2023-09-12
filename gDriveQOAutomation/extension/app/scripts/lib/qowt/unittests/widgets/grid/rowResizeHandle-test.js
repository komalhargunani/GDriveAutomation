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
  'qowtRoot/widgets/grid/rowResizeHandle'
], function(RowResizeHandle) {

  'use strict';

  describe('The sheet row resize handle widget', function() {
    var _kRow_Resize_Handle_Class = 'qowt-sheet-row-resize-handle';

    var rowResizeHandle, rowResizeNode, rootNode;

    beforeEach(function() {
      rootNode = document.createElement('div');
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      rowResizeHandle = undefined;
      rowResizeNode = undefined;
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should exist with the correct class after construction', function() {
      rowResizeHandle = RowResizeHandle.create();
      rowResizeHandle.appendTo(rootNode);

      rowResizeNode = rootNode.childNodes[0];
      expect(rowResizeNode.classList.contains(
            _kRow_Resize_Handle_Class)).toBe(true);
    });

    it('should exist but be invisible after construction', function() {
      rowResizeHandle = RowResizeHandle.create();
      rowResizeHandle.appendTo(rootNode);

      rowResizeNode = rootNode.childNodes[0];
      expect(rowResizeNode.style.visibility).toBe('hidden');
    });

    it('should be able to be made visible', function() {
      rowResizeHandle = RowResizeHandle.create();
      rowResizeHandle.appendTo(rootNode);

      rowResizeNode = rootNode.childNodes[0];
      expect(rowResizeNode.style.visibility).toBe('hidden');

      rowResizeHandle.setVisible(true);
      expect(rowResizeNode.style.visibility).toBe('visible');
    });

    it('should be able to be made invisible', function() {
      rowResizeHandle = RowResizeHandle.create();
      rowResizeHandle.appendTo(rootNode);

      rowResizeNode = rootNode.childNodes[0];
      expect(rowResizeNode.style.visibility).toBe('hidden');

      rowResizeHandle.setVisible(true);
      expect(rowResizeNode.style.visibility).toBe('visible');

      rowResizeHandle.setVisible(false);
      expect(rowResizeNode.style.visibility).toBe('hidden');
    });

  });
});

