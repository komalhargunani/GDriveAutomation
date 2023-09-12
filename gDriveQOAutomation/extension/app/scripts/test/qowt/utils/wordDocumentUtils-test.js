define([
  'qowtRoot/utils/wordDocumentUtils'
], function(
    WordDocumentUtils) {
  'use strict';

  describe('Test wordDocumentUtils.js', function() {
    describe('Test WordDocumentUtils.isDocWithoutPara()', function() {
      describe('document without para', function() {
        beforeEach(function() {
          this.stampOutTempl('document-without-para');
        });


        it('should return true', function() {
          assert.isTrue(WordDocumentUtils.isDocWithoutPara());
        });
      });


      describe('document with para and text', function() {
        beforeEach(function() {
          this.stampOutTempl('document-with-text');
        });


        it('should return false', function() {
          assert.isFalse(WordDocumentUtils.isDocWithoutPara());
        });
      });


      describe('document with para and drawing', function() {
        beforeEach(function() {
          this.stampOutTempl('document-with-drawing');
        });


        it('should return false', function() {
          assert.isFalse(WordDocumentUtils.isDocWithoutPara());
        });
      });


      describe('document with empty para', function() {
        beforeEach(function() {
          this.stampOutTempl('document-with-empty-para');
        });


        it('should return false', function() {
          assert.isFalse(WordDocumentUtils.isDocWithoutPara());
        });
      });
    });

    describe('Test WordDocumentUtils.isDocWithEmptyParas()', function() {
      describe('document without para', function() {
        beforeEach(function() {
          this.stampOutTempl('document-without-para');
        });


        it('should return false', function() {
          assert.isFalse(WordDocumentUtils.isDocWithEmptyParas());
        });
      });


      describe('document with para and text', function() {
        beforeEach(function() {
          this.stampOutTempl('document-with-text');
        });


        it('should return false', function() {
          assert.isFalse(WordDocumentUtils.isDocWithEmptyParas());
        });
      });


      describe('document with para and drawing', function() {
        beforeEach(function() {
          this.stampOutTempl('document-with-drawing');
        });


        it('should return false', function() {
          assert.isFalse(WordDocumentUtils.isDocWithEmptyParas());
        });
      });


      describe('document with empty para', function() {
        beforeEach(function() {
          this.stampOutTempl('document-with-empty-para');
        });


        it('should return true', function() {
          assert.isTrue(WordDocumentUtils.isDocWithEmptyParas());
        });
      });
    });
  });
});
