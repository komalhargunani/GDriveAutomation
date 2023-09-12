/*
 * Test suite for the Floating Editor
 */
define([
  'qowtRoot/widgets/grid/floatingEditor',
  'qowtRoot/utils/domListener'
], function(
    FloatingEditor,
    DomListener) {

  'use strict';

  describe('A floating editor', function() {
    var rootNode;

    beforeEach(function() {
      rootNode = document.createElement('div');
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should extend the TextEditorBase API', function() {
      var fe = FloatingEditor.create();
      expect(fe.getNode).toBeDefined();
      expect(fe.setNode).toBeDefined();
      expect(fe.focus).toBeDefined();
      expect(fe.blur).toBeDefined();
      expect(fe.commit).toBeDefined();
      expect(fe.cancel).toBeDefined();
      expect(fe.setDisplayText).toBeDefined();
      expect(fe.getDisplayText).toBeDefined();
      expect(fe.injectCellRef).toBeDefined();
      expect(fe.getUncommittedText).toBeDefined();
      expect(fe.onFocusBase).toBeDefined();
      expect(fe.onBlurBase).toBeDefined();
    });

    it('should be successfully initialised when create() is called on it',
       function() {
         spyOn(DomListener, 'addListener');

         var fe = FloatingEditor.create();
         expect(fe).toBeDefined();
         fe.appendTo(rootNode);

         // check that the floating editor node is initialised
         expect(rootNode.getElementsByClassName('qowt-floating-editor').length).
             toBe(1);
         var feNode =
             rootNode.getElementsByClassName('qowt-floating-editor')[0];
         expect(feNode.contentEditable).toBe('true');
         expect(feNode.spellcheck).toBe(false);
         expect(feNode.style.top).toBe('0px');
         expect(feNode.style.left).toBe('0px');
         expect(feNode.style.minWidth).toBe('0px');
         expect(feNode.style.minHeight).toBe('0px');

         // check that the floating editor node was stored in text editor base
         var node = fe.getNode();
         expect(node).toBe(feNode);

         expect(DomListener.addListener).toHaveBeenCalled();
       });

    it('should have a positionOver() method which configures its position ' +
        'and dimensions', function() {
          var fe = FloatingEditor.create();
          fe.appendTo(rootNode);
          var feNode = rootNode.getElementsByClassName(
              'qowt-floating-editor')[0];
          expect(parseInt(feNode.style.top, 10)).toBe(0);
          expect(parseInt(feNode.style.left, 10)).toBe(0);
          expect(parseInt(feNode.style.minWidth, 10)).toBe(0);
          expect(parseInt(feNode.style.minHeight, 10)).toBe(0);

          var rect = {
            topPos: 100,
            leftPos: 80,
            height: 250,
            maxHeight: 480,
            width: 75,
            maxWidth: 150
          };
          fe.positionOver(rect);

          expect(parseInt(feNode.style.top, 10)).toBeGreaterThan(0);
          expect(parseInt(feNode.style.left, 10)).toBeGreaterThan(0);
          expect(parseInt(feNode.style.minWidth, 10)).toBeGreaterThan(0);
          expect(parseInt(feNode.style.maxWidth, 10)).toBeGreaterThan(
              parseInt(feNode.style.minWidth, 10));
          expect(parseInt(feNode.style.minHeight, 10)).toBeGreaterThan(0);
          expect(parseInt(feNode.style.maxHeight, 10)).toBeGreaterThan(
              parseInt(feNode.style.minHeight, 10));

          rect.width = 180;
          rect.height = 500;
          fe.positionOver(rect);
          // Proves that minWidth and minHeight are never bigger than maxWidth
          // and maxHeight
          expect(parseInt(feNode.style.minWidth, 10)).toBe(rect.maxWidth);
          expect(parseInt(feNode.style.minHeight, 10)).toBe(rect.maxHeight);
        });

    it('should have a setVisibility() method which sets the visibility',
       function() {
         var fe = FloatingEditor.create();
         fe.appendTo(rootNode);
         var feNode = rootNode.getElementsByClassName(
             'qowt-floating-editor')[0];

         fe.setVisibility(false);
         expect(feNode.style.visibility).toBe('hidden');

         fe.setVisibility(true);
         expect(feNode.style.visibility).toBe('visible');
       });

    it('should have a resetTextFormatting() method which resets the text ' +
        'formatting', function() {
          var fe = FloatingEditor.create();
          fe.appendTo(rootNode);
          var feNode = rootNode.getElementsByClassName(
              'qowt-floating-editor')[0];
          expect(feNode.style.fontWeight).toBe('');
          expect(feNode.classList.contains('qowt-sheet-cell-wrap')).toBe(false);

          var formatting = {
            bld: true,
            wrapText: true
          };

          fe.resetTextFormatting(formatting);
          expect(feNode.style.fontWeight).toBe('bold');
          expect(feNode.classList.contains('qowt-sheet-cell-wrap')).toBe(true);
        });

    it('should have a resetTextAlignment() method which resets the text ' +
        'alignment', function() {
          var fe = FloatingEditor.create();
          fe.appendTo(rootNode);
          var feNode = rootNode.getElementsByClassName(
              'qowt-floating-editor')[0];
          expect(feNode.classList.contains('qowt-horizontal-align-right')).toBe(
              false);
          expect(feNode.classList.contains('qowt-vertical-align-top')).toBe(
              false);

          fe.resetTextAlignment('right', 'top');
          expect(feNode.classList.contains('qowt-horizontal-align-right')).toBe(
              true);
          expect(feNode.classList.contains('qowt-vertical-align-top')).toBe(
              true);
        });

    it('should have an isInline() method which returns true', function() {
      var fe = FloatingEditor.create();
      expect(fe.isInline()).toBe(true);
    });

    it('should be appended to a specified node when appendTo() is called on it',
       function() {
         var fe = FloatingEditor.create();
         fe.appendTo(rootNode);
         expect(rootNode).toBeDefined();
         expect(rootNode.getElementsByClassName('qowt-floating-editor').length).
             toBe(1);
       });

    /**TODO: Need to uncomment after luci updates */
    xit('should, on receiving a blur event, call onBlurBase()', function() {
      var fe = FloatingEditor.create();
      fe.appendTo(rootNode);
      fe.setVisibility(true);

      fe.focus();

      spyOn(fe, 'onBlurBase');

      // cause a blur event occur on the floating editor node
      fe.blur();

      expect(fe.onBlurBase).toHaveBeenCalled();
    });

    /**TODO: Need to uncomment after luci updates */
    xit('should, on receiving a focus event, call onFocusBase()', function() {
      var fe = FloatingEditor.create();
      fe.appendTo(rootNode);
      fe.setVisibility(true);

      spyOn(fe, 'onFocusBase');

      // cause a focus event occur on the floating editor node
      fe.focus();

      expect(fe.onFocusBase).toHaveBeenCalled();
    });
  });
});
