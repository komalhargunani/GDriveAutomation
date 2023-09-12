/*
 * Test suite for the Formula Bar
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/formulaBar',
  'qowtRoot/features/pack',
  'qowtRoot/utils/domListener'
], function(
    PubSub,
    FormulaBar,
    FeaturePack,
    DomListener) {

  'use strict';

  /**
   * TODO: In moving to requireJS the FormulaBar widget is imported into this
   * module as an object. The formula bar widget is currently implemented as a
   * singleton. This this unit test can no longer recreate a fresh instance for
   * each test. The tests currently pass since each test does not violate
   * preconditions of the next. This _could_ become a problem in the future.
   * If that is the case then the Formula Bar should really become an instance
   * factory.
   */

  describe('A formula bar', function() {
    var rootNode;

    beforeEach(function() {
      FormulaBar.init();

      rootNode = document.createElement('div');
      rootNode.className = 'qowt-sheet-formula-bar-container';
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should extend the TextEditorBase API', function() {
      expect(FormulaBar.getNode).toBeDefined();
      expect(FormulaBar.setNode).toBeDefined();
      expect(FormulaBar.focus).toBeDefined();
      expect(FormulaBar.blur).toBeDefined();
      expect(FormulaBar.commit).toBeDefined();
      expect(FormulaBar.cancel).toBeDefined();
      expect(FormulaBar.setDisplayText).toBeDefined();
      expect(FormulaBar.getDisplayText).toBeDefined();
      expect(FormulaBar.injectCellRef).toBeDefined();
      expect(FormulaBar.getUncommittedText).toBeDefined();
      expect(FormulaBar.onFocusBase).toBeDefined();
      expect(FormulaBar.onBlurBase).toBeDefined();
    });

    it('should have a enableEdits() method which sets contentEditable on and' +
        ' adds the cursor hover class', function() {
          FormulaBar.appendTo(rootNode);
          FormulaBar.enableEdits();
          var fbNode = rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor')[0];
          expect(fbNode.contentEditable).toBe('true');
          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-edit-mode-hover')).toBe(true);
        });

    it('should have a disableEdits() method which sets contentEditable off ' +
        'and removes the cursor hover class', function() {
          FormulaBar.appendTo(rootNode);
          FormulaBar.disableEdits();
          var fbNode = rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor')[0];
          expect(fbNode.contentEditable).toBe('false');
          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-edit-mode-hover')).toBe(false);
        });

    it('should have an isInline() method which returns false', function() {
      expect(FormulaBar.isInline()).toBe(false);
    });

    it('should be appended to a specified node when appendTo() is called on' +
        ' it', function() {
          FormulaBar.appendTo(rootNode);
          expect(rootNode).toBeDefined();
          expect(rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-function-icon').length).toBe(1);
          expect(rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor').length).toBe(1);
        });

    /**TODO: Need to uncomment after luci updates */
    xit('should, on receiving a blur event, style the formula bar to look' +
        ' inactive and call onBlurBase()', function() {
          FormulaBar.appendTo(rootNode);

          var fbNode = rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor')[0];
          fbNode.focus();

          spyOn(FormulaBar, 'onBlurBase');

          // cause a blur event occur on the formula bar node
          fbNode.blur();

          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-active')).toBe(false);
          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-non-active')).toBe(true);
          expect(FormulaBar.onBlurBase).toHaveBeenCalled();
        });

    /**TODO: Need to uncomment after luci updates */
    xit('should, on receiving a focus event, publish a ' +
        '"qowt:formulaBar:focused" signal, style the formula bar to look ' +
        'active and call onFocusBase()', function() {
          FormulaBar.appendTo(rootNode);

          spyOn(PubSub, 'publish').andCallThrough();
          spyOn(FormulaBar, 'onFocusBase');

          // cause a focus event occur on the formula bar node
          var fbNode = rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor')[0];
          fbNode.focus();

          expect(PubSub.publish).toHaveBeenCalled();
          expect(PubSub.publish.mostRecentCall.args[0]).toBe(
              'qowt:formulaBar:focused');
          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-non-active')).toBe(false);
          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-active')).toBe(true);
          expect(FormulaBar.onFocusBase).toHaveBeenCalled();
        });
  });

  describe('For Editor', function() {
    var rootNode;

    beforeEach(function() {
      spyOn(FormulaBar, 'setNode');
      spyOn(DomListener, 'addListener');

      FeaturePack.edit = true;
      FormulaBar.init();
      rootNode = document.createElement('div');
      rootNode.className = 'qowt-sheet-formula-bar-container';
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should be successfully initialised when init() is called on it for' +
        ' the Editor', function() {
          expect(FormulaBar).toBeDefined();
          FormulaBar.appendTo(rootNode);

          // check that the formula bar icon node is initialised
          expect(rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-function-icon').length).toBe(1);

          // check that the formula bar node is initialised
          expect(rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor').length).toBe(1);
          var fbNode = rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor')[0];
          expect(fbNode.classList.contains(
                'qowt-sheet-formula-bar-editor-non-active')).toBe(true);

          // check that all of the edit attributes are set
          expect(fbNode.contentEditable).toBe('true');
          expect(fbNode.spellcheck).toBe(false);
          expect(fbNode.style.background).toBe('white');
          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-edit-mode-hover')).toBe(true);

          // check that the formula bar node has been stored in text editor base
          expect(FormulaBar.setNode).toHaveBeenCalledWith(fbNode);

          // check that event listeners have been added
          expect(DomListener.addListener).toHaveBeenCalled();
        });
  });

  describe('For Viewer', function() {
    var rootNode;

    beforeEach(function() {
      spyOn(FormulaBar, 'setNode');
      spyOn(DomListener, 'addListener');

      FeaturePack.edit = false;
      FormulaBar.init();
      rootNode = document.createElement('div');
      rootNode.className = 'qowt-sheet-formula-bar-container';
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should be successfully initialised when init() is called on it for' +
        ' the Viewer', function() {

          expect(FormulaBar).toBeDefined();
          FormulaBar.appendTo(rootNode);

          // check that the formula bar icon node is initialised
          expect(rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-function-icon').length).toBe(1);

          // check that the formula bar node is initialised
          expect(rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor').length).toBe(1);
          var fbNode = rootNode.getElementsByClassName(
              'qowt-sheet-formula-bar-editor')[0];
          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-non-active')).toBe(true);

          // check that none of the edit attributes are set
          expect(fbNode.contentEditable).not.toBe('true');
          expect(fbNode.spellcheck).not.toBe(false);
          expect(fbNode.style.background).not.toBe('white');
          expect(fbNode.classList.contains(
              'qowt-sheet-formula-bar-editor-edit-mode-hover')).not.toBe(true);

          // check that the formula bar node has been stored in text editor base
          expect(FormulaBar.setNode).toHaveBeenCalledWith(fbNode);

          // check that event listeners have been added
          expect(DomListener.addListener).not.toHaveBeenCalled();
        });

    it('should throw if formulaBar.init() called multiple times', function() {
      expect(FormulaBar.init).toThrow(
          'formulaBar.init() called multiple times.');
    });
  });
});
