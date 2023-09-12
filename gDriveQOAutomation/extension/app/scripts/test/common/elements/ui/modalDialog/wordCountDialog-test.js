define([], function() {

  'use strict';

  describe('word-count-modal-dialog element', function() {
    var dialog;

    beforeEach(function() {
      dialog = new QowtWordCountDialog();
    });

    afterEach(function() {
      dialog.destroy();
    });

    it('should be a QowtWordCountDialog instance', function() {
      assert.instanceOf(dialog, QowtWordCountDialog, 'be QowtWordCountDialog.');
    });

    it('should be a HTMLDialogElement instance.', function() {
      assert.instanceOf(dialog, HTMLDialogElement, 'be a HTMLDialogElement.');
    });

    it('should be in the body after being shown', function(done) {
      assert.isNull(dialog.parentNode, 'dialog is not in DOM');
      dialog.addEventListener('dialog-shown', function() {
        assert.isNotNull(dialog.parentNode, 'dialog is in DOM');
        done();
      });
      dialog.show();
    });

    it('should show spinners if word count data is not available',
      function(done) {
        dialog.addEventListener('dialog-shown', function() {
          var spinners =
            Polymer.dom(dialog.root).querySelectorAll('paper-spinner-lite');
          assert.equal(spinners.length, '4', 'Spinners are present');
          Array.prototype.forEach.call(spinners, function(spinner) {
            assert.isTrue(spinner.active,
              'spinner ' + spinner.id + ' is active');
          });

          var wordCountData = dialog.getWordCountData();
          assert.equal(wordCountData.pages, '', 'Page count is absent');
          assert.equal(wordCountData.words, '', 'Word count is absent');
          assert.equal(wordCountData.chars, '', 'Character count is absent');
          assert.equal(wordCountData.charsNoSpaces, '',
            'Character without spaces count is absent');
          dialog.close();
          done();
        });
        dialog.show();
      });

    it('should show available word count data in dialog', function(done) {
      dialog.pageCount = 12;
      dialog.wordCount = 500;
      dialog.charCount = 600;
      dialog.charNoSpacesCount = 550;

      dialog.addEventListener('dialog-shown', function() {
        var spinners =
          Polymer.dom(dialog.root).querySelectorAll('paper-spinner-lite');
        assert.equal(spinners.length, '0', 'Spinners are absent');

        var wordCountData = dialog.getWordCountData();
        assert.isNotNull(wordCountData, 'Word count data is present');
        assert.equal(wordCountData.pages, dialog.pageCount, 'Page count shown');
        assert.equal(wordCountData.words, dialog.wordCount, 'Word count shown');
        assert.equal(wordCountData.chars, dialog.charCount, 'Char count shown');
        assert.equal(wordCountData.charsNoSpaces, dialog.charNoSpacesCount,
          'Character without spaces count shown');
        dialog.close();
        done();
      });
      dialog.show();
    });
  });
});
