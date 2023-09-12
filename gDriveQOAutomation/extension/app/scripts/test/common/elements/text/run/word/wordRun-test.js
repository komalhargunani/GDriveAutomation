define([
  'common/elements/text/run/word/wordRun'], function() {
  'use strict';

  describe('<qowt-word-run>', function() {

    var element;

    beforeEach(function() {
      this.stampOutTempl('word-run-test-template');
      element = document.querySelector('[is="qowt-word-run"]');
    });

    it('should return correct element type', function() {
      assert.equal(element.etp, 'ncr', 'should have correct element type');
    });

    it('should be possible to insert text', function() {
      var newText = 'eggs';
      var originalText = element.textContent;
      element.insertText(3, newText);
      assert.strictEqual(
          element.textContent,
          originalText.substring(0, 3) + newText + originalText.substring(3),
          'insert text in the right place');
    });

    it('should be possible to delete text', function() {
      var originalText = element.textContent;
      element.removeText(3, 2);
      assert.strictEqual(
          element.textContent,
          originalText.substring(0, 3) + originalText.substring(3 + 2),
          'remove text in the right place');
    });


    it('should throw an exception if offset is wrong for insert', function() {
      assert.throw(function() {
        element.insertText(1000, 'boom');
      }, undefined, 'TextRun Error',
      'should throw when offset is out of scope for insertText');
    });

    it('should throw an exception if offset is wrong for delete', function() {
      assert.throws(function() {
        element.removeText(1000, 1000);
      }, undefined, 'TextRun Error',
      'should throw when offset is out of scope for removeText');
    });

    it('should throw an exception if we are flowing ' +
        'and trying to insert text', function() {
          assert.doesNotThrow(function() {
            element.insertText(0, 'boom');
          }, undefined, 'TextRun Error',
          'should throw when attempting to insert while flowing');
        });

    it('should throw an exception if we are flowing ' +
        'and trying to delete text', function() {
          assert.doesNotThrow(function() {
            element.removeText(0, 1);
          }, undefined, 'TextRun Error',
          'should throw when attempting to insert while flowing');
        });
  });

  return {};
});
