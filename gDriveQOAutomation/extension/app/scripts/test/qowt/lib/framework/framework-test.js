define(['qowtRoot/lib/framework/framework'], function() {
  'use strict';

  describe('QOWT Framework', function() {

    var testFrag, testDiv, testEmpty, testP, testSpan, testText;

    beforeEach(function() {
      testFrag = document.createDocumentFragment();
      testFrag.id = 'test_frag';
      testDiv = document.createElement('div');
      testEmpty = document.createElement('div');
      testP = document.createElement('p');
      testDiv.id = 'test_p';
      testSpan = document.createElement('span');
      testText = document.createTextNode('hello');
      testSpan.appendChild(testText);
      testP.appendChild(testSpan);
      testDiv.appendChild(testP);
      testFrag.appendChild(testDiv);
    });
    afterEach(function() {
      testText = undefined;
      testSpan = undefined;
      testP = undefined;
      testEmpty = undefined;
      testDiv = undefined;
      testFrag = undefined;
    });

    describe('Element.clear', function() {
      it('should remove all of the elements children', function() {
        assert.strictEqual(
            testSpan.childNodes.length, 1, 'has children');
        testSpan.clear();
        assert.strictEqual(
            testSpan.childNodes.length, 0, 'all children removed');
        testDiv.clear();
        assert.strictEqual(
            testDiv.childNodes.length, 0, 'all children removed');
      });
      it('should not affect an empty element', function() {
        assert.strictEqual(
            testEmpty.childNodes.length, 0, 'element starts empty');
        testEmpty.clear();
        assert.strictEqual(
            testEmpty.childNodes.length, 0, 'element remains empty');
      });
    });

    describe('Element.removeElm', function() {
      it('should remove the element from its tree', function() {
        assert.strictEqual(
            testDiv.childNodes.length, 1, 'parent has children');
        var elm = testP.removeElm();
        assert.strictEqual(
            elm.nodeName, 'P', 'correct element is removed');
        assert.strictEqual(
            elm.childNodes.length, 1, 'element retains its children');
        assert.strictEqual(
            testDiv.childNodes.length, 0, 'element was removed from parent');
      });
      it('returns null if element is already detached', function() {
        assert.isNull(testEmpty.removeElm(), 'returned null');
      });
    });

    describe('Function.bake', function() {
      var listFunc, contextVar;
      beforeEach(function() {
        listFunc = function() {
          return {
            thisVar: this,
            args: [].slice.call(arguments, 0)
          };
        };
        contextVar = {name: 'test_context'};
      });
      afterEach(function() {
        listFunc = undefined;
        contextVar = undefined;
      });
      it('should point this at the context', function() {
        var output = listFunc.bake(contextVar)();
        assert.strictEqual(
            output.thisVar, contextVar, 'this points at context');
      });
      it('should bake in any parameters', function() {
        var output = listFunc.bake(contextVar, 1, 'a')();
        assert.strictEqual(output.args.length, 2, 'bake in the parameters');
        assert.strictEqual(output.args[0], 1, 'bake in 1st parameter');
        assert.strictEqual(output.args[1], 'a', 'bake in 2nd parameter');
      });
      it('should still allow baked function to accept parameters', function() {
        var output = listFunc.bake(contextVar, 1, 'a')(2, 'b');
        assert.strictEqual(output.args.length, 4, 'take additional parameters');
        assert.strictEqual(output.args[2], 2, 'accept 1st parameter');
        assert.strictEqual(output.args[3], 'b', 'accept in 2nd parameter');
      });
    });

    describe('Element.getElementById', function() {
      it('should add getElementById to document fragments', function() {
        assert.isDefined(testFrag.getElementById,
            'document fragment has getElementById method');
      });
      it('should return the same element as the native method', function() {
        var fromDiv = testDiv.getElementById('test_p'),
            fromFrag = testFrag.getElementById('test_p');
        assert.strictEqual(fromDiv, fromFrag, 'return the same element');
      });
      it('should be able to return itself', function() {
        assert.strictEqual(
            testFrag, testFrag.getElementById('test_frag'), 'return itself');
      });
      it('should return null for not found ids', function() {
        assert.isNull(testFrag.getElementById('xxx'), 'returned null');
      });
    });

  });

  return {};
});
