define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/controls/document/paginator',
  'qowtRoot/models/qowtState',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/third_party/when/when',
  'common/elements/ui/modalDialog/modalDialog'
], function(
    MixinUtils,
    QowtElement,
    Paginator,
    QOWTState,
    PubSub,
    when) {

  'use strict';

  var api_ = {
    is: 'qowt-word-count-dialog',
    extends: 'dialog',

    properties: {
      pageCount: { type: String, value: '' },
      wordCount: { type: String, value: '' },
      charCount: { type: String, value: '' },
      charNoSpacesCount: { type: String, value: '' }
    },

    behaviors: [
      QowtModalDialogBehavior
    ],

    subscriptionTokens_: [],

    attached: function() {
      this.setAttribute('aria-label', this.getMessage_('word_count_title'));
      this.$.closeButton.setAttribute('aria-label',
        this.getMessage_('qowt_modal_dialog_close_button'));
      this.$.affirmative.setAttribute('aria-label',
        this.getMessage_('qowt_modal_dialog_close_button'));

      var onContentCompleted = this.contentCompleted_.bind(this);
      this.subscriptionTokens_.push(
        PubSub.subscribe('qowt:contentComplete', onContentCompleted));
      var onPageCountChanged = this.pageCountChanged_.bind(this);
      this.subscriptionTokens_.push(
        PubSub.subscribe('qowt:pageCountChanged', onPageCountChanged));

      if (QOWTState.isContentComplete()) {
        this.calculateWordCount_();
        this.calculatePageCount_();
      }
    },

    detached: function() {
      this.subscriptionTokens_.forEach(function(token) {
        PubSub.unsubscribe(token);
      });
    },

    focus: function() {
      HTMLElement.prototype.focus.apply(this);
      this.speakLabelForElement(this, true);
    },

    affirmativeFocused_: function() {
      this.speakLabelForElement(this.$.affirmative, true);
    },

    closeButtonFocused_: function() {
      this.speakLabelForElement(this.$.closeButton, true);
    },

    /**
     * Called when the document's complete content is available.
     * eg. This is executed when the last gDC response is fetched for a document
     * that is huge and needs multiple gDC responses.
     * @private
     */
    contentCompleted_: function() {
      this.calculateWordCount_();
      this.calculatePageCount_();
    },

    /**
     * Executed whenever page count changes while pagination.
     * eg. After receiving complete gDC response, the pagination keeps adding
     * pages to the document.
     * @private
     */
    pageCountChanged_: function() {
      if (QOWTState.isContentComplete()) {
        this.calculatePageCount_();
      }
    },

    /**
     * Calculate page count if the document has rendered all the pages. This is
     * identified by checking if the last item in the gDC response is rendered
     * in a page.
     * @private
     */
    calculatePageCount_: function() {
      var lastElement = this.getLastElementInDoc_();
      var itemId = lastElement && lastElement.getEid();
      if (itemId && document.querySelector('qowt-page #' + itemId)) {
        this.pageCount = Paginator.pageCount();
      }
    },

    /**
     * Calculates word and character counts.
     * window.Intl.v8BreakIterator iterates over the text word by word or char
     * by char and we calculate the word and character count.
     * @private
     */
    calculateWordCount_: function() {
      var doc = document.querySelector('qowt-msdoc');
      var text = doc.textContent;
      var locale = 'en';
      //Identify the locale from text and use it in count iterator.
      if (text) {
        when.promise(function(resolve) {
          chrome.i18n.detectLanguage(text, function(result) {
            if (result.languages.length > 0) {
              locale = result.languages[0].language;
            }
            resolve(locale);
          });
        }).then(function(locale) {
            this.runWordCountIterator(locale);
          }.bind(this));
      } else {
        this.runWordCountIterator(locale);
      }
    },

    /**
     * Counts the words and characters by running the iterator through the
     * paragraphs.
     * @param locale {String} The locale of text in the document.
     */
    runWordCountIterator: function(locale) {
      var wordCount = 0;
      var charCount = 0;
      var spaceCount = 0;
      var str = 'qowt-section > [is=qowt-word-para], ';
          str += 'td > div > [is=qowt-word-para]';
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
      this.wordCount = wordCount;
      this.charCount = charCount;
      this.charNoSpacesCount = charCount - spaceCount;
    },

    /**
     * Returns the last element in the last section attached to the
     * document.
     * @returns {HTMLElement}
     * @private
     */
    getLastElementInDoc_: function() {
      var sections = document.querySelectorAll('qowt-section');
      var lastElement;
      if (sections.length > 0) {
        lastElement = sections[sections.length - 1].getLastElement();
      }
      return lastElement;
    },

    /**
     * Verifies if the specified count is set or not.
     * @param count The count to be verified i.e. pageCount, wordCount,
     *              charCount or charNoSpacesCount
     * @returns {boolean} true if the specified count is calculated and ready.
     * @private
     */
    hasCountSet_: function(count) {
      return typeof(count) === 'number';
    },

    /**
     * This is used in the test cases for word count and not in production code.
     * Returns a map of page, word and char count shown in word count dialog.
     * @returns {pages: *, words: *, chars: *, charsNoSpaces: *} Map of pages,
     *         words, characters and character excluding spaces count in dialog.
     */
    getWordCountData: function() {
      var pageCount = Polymer.dom(this.$.pageCount).textContent;
      var wordCount = Polymer.dom(this.$.wordCount).textContent;
      var charCount = Polymer.dom(this.$.charCount).textContent;
      var charNoSpacesCount = Polymer.dom(this.$.charNoSpacesCount).textContent;
      return {'pages': (pageCount ? pageCount.replace(/\s/g, '') : ''),
              'words': (wordCount ? wordCount.replace(/\s/g, '') : ''),
              'chars': (charCount ? charCount.replace(/\s/g, '') : ''),
              'charsNoSpaces': (charNoSpacesCount ?
                        charNoSpacesCount.replace(/\s/g, '') : '')};
    },

    /**
     * Checks if the calculation are done and the count data is populated.
     * @returns {boolean}  True if calculations are done else false.
     */
    hasWordCountData: function() {
      return !!(this.wordCount && this.charCount && this.charNoSpacesCount);
    }
  };

  window.QowtWordCountDialog = Polymer(
    MixinUtils.mergeMixin(QowtElement, api_));

  return {};
});