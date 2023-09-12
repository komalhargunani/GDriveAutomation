// Copyright 2013 Google Inc. All Rights Reserved.

/**
 * @fileoverview Test suite for the System Clipboard widget
 *
 * @author lorrainemartin@google.com (Lorraine Martin)
 */

define([
  'qowtRoot/widgets/grid/sysClipboard'
], function(
    SysClipboard) {

  'use strict';

  describe('The sheet system clipboard widget', function() {

    var _kCopy_Text_Node_ClassName = 'qowt-sheet-text-node',
        rootNode;

    beforeEach(function() {
      SysClipboard.init();
      rootNode = document.createElement('div');
      SysClipboard.appendTo(rootNode);
    });

    afterEach(function() {
      rootNode = undefined;
    });

    it('should have two nodes after it has been created', function() {
      expect(rootNode.childNodes.length).toBe(2);
      expect(rootNode.childNodes[0].className).
          toBe(_kCopy_Text_Node_ClassName);
      expect(rootNode.childNodes[1].className).
          toBe(_kCopy_Text_Node_ClassName);
    });

    it('should be able to cut text from the active DOM node to the ' +
        'system clipboard', function() {
          spyOn(document, 'execCommand');

          SysClipboard.cutText();
          expect(document.execCommand).toHaveBeenCalledWith('cut');
        });

    it('should be able to copy text from the active DOM node to the ' +
        'system clipboard', function() {
          spyOn(document, 'execCommand');

          SysClipboard.copyText();
          expect(document.execCommand).toHaveBeenCalledWith('copy');
        });

    it('should be able to copy specified text to the system clipboard',
        function() {
          expect(rootNode.childNodes.length).toBe(2);
          var copyNode = rootNode.childNodes[0];
          expect(copyNode.value).toBe('');
          spyOn(copyNode, 'select');
          spyOn(document, 'execCommand');

          SysClipboard.copyCellContent('hello');
          expect(copyNode.value).toBe('hello');
          expect(copyNode.select).toHaveBeenCalled();
          expect(document.execCommand).toHaveBeenCalledWith('copy');
        });

    it('should be able to paste text the system clipboard to the ' +
        'active DOM node', function() {
          spyOn(document, 'execCommand');

          SysClipboard.paste();
          expect(document.execCommand).toHaveBeenCalledWith('paste');
        });

    it('should throw error if sysClipboard.init() called multiple times',
        function() {
          expect(SysClipboard.init).toThrow('sysClipboard.init() called ' +
              'multiple times.');
        });
  });
});

