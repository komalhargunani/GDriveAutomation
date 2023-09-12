define([
  'common/mixins/mixinUtils',
  'common/mixins/decorators/alignment',
  'common/mixins/decorators/contextualSpacing',
  'common/mixins/decorators/firstLineIndent',
  'common/mixins/decorators/hangingIndent',
  'common/mixins/decorators/leftIndent',
  'common/mixins/decorators/lineSpacing',
  'common/mixins/decorators/listItem',
  'common/mixins/decorators/pageBreakBefore',
  'common/mixins/decorators/paragraphBackground',
  'common/mixins/decorators/paragraphBorders',
  'common/mixins/decorators/paragraphStyle',
  'common/mixins/decorators/rightIndent',
  'common/mixins/decorators/spaceAfter',
  'common/mixins/decorators/spaceBefore',
  'common/mixins/decorators/tabStop',
  'common/mixins/flowChildren',
  'common/mixins/text/addRunIfNeeded',
  'common/mixins/text/indentCorrection',
  'qowtRoot/utils/domUtils',
  'common/elements/text/para/para'
], function(
    MixinUtils,
    Alignment,
    ContextualSpacing,
    FirstLineIndent,
    HangingIndent,
    LeftIndent,
    LineSpacing,
    ListItem,
    PageBreakBefore,
    ParagraphBackground,
    ParagraphBorders,
    ParagraphStyle,
    RightIndent,
    SpaceAfter,
    SpaceBefore,
    TabStop,
    FlowChildren,
    AddRunIfNeeded,
    IndentCorrection,
    DomUtils,
    QowtPara) {

  'use strict';

  var nativeAppendChild = Element.prototype.appendChild;

  var api_ = {
    is: 'qowt-word-para',
    extends: 'p',

    // the DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it
    etp: 'par',

    observers: [
      'characterFormattingChanged_(model.characterFormatting)'
    ],

    attached: function() {
      ParagraphBorders.attached.call(this);
      TabStop.attached.call(this);
      // Adding this run will highlight the formatting buttons in button bar as
      // expected.
      this.addRunIfNeeded();
      this.addEventListener('click', this.onclick.bind(this), false);
      this.addBrIfNeeded_();
      this.correctBulletIndentation();
      this.onMutation(this, this.handleMutations_);
      if (this.getAllRunsLength_(this) === 0) {
        this.applyClearProperty_();
      }
    },

    appendChild: function (newChild) {
      if(this.childNodes.length === 1 &&
        this.lastChild.nodeType === Node.TEXT_NODE &&
        newChild.nodeType === Node.ELEMENT_NODE) {
          return nativeAppendChild.call(this, newChild);
      } else if (this.lastChild &&
        this.lastChild.nodeType === Node.TEXT_NODE &&
        newChild.nodeType === Node.ELEMENT_NODE) {
        return this.insertBefore(newChild, this.lastChild);
      } else if (newChild.nodeType === Node.TEXT_NODE) {
        if(this.lastChild && this.lastChild.nodeType === Node.ELEMENT_NODE) {
          return nativeAppendChild.call(this, newChild);
        } else {
          return this.insertBefore(newChild, this.firstChild);
        }
      }
      return nativeAppendChild.call(this, newChild);
    },

    onclick: function(e) {
      this.clickCount = e.detail;
    },

    /**
     *  This function applies css clear property to paragraph when paragraph has
     *  empty and previous sibling paragraph has drawing with wrapping style
     *  top and bottom.
     */
    applyClearProperty_: function() {
      var prevPara = this.previousElementSibling;
      var querySel = 'qowt-drawing[wrappingstyle=topAndBottom]';
      if (prevPara && prevPara.querySelector(querySel)) {
        this.style.clear = 'both';
      }
    },

    getSection_: function() {
      var section;
      var elm = this.parentNode;
      while (elm) {
        if (elm instanceof QowtSection) {
          section = elm;
          break;
        }
        elm = elm.parentNode;
      }
      return section;
    },

    get characterFormatting() {
      return (this.model && this.model.characterFormatting);
    },

    /***
     * Returns the height of the box that will be required by the paragraph to
     * fit completely on a page if it is empty. Otherwise returns 0
     * @return {number}
     */
    minHeight: function() {
      return this.isEmpty() ? this.offsetHeight : 0;
    },

    /**
     * This verifies if the para is empty by checking if there are any children
     * except br and the temporary run which is inserted to handle the rPr of
     * paragraph.
     * @returns {boolean}
     */
    isEmpty: function(considerDrawingNEmptyRun) {
      if (considerDrawingNEmptyRun) {
        return this.hasNoContentMarkup();
      }
      // select all children which are NOT <br> AND <br>s that have qowt-divtype
      var children =
          this.querySelectorAll(':scope > :not(br), ' +
          ':scope > span[is=qowt-line-break]');
      return children.length === 0 || this.hasTemporaryRun() ||
        this.hasRunWithBr_(children);
    },

    hasNoContentMarkup: function() {
      // select all children which are NOT <br> AND <br>s that have qowt-divtype
      var children =
          this.querySelectorAll(':scope > :not(br), ' +
          ':scope > span[is=qowt-line-break]');
      return children.length === 0 || (this.hasTemporaryRun() &&
      this.querySelectorAll('qowt-drawing').length === 0);
    },

    // ----------------------- private -------------------------

    /**
     * @override
     */
    brRequired_: function() {
      // Word paragraphs can have nested drawings, page-breaks.
      // Consider these in determining if a br is required or not.
      var columnBreakSelector = ':scope > span[is=qowt-column-break]';
      var pageBreakSelector = ':scope > span[qowt-divtype=qowt-pagebreak]';
      var stylingSpanSelector = ':scope > span > br:not([qowt-divtype])';
      var brSelector = ':scope > span[is=qowt-line-break]';

      var noColumnBreak =
          this.querySelectorAll(columnBreakSelector).length === 0;
      var noStylingSpan =
          this.querySelectorAll(stylingSpanSelector).length === 0;
      var noPageBreak =
          this.querySelectorAll(pageBreakSelector).length === 0;
      var noBr =
          this.querySelectorAll(brSelector).length === 0;

      // Require a BR if all of the following is satisfied
      // 1) Entire text content belong to drawing object
      //    i.e no editable textual content.
      // 2) No page-break span
      // 3) No column-break span
      // 4) No styling span
      // 5) No br with qowt-divtypes already exists
      return noPageBreak &&
             noColumnBreak &&
             noStylingSpan &&
             noBr &&
             this.entireTextBelongsToTextBoxes_();
    },

    /**
     * Checks if all the textContent of the paragraph belongs to text boxes
     * present in that paragraph.
     *
     * @param {object} para - paragraph
     * @return {Boolean} - returns true if all the textContent of the paragraph
     *                     belongs to text boxes else false.
     */
    entireTextBelongsToTextBoxes_: function() {
      var drawingElements = this.querySelectorAll(':scope > qowt-drawing');
      var paraTextContentLength = this.getAllRunsLength_(this);
      if (drawingElements.length > 0) {
        for (var i = 0; i < drawingElements.length; i++) {
          paraTextContentLength -= this.getAllRunsLength_(drawingElements[i]);
        }
      }
      return (paraTextContentLength === 0);
    },

    getAllRunsLength_: function (element) {
      var runs = Array.from(element.getElementsByTagName('span'));
      var allRunsLength = 0;
      runs.forEach(function(run) {
        if (run.children && run.children.length === 0) {
          allRunsLength += run.innerText.length;
        }
      });
      return allRunsLength;
    },

    handleMutations_: function() {
      // Adding this run will highlight the formatting buttons in button bar as
      // expected. When the paragraph is being edited by a user and makes it
      // empty set the caret to this span.
      if(!this.getAttribute('removedFromShady')) {
        this.clickCount = 0;
        this.addRunIfNeeded();
        this.addBrIfNeeded_();
        this.removeNBSPNodeIfAny_();
        this.formatParaWithRunProp();
        this.correctBulletIndentation();
        this.onMutation(this, this.handleMutations_);
      }
    },

    removeNBSPNodeIfAny_: function() {
      var children = Array.from(this.childNodes);
      while(children.length > 0) {
        var child = children.pop();
        if (child.nodeType === Node.TEXT_NODE &&
          child.nodeValue.trim().length === 0 &&
          /[\xA0]/.test(child.textContent)) {
          this.removeChild(child);
        }
      }
    },

    reorderAsolutelyPositionedDrawings: function() {
      var parentNode = this.parentNode;
      var type = parentNode && parentNode.tagName === 'DIV' &&
        parentNode.getAttribute("type");

      if (['both', 'even', 'odd', 'first-page'].includes(type)) {
        var drawings = this.querySelectorAll(
          'qowt-drawing[hpos="absolute"][hposref="column"]' +
          '[vpos="absolute"][vposref="paragraph"]' +
          ':not([wrappingstyle="inlineWithText"]'
        );
        for (var i = drawings.length - 1; i >= 0; i--) {
          DomUtils.insertAtStart(drawings[i], this);
        }
      }
    },
    /**
     * If the para has any temporary run, which means it is blank and also has
     * character formatting(eg. bold) applied to it, this api will decorate with
     * same.
     */
    formatParaWithRunProp: function() {
      if (this.hasTemporaryRun() &&
          !this.getAttribute('removedLink') &&
          this.model && this.model.characterFormatting) {
        var spans = this.querySelectorAll(':scope > span');
        spans[0].decorate(this.model.characterFormatting, false);
      }
    },

    hasRunWithSiblingBr: function(children) {
      return children.length === 2 && (
        (children[0].tagName === 'SPAN' &&
        children[1].tagName === 'BR') ||
        (children[0].tagName === 'BR' &&
        children[1].tagName === 'SPAN'));
    },

    hasRunWithBr_: function(children) {
      if (children.length === 1 && children[0].tagName === 'SPAN' &&
          children[0].is !== 'qowt-line-break') {
        var child = children[0];
        return !!(child.children &&
          child.children.length &&
          child.children[0].tagName === 'BR');
      }
      return false;
    },

    hasEmptyRunsAndBr_ : function(children) {
      if (children.length === 3 && children[0].tagName === 'SPAN' &&
        children[1].tagName === 'SPAN' && children[2].tagName === 'BR') {
          return !(children[0].children && children[0].children.length) &&
          !(children[1].children && children[1].children.length);
        }
    },

    hasAllHiddenRuns_: function(children) {
      var allHidden = true;
      for (var i = 0; i < children.length && allHidden; i++) {
        var child = children[i];
        if(DomUtils.isField(child)) {
            if (child && child.get) {
              allHidden = child.get('hid');
            } else {
              allHidden = false;
            }
          } else {
            if (child && child.get) {
              allHidden = child.get('hid');
            }
          }
      }
      return allHidden;
    },

    hasEmptyRunAndBr: function() {
      var children = this.children;
      return children && (this.hasRunWithSiblingBr(children) ||
        this.hasRunWithBr_(children)) || this.hasAllHiddenRuns_(children);
    },

    hasOnlyPageBreak: function() {
      var children = this.children;
      return children.length === 1 &&
        children[0] instanceof QowtPageBreak;
    },

    characterFormattingChanged_: function(/* current, previous */) {
      if (this.characterFormatting) {
        this.customStyle['--paragraph-font-size'] =
            this.characterFormatting.siz ? this.characterFormatting.siz + 'pt' :
            'inherit';
        this.customStyle['--paragraph-font-weight'] =
            this.characterFormatting.bld ? 'bold' : 'normal';
        this.customStyle['--paragraph-font-style'] =
            this.characterFormatting.itl ? 'italic' : 'normal';
        this.customStyle['--paragraph-text-color'] =
            this.characterFormatting.clr || '';
        this.customStyle['--paragraph-font-family'] =
            this.characterFormatting.font || '';
        this.customStyle['--paragraph-strike-through'] =
            this.characterFormatting.str ? 'line-through' : '';
        this.customStyle['--paragraph-underline'] =
            this.characterFormatting.udl ? 'underline' : '';
        this.updateStyles();
      }
    },

    get paragraphMarginLeft() {
      return _.get(this, 'customStyle.--paragraph-margin-left');
    },

    set paragraphMarginLeft(val) {
      if (val) {
        this.customStyle['--paragraph-margin-left'] = val;
      }
    }
  };


  window.QowtWordPara = Polymer(MixinUtils.mergeMixin(
      QowtPara,
      // decorator mixins:
      Alignment,
      ContextualSpacing,
      FirstLineIndent,
      HangingIndent,
      LeftIndent,
      LineSpacing,
      ListItem,
      PageBreakBefore,
      ParagraphBackground,
      ParagraphBorders,
      ParagraphStyle,
      RightIndent,
      SpaceAfter,
      SpaceBefore,
      TabStop,
      FlowChildren,
      AddRunIfNeeded,
      IndentCorrection,

      // and finally our own api
      api_));

  return {};
});
