/*
 * Test suite for the Formula Bar
 */
define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/widgets/grid/textEditorBase'
], function(
    PubSub,
    TextEditorBase) {

  'use strict';

  describe('The Text Editor Base', function() {
    var rootNode;

    var _kEnterKeyCode = 13;
    var _kTabKeyCode = 9;
    var _kEscapeKeyCode = 27;

    beforeEach(function() {
      rootNode = document.createElement('div');
      document.body.appendChild(rootNode);
    });

    afterEach(function() {
      document.body.removeChild(rootNode);
      rootNode = undefined;
    });

    it('should be successfully created when create() is called on it',
       function() {
         var teb = TextEditorBase.create();
         expect(teb).toBeDefined();
       });

    it('should have a setNode() and getNode() method which stores and ' +
        'returns the text editor node', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);
          expect(teb.getNode()).toBe(editorNode);
        });

    it('should have a focus() method which calls focus() on the text editor ' +
        'node', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);

          spyOn(editorNode, 'focus');

          teb.focus();
          expect(editorNode.focus).toHaveBeenCalled();
        });

    it('should have a blur() method which calls blur() on the text editor node',
       function() {
         var teb = TextEditorBase.create();
         var editorNode = document.createElement('div');
         teb.setNode(editorNode);

         teb.focus();
         spyOn(editorNode, 'blur');

         teb.blur();
         expect(editorNode.blur).toHaveBeenCalled();
       });

    it('should have a commit() method which calls blur() and publishes a ' +
        '"qowt:requestAction" signal for "commitCellEdit"', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);

          spyOn(teb, 'blur');
          spyOn(PubSub, 'publish').andCallThrough();

          // set some orignal text and then change it
          teb.setDisplayText('original text');
          editorNode.textContent = 'edited text';

          // call commit with a sample event that caused the commit
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          teb.commit(evt);

          expect(teb.blur).toHaveBeenCalled();
          expect(PubSub.publish).toHaveBeenCalled();
          expect(PubSub.publish.mostRecentCall.args[0]).toBe(
              'qowt:requestAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'commitCellEdit');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');
          expect(PubSub.publish.mostRecentCall.args[1].context.cellText).toBe(
              'edited text');
          expect(PubSub.publish.mostRecentCall.args[1].context.commitEvent).
              toBe(evt);
        });

    it('should have a cancel() method which calls blur() and publishes a ' +
        '"qowt:requestAction" signal for "cancelCellEdit"', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);

          spyOn(teb, 'blur');
          spyOn(PubSub, 'publish').andCallThrough();

          // call cancel
          teb.cancel();

          expect(teb.blur).toHaveBeenCalled();
          expect(PubSub.publish).toHaveBeenCalled();
          expect(PubSub.publish.mostRecentCall.args[0]).toBe(
              'qowt:requestAction');
          expect(PubSub.publish.mostRecentCall.args[1].action).toBe(
              'cancelCellEdit');
          expect(PubSub.publish.mostRecentCall.args[1].context.contentType).
              toBe('sheetCell');
        });

    it('should be able to set its display text using the setDisplayText() ' +
        'method', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);
          teb.setDisplayText('sample text');
          expect(editorNode.textContent).toBe('sample text');
        });

    it('should display an empty string when setDisplayText() is called ' +
        'without arguments', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);
          teb.setDisplayText();
          expect(editorNode.textContent).toBe('');
        });

    it('should be able to get its display text using the getDisplayText() ' +
        'method', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);
          teb.setDisplayText('blah de blah');
          expect(teb.getDisplayText()).toBe('blah de blah');
        });

    it('should have a method injectCellRef()', function() {
      var teb = TextEditorBase.create();
      expect(teb.injectCellRef).toBeDefined();
    });

    it('should have a method injectCellRange()', function() {
      var teb = TextEditorBase.create();
      expect(teb.injectCellRange).toBeDefined();
    });

    it('should have a method getUncommittedText() which returns the ' +
        'uncommitted text following an edit', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);
          teb.setDisplayText('hello');
          var txt = 'newtext123';
          editorNode.textContent = txt;
          var text = teb.getUncommittedText();
          expect(text).toBe(txt);
        });

    it('should have a onFocusBase() method which publishes a ' +
        '"qowt:sheet:requestFocus" signal', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);
          teb.setDisplayText('test');

          spyOn(PubSub, 'publish').andCallThrough();

          teb.onFocusBase();

          expect(PubSub.publish).toHaveBeenCalled();
          expect(PubSub.publish.mostRecentCall.args[0]).toBe(
              'qowt:sheet:requestFocus');
          expect(PubSub.publish.mostRecentCall.args[1].textWidget).not.toBe(
              undefined);
          expect(PubSub.publish.mostRecentCall.args[1].contentType).toBe(
              'sheetText');
        });

    it('should have a onBlurBase() method which publishes a ' +
        '"qowt:sheet:requestFocusLost" signal', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);
          teb.setDisplayText('some more text');

          spyOn(PubSub, 'publish').andCallThrough();

          teb.onBlurBase();

          expect(PubSub.publish).toHaveBeenCalled();
          expect(PubSub.publish.mostRecentCall.args[0]).toBe(
              'qowt:sheet:requestFocusLost');
        });

    it('should have a method injectNewlineCharacter()', function() {
      var teb = TextEditorBase.create();
      expect(teb.injectNewlineCharacter).toBeDefined();
    });

    it('should inject a newline character using the injectNewlineCharacter()' +
        ' method', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);
          teb.setDisplayText('foobar');
          document.body.appendChild(editorNode);
          var range = document.createRange();
          range.setStart(editorNode.firstChild, 1);
          range.setEnd(editorNode.firstChild, 3);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          teb.injectNewlineCharacter();
          expect(editorNode.textContent.charCodeAt(1)).toBe(10);
          expect(editorNode.textContent.length).toBe(5);
        });


    it('should have a method finalCellAreaBeforeCursor()', function() {
      var teb = TextEditorBase.create();
      expect(teb.finalCellAreaBeforeCursor).toBeDefined();
    });

    it('should have a method isInline() which throws', function() {
      var teb = TextEditorBase.create();
      expect(function() {
        teb.isInline();
      }).toThrow('isInline() is undefined');
    });

    it('should, on receiving an Enter, Tab or Escape key event, prevent the ' +
        'default behaviour of the event', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);

          // generate an 'Enter' key event on the text editor node
          var evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kEnterKeyCode;

          spyOn(evt, 'preventDefault');

          editorNode.dispatchEvent(evt);
          expect(evt.preventDefault).toHaveBeenCalled();

          evt.preventDefault.reset();

          // generate a 'Tab' key event on the text editor node
          evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kTabKeyCode;

          spyOn(evt, 'preventDefault');

          editorNode.dispatchEvent(evt);
          expect(evt.preventDefault).toHaveBeenCalled();

          evt.preventDefault.reset();

          // generate an 'Escape' key event on the text editor node
          evt = document.createEvent('Event');
          evt.initEvent('keydown', true, false);
          evt.keyCode = _kEscapeKeyCode;

          spyOn(evt, 'preventDefault');

          editorNode.dispatchEvent(evt);
          expect(evt.preventDefault).toHaveBeenCalled();
        });

    it('should, on receiving a contextmenu event, stop the event from ' +
        'propagating', function() {
          var teb = TextEditorBase.create();
          var editorNode = document.createElement('div');
          teb.setNode(editorNode);

          // generate a 'contextmenu' event on the text editor node
          var evt = document.createEvent('Event');
          evt.initEvent('contextmenu', true, false);

          spyOn(evt, 'stopPropagation');

          editorNode.dispatchEvent(evt);
          expect(evt.stopPropagation).toHaveBeenCalled();
        });
  });
});
