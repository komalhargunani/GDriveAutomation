define([
  'qowtRoot/controls/document/paginator',
  'qowtRoot/messageBus/messageBus',
  'qowtRoot/pubsub/pubsub'
], function (
  Paginator,
  MessageBus,
  PubSub) {

  'use strict';

  var _contentCompleteToken;
  var _api = {
    init: function () {
      _contentCompleteToken =
        PubSub.subscribe('qowt:contentComplete', logData);
    }
  };

  function logData () {
    var text = document.querySelector('qowt-msdoc').textContent;
    getDocumentLocale(text).then(function(locale) {
      var pageCount = calculatePageCount_();
      var imageCount = calculateImageCount_();
      var wordsChar = runWordCountIterator(locale);
      var bucketSize = 10;
      var bucketLabel = getBucketLabel(pageCount, bucketSize);

      recordToGA('pageCount', pageCount);
      recordToGA('wordCount', wordsChar.wordCount);
      recordToGA('imageCount', imageCount);

      PubSub.publish('qowt:logBucket', {
        'from' : 'word',
        'value' : {
          'label' : bucketLabel,
          'pageCount': pageCount,
          'wordCount': wordsChar.wordCount,
          'imageCount': imageCount
        }
      });
    });
    PubSub.unsubscribe(_contentCompleteToken);
    _contentCompleteToken = undefined;
  }

  function getBucketLabel(count, bucketSize) {
    var floorValue = Math.floor(count/bucketSize);
    var ceilValue = Math.ceil(count/bucketSize);

    var startBucket = 0;
    var endBucket = 0;

    if (floorValue === ceilValue) {
      startBucket = ( floorValue * bucketSize ) - bucketSize + 1;
    } else {
      startBucket = ( floorValue * bucketSize ) + 1;
    }
    endBucket = ( ceilValue * bucketSize );

    return 'bucket_' + startBucket + '_' + endBucket;
  }

  function recordToGA(label, value) {
    MessageBus.pushMessage({
      id: 'recordEvent',
      category: 'raw-data',
      action: 'ViewingFullContent',
      label: label,
      value: value
    });
  }
  function getDocumentLocale(text) {
    var locale = 'en';
    return new Promise(function(resolve) {
      if (text) {
        chrome.i18n.detectLanguage(text, function(result) {
          if (result.languages.length > 0) {
            locale = result.languages[0].language;
          }
          resolve(locale);
        });
      } else {
        resolve(locale);
      }
    });
  }

  /**
   * Counts the words and characters by running the iterator through the
   * paragraphs.
   * @param locale {String} The locale of text in the document.
   */
  function runWordCountIterator(locale) {
    var wordCount = 0;
    var charCount = 0;
    var spaceCount = 0;
    var str = 'qowt-section > [is=qowt-word-para], td > [is=qowt-word-para]';
    var paras = document.querySelectorAll(str);
    if (paras) {
      var wordIterator = window.Intl.v8BreakIterator(locale, {type: 'word'});
      var charIterator =
        window.Intl.v8BreakIterator(locale, {type: 'character'});
      for (var i = 0, len = paras.length; i < len; i++) {
        var text = paras[i].innerText;
        //---------- Word count calculation
        wordIterator.adoptText(text);
        while (wordIterator.next() !== -1) {
          var type = wordIterator.breakType();
          // Words can contain letters 'abc' or numbers like '123'.
          if (type === 'letter' || type === 'number') {
            wordCount++;
          }
        }

        //---------- Character count calculation
        charIterator.adoptText(text);
        var pos = charIterator.next();
        while (pos !== -1) {
          if (charIterator.breakType() === 'none') {
            var char = text.charAt(pos - 1);
            if (char !== '\n') {
              charCount++;
              if (char === ' ') {
                spaceCount++;
              }
            }
          }
          pos = charIterator.next();
        }
      }
    }
    return { 'wordCount': wordCount, 'charCount': charCount };
  }

  /**
   * Counts the total number of images present in document.
   * @private
   */
  function calculateImageCount_() {
    var str = 'qowt-msdoc #zoomable [is=qowt-word-image]';
    var imagesCount = document.querySelectorAll(str).length;
    return imagesCount;
  }

  /**
   * Calculate page count if the document has rendered all the pages. This is
   * identified by checking if the last item in the gDC response is rendered
   * in a page.
   * @private
   */
  function calculatePageCount_() {
    var lastElement = getLastElementInDoc_();
    var itemId = lastElement && lastElement.getEid();
    if (itemId && document.querySelector('qowt-page #' + itemId)) {
      return Paginator.pageCount();
    }
  }

  /**
   * Returns the last element in the last section attached to the
   * document.
   * @returns {HTMLElement}
   * @private
   */
  function getLastElementInDoc_() {
    var sections = document.querySelectorAll('qowt-section');
    var lastElement;
    if (sections.length > 0) {
      lastElement = sections[sections.length - 1].getLastElement();
    }
    return lastElement;
  }

  return _api;
});