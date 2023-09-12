/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview polymer element for the Page.
 *
 * This element has a bunch of event listeners to spot both
 * changes to the headers/footers within a section, as well as
 * any changes that happen on the page itself.
 *
 * When changes happen, it can determine if the content has
 * grown or shrunk, in which case it will fire a page-changed which
 * in turn will cause the <qowt-msdoc> to (re)paginate this page.
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/flowChildren',
  'common/mixins/decorators/borderUtils',
  'qowtRoot/utils/converters/converter',
  'qowtRoot/utils/domUtils',
  'qowtRoot/utils/stringUtils',
  'qowtRoot/widgets/factory',
  'qowtRoot/pubsub/pubsub',
  'common/elements/document/header/header',
  'common/elements/document/footer/footer',
  'qowtRoot/third_party/mutationSummary/mutation_summary',
  'qowtRoot/utils/converters/twip2pt'
  ], function(
    MixinUtils,
    QowtElement,
    FlowChildren,
    BorderUtils,
    Converter,
    DomUtils,
    StringUtils,
    WidgetFactory,
    PubSub

    /* mutation_summary.js provides global MutationSummary object */
    ) {

  'use strict';

  var subscriptionTokens_ = [];

  var api_ = {
    is: 'qowt-page',
    properties: {
      isFirstPageInSection: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    },
    /**
     * Lifecycle callback. Called when the element instance is in the document
     * and all it's dependencies like CSS have been loaded
     */
    ready: function() {
      this.updateHeader_ = this.updateHeaderFooter_.bind(this, 'header');
      this.updateFooter_ = this.updateHeaderFooter_.bind(this, 'footer');

      this.addEventListener('header-changed', this.updateHeader_);
      this.addEventListener('footer-changed', this.updateFooter_);
      this.addEventListener('page-size-changed', this.updatePageSize_);
      this.addEventListener('page-margins-changed', this.updatePageMargins_);
      this.addEventListener('page-borders-changed', this.updatePageBorders_);

      // the bottom right most point of the content on
      // this page. We use this to identify if changes
      // on the page require us to fire a page-changed
      // event for pagination reasons.
      this.cachedContentBottomRightPos_ = {
        bottom: -1,
        right: -1
      };
      this.updateDrawingObjzIndex_ =  this.updateDrawingObjOrder_.bind(this);
      subscriptionTokens_.push(PubSub.subscribe('qowt:cmdgetDocContentStop',
        this.updateDrawingObjzIndex_));
      subscriptionTokens_.push(PubSub.subscribe('qowt:pageCountChanged',
        this.updateDrawingObjzIndex_));
      this.scopeSubtree(this.$.header,true);
      this.scopeSubtree(this.$.footer,true);
    },

    /**
     * Lifecycle callback. Called as soon as the element instance is
     * attached to the DOM.
     */
    attached: function() {
      // We use the mutation summary library rather than
      // the polymer sugar "this.onMutation" because we need
      // to be able to support ignoring mutations (eg disconnect)
      // Also, we want to know of ALL changes, including just char data
      // changed.
      // Note: the order in which mutation observers are called is based
      // on the order of CONSTRUCTION. Since we should always create
      // pages "in order", this is good news. It means that a mutation
      // on multiple pages will guarantee that the observers are called
      // "in order" and thus we paginate (reflow) from top down
      this.mutationObserver_ = new MutationSummary({
        rootNode: this,
        callback: this.handleMutations_.bind(this),
        queries: [{ all: true }],
      });

      // now that the page is added to the document, make sure to
      // trigger a pagination on it.
      this.fireChangedEvent();
    },

    /**
     * Lifecycle callback. Called when the element instance is removed
     * from the DOM
     */
    detached: function() {
      try {
        this.mutationObserver_.disconnect();
        subscriptionTokens_.forEach(function(token) {
          PubSub.unsubscribe(token);
        });
      } catch(e) {
        // ignore
      }
    },

    /**
     * Stop listening for changes on this page, and thus stop firing
     * page-changed events. This can be useful if we are doing something
     * on the page for which we do not want auto-paginate to kick in.
     * eg if we unflow elements prior to allowing the user to edit them.
     */
    ignoreMutations: function() {
      try {
        // Keep track of pending mutations so we can replay them later
        var pendingMutations = this.mutationObserver_.disconnect();
        if(pendingMutations) {
          this.handleMutations_(pendingMutations);
        }

      } catch(e) {
        // ignore
      }
    },

    /**
     * Listen for mutations on the page; resulting in page-changed events
     */
    listenForMutations: function() {
      try {
        this.mutationObserver_.reconnect();
      } catch(e) {
        // ignore
      }
    },

    /**
     * Force any outstanding mutations on the page to be handled. This is
     * mostly useful for unit testing if we want to force changes to be
     * handled synchronously.
     */
    takeMutations: function() {
      this.handleMutations_(this.mutationObserver_.takeSummaries());
    },

    /**
     * Checks if the page is overflowing; eg if there is too much content
     * on the page, and thus a (re)flow is required
     *
     * @return {boolean} returns true if the page is overflowing
     */
    isOverflowing: function() {
      var container = this.$.contentsContainer;
      return container.scrollHeight > container.offsetHeight;
    },

    /**
     * Returns the bounding box for the content on this page. This can
     * be used to pass to element's flow functions
     *
     * @return {boolean} returns the absolute bounding box for content
     */
    boundingBox: function() {
      return this.$.contentsContainer.getBoundingClientRect();
    },

    /**
     * Callback for when a flow algorithm is about to kick off. We ensure
     * we stop listening for further changes on the page so that we do not
     * get in to an eternal loop of monitoring changes.
     */
    onFlowStart: function() {
      // stop listening for mutations; we dont want our flow
      // algorithm to cause further flows to trigger
      this.ignoreMutations();
    },

    /**
     * Callback for when a flow algorithm is done. We listen for further
     * mutations again, and also cache our current content size. This helps
     * us only fire page-change events when the page's content truly changes
     * size later on.
     */
    onFlowEnd: function() {
      this.listenForMutations();
      this.cachedScrollHeight_ = this.$.contents.scrollHeight;
      this.cachedContentBottomRightPos_ = this.getContentBottomRightPos_();
      this.removeAttribute('pending-flow');
    },

    /**
     * Callback for when an unflow algorithm is about to kick off. Similar to
     * the onFlowStart, we also stop listening for further mutations. And
     * since we are about to unflow content on this page, we set our pending
     * flow attribute, because we will need to reflow the content later.
     * Unflow is used mainly prior to letting the user edit content.
     */
    onUnflowStart: function() {
      // stop listening for mutations; we dont want our flow
      // algorithm to cause further flows to trigger
      this.ignoreMutations();
      this.setAttribute('pending-flow', '');
    },

    /**
     * Callback for when an unflow algorithm is done. We basically start
     * listening for further changes again.
     */
    onUnflowEnd: function() {
      this.listenForMutations();
    },

    /**
     * @return {QowtHeader} return the correct header for the current page,
     *                      eg the odd/even/first-page or "both" header element
     */
    getHeader: function() {
      return this.getSpecificHeaderFooter_('header');
    },

    /**
     * @return {QowtFooter} return the correct footer for the current page,
     *                      eg the odd/even/first-page or "both" footer element
     */
    getFooter: function() {
      return this.getSpecificHeaderFooter_('footer');
    },

    /**
     * Return the number of content elements on this page. Ignores
     * <qowt-section> elements. In other words, returns the number
     * of children in all <qowt-section> elements on this page
     *
     * @return {Number} the number of content elements on this page
     */
    contentCount: function() {
      var elements = this.querySelectorAll('qowt-section > *');
      // Ignoring first 2 nodes (i.e. header and footer templates)
      var contentElements = Array.from(elements).splice(2);
      return contentElements.length;
    },

    /**
     * Return the "content" element at the given index. This is a
     * conveniance method to find content on a page whilst ignoring
     * the <qowt-section> elements. This is mainly used by unit and
     * E2E tests.
     *
     * @param {Number} offset zero indexed offset to content node
     * @return {HTMLElement} returns the element or undefined
     */
    getContentNode: function(offset) {
      var elements = this.querySelectorAll('qowt-section > *');
      // Ignoring first 2 nodes (i.e. header and footer templates)
      var contentElements = Array.from(elements).splice(2);
      return contentElements[offset];
    },

    /**
     * Helper function to get the first content node inside the first
     * section on this page. Mainly used by unit and E2E tests.
     *
     * @return {HTMLElement} returns the element or undefined
     */
    firstContentNode: function() {
      var content = this.querySelectorAll('qowt-section > *');
      // Ignoring first 2 nodes (i.e. header and footer templates)
      var firstContent = Array.from(content).splice(2);
      return firstContent[0];
    },


    /**
     * Helper function to get the last content node on this page.
     * Mainly used by unit and E2E tests.
     *
     * @return {HTMLElement} returns the element or undefined
     */
    lastContentNode: function() {
      var contentElements = this.querySelectorAll('qowt-section > *');
      return contentElements[contentElements.length - 1];
    },

    /**
     * Helper function to return either child element or legacy
     * widget. Ignores <qowt-section> elements, and looks only
     * for the children within sections
     * TODO(jliebrand): remove this once we have no more legacy widgets
     *
     * @param {Number} offset the offset within this elements children
     * @return {HTMLElement|Widget} returns the element, widget or undefined
     */
    getContentWidget: function(offset) {
      var elements = this.querySelectorAll('qowt-section > *');
      // Ignoring first 2 nodes (i.e. header and footer templates)
      var contentElements = Array.from(elements).splice(2);
      var el = contentElements[offset];
      if (el && !el.isQowtElement) {
        el = WidgetFactory.create({
          fromNode: el,
          strict: true
        });
      }
      return el;
    },

    setBackgroundColor: function(color) {
      this.style.background = color || "";
    },

    // ---------------------- PRIVATE ------------------
    handleMutations_: function() {
      // first check our scrollHeight against our cached scroll
      // height; if it's changed then fire page-changed and allow
      // for pagination.
      // If it has not changed, we could still require pagination;
      // imagine deleting one character on the final line of text
      // on the page. To spot this, we find the right most leaf
      // and if it's a text node, we select the final character
      // and compare ITs bounding box to our cached finalChar
      // bounding box.
      if (this.$.contents.scrollHeight !== this.cachedScrollHeight_) {
        this.fireChangedEvent();
      } else {
        var pos = this.getContentBottomRightPos_();
        if ((pos !== undefined) &&
          !_.isEqual(pos, this.cachedContentBottomRightPos_)) {
          this.fireChangedEvent();
        }
      }
    },

    fireChangedEvent: function() {
      this.setAttribute('pending-flow', '');
      this.cachedContentBottomRightPos_ = this.getContentBottomRightPos_();

      // debounce our change event in case
      // we get a lot of mutations in sequence
      // (like during dcp loading)
      this.debounce('fireChangedEvent', function() {
        this.fire('page-changed', {page: this});
      }, 0);

      // use the line below instead of a job if you want to debug
      // the pagination and ensure that when you select an element
      // in the dev console, it will highlight in the main window.
      // Using the job above (correctly) uses requestAnimationFrame
      // which means the debugger will stop at a point where the dev
      // console doesn't appear to be able to highlight the main window...
      // this.async('fire', ['page-changed', {page: this}], 100);
    },

    /**
     * @return {Object} returns an object containing the absolut bottom
     *                  and right position of content on the page
     */
    getContentBottomRightPos_: function() {
      var thisBox = this.getBoundingClientRect();
      var pos;
      var node = DomUtils.rightMostLeafNode(this);
      if (node && node.nodeType === Node.TEXT_NODE &&
          node.textContent.length > 0) {
        var range = document.createRange();
        range.setStart(node, node.textContent.length-1);
        range.setEnd(node, node.textContent.length);
        var boxList = range.getClientRects();
        if (boxList.length > 0) {
          var box = boxList[0];
          pos = {
            bottom: thisBox.bottom - box.bottom,
            right: thisBox.right - box.right
          };
        }
      }
      return pos;
    },

    pageType_: function() {
      if (!this.previousElementSibling) {
        return 'first-page';
      }
      var pageNum = DomUtils.peerIndex(this) + 1;
      return (pageNum % 2 === 0) ? 'even' : 'odd';
    },


    getSpecificHeaderFooter_: function(headerFooter) {
      // confusingly sections can have "differentFirstPage" even if the
      // section is not the first section in the document... eg it refers
      // to the first page that shows the section. So we need to determine
      // if our section has any flowFrom; if not, this page is the first
      // page for this section...
      var section = this.querySelector('qowt-section');
      var firstPageForSection = section.flowFrom === undefined;

      var selector;
      var pageType = this.pageType_();
      var hf = headerFooter === 'header' ? this.$.header : this.$.footer;

      // determine which type is applicable based on DifferentFirstPage (dfp)
      // and DifferentOddEven (doe) settings of header/footer
      if (firstPageForSection) {
        selector = hf.dfp ? 'first-page' : hf.doe ? 'odd' : 'both';
      } else {
        switch (pageType) {
          case 'even':
          case 'odd':
            selector = hf.doe ? pageType : 'both';
            break;

          default:
            selector = 'both';
            break;
        }
      }

      // only return the specific header/footer if it is displayed!
      selector = '[type=' + selector + ']';
      var specificHF = hf.querySelector(selector);
      if (specificHF) {
        var computedStyle = window.getComputedStyle(specificHF);
        if (computedStyle && computedStyle.display === 'none') {
          specificHF = undefined;
        }
      }
      return specificHF;
    },

    updateHeaderFooter_: function(type, event) {
      var target = (type === 'header') ? this.$.header : this.$.footer;
      // only update header/footer information
      // if it's the FIRST section on the page
      var section = this.querySelectorAll('qowt-section')[0];
      if (event.srcElement === section) {
        this.isFirstPageInSection = (section === section.flowStart());
        target.clear();
        var content = (type === 'header') ?
            section.getHeaderContent() : section.getFooterContent();
        /**
         * Supporting custom tab stops in 2 parts,
         * Part 1 - Rendering in Header and Footer.
         * Part 2 - Rendering/Editing in Main Document
         * For Part 1, adding the extra attribute to paragraph to
         * differentiate the paragraph from header, footer or main document.
         * This extra attribute will remove once Part 2 is supported.
         */
        var elements = content.querySelectorAll('div > *');
        for (var i = 0; i < elements.length; i++) {
          if (elements[i] instanceof QowtWordPara) {
            elements[i].setAttribute('qowt-paratype', 'hf-para');
          }
        }
        if (content) {
          Polymer.dom(target).appendChild(content);
          Polymer.dom(target).flush();
        }
        target.dfp = (section.differentFirstPage || false);
        target.doe = (section.differentOddEven || false);
        if (target.hasContent() && type === 'header') {
          target.setEid(section.headerId);
          target.style.paddingTop = section.headerDistanceFromTop + 'pt';
        } else if (target.hasContent()) {
          target.setEid(section.footerId);
          target.style.paddingBottom = section.footerDistanceFromBottom + 'pt';
        }
        // Top and bottom page margins depend on headerDistanceFromTop and
        // footerDistanceFromBottom, so we must update them
        this.updatePageMargins_(event);
      }
    },

    updatePageSize_: function(event) {
      // only update page size if it came from
      // the FIRST section on the page
      var section = this.querySelectorAll('qowt-section')[0];
      if (event.srcElement === section) {
        // we don't have to take orientation into account here, because the
        // office file format gives the correct width/height when section is
        // landscape.  See section json schema for details
        if (section.pageSize) {
          if (section.pageSize.width !== undefined) {
            this.style.width = Converter.twip2pt(section.pageSize.width) + 'pt';
          }
          if (section.pageSize.height !== undefined) {
            this.style.height =
                Converter.twip2pt(section.pageSize.height) + 'pt';
          }
        }
      }
    },

    updatePageMargins_: function(event) {
      // only update page size if it came from
      // the FIRST section on the page
      var section = this.querySelectorAll('qowt-section')[0];
      if (event.srcElement === section) {

        var margins = section.pageMargins;
        if (margins && !isNaN(margins.top)) {
          // TODO(ghyde): We should not rely on the header margin here
          // because it is possible for the top margin to be less than the
          // header margin.
          // In that case, office shrinks the header if it is empty,
          // but we leave the header at full size

          // If header has no content (ie. there is no header) then the minimum
          // height of the block must equal the top margin, which specifies the
          // distance between the text margins for the main document and the top
          // of the page.
          var headerMargin = section.headerDistanceFromTop || 0;
          var headerMinHeight = this.$.header.hasContent() ? Math.max(0,
              Math.floor(margins.top - headerMargin)) : margins.top;
          this.$.header.style.minHeight = headerMinHeight + 'pt';
        }
        if (margins && !isNaN(margins.left)) {
          var leftPadding = Math.floor(margins.left) + 'pt';
          this.$.header.style.paddingLeft = leftPadding;
          this.$.footer.style.paddingLeft = leftPadding;
          this.$.contentsContainer.style.paddingLeft = leftPadding;
        }
        if (margins && !isNaN(margins.right)) {
          var rightPadding = Math.floor(margins.right) + 'pt';
          this.$.header.style.paddingRight = rightPadding;
          this.$.footer.style.paddingRight = rightPadding;
          this.$.contentsContainer.style.paddingRight = rightPadding;
        }
        if (margins && !isNaN(margins.bottom)) {
          // See comment on top margin
          var footerMargin = section.footerDistanceFromBottom || 0;
          var footerMinHeight = this.$.footer.hasContent() ? Math.max(0,
              Math.floor(margins.bottom - footerMargin)) : margins.bottom;
          this.$.footer.style.minHeight = footerMinHeight + 'pt';
        }
      }
    },


    getAllDrawingObjsForPage_: function() {
      var drawingObjsInPage = this.querySelectorAll('qowt-drawing');
      var drawingObjsInHeader = this.$.header.querySelectorAll('qowt-drawing');
      var drawingObjsInFooter = this.$.footer.querySelectorAll('qowt-drawing');

      var drawingObjs = [];
      if (drawingObjsInPage.length > 0) {
        drawingObjs.push(drawingObjsInPage);
      }
      if (drawingObjsInHeader.length > 0) {
        drawingObjs.push(drawingObjsInHeader);
      }
      if (drawingObjsInFooter.length > 0) {
        drawingObjs.push(drawingObjsInFooter);
      }

      return drawingObjs;
    },

    assignDefaultZIndex_: function (drawingObj) {
      if (drawingObj.isWrappedBehindText()) {
        drawingObj.style.zIndex = -1;
      } else {
        drawingObj.style.zIndex = 0;
      }
    },


    updateDrawingObjOrder_: function () {

      var drawingObjs = this.getAllDrawingObjsForPage_();

      var totalDrawingObjCount = drawingObjs.length;

      if (totalDrawingObjCount > 0) {

        for (var d = 0; d < totalDrawingObjCount; d++) {

          var allDrawingObjs = drawingObjs[d];
          var totalDrawingObjs = allDrawingObjs.length;

          var mapBehindText = {}, mapOtherDrawingObj = {};
          var behindTextRelHeightsArray = [],
            otherDrawingObjRelHeightsArray = [];

          // Extract out drawing objects based on different wrap styles
          for (var i = 0; i < totalDrawingObjs; i++) {
            if (allDrawingObjs[i].isWrappedBehindText()) {
              behindTextRelHeightsArray.push(allDrawingObjs[i].relativeHeight);
            } else {
              otherDrawingObjRelHeightsArray.push(
                allDrawingObjs[i].relativeHeight);

            }
          }

          // Sort behind text array in descending order so that its easy to
          // assign z-index starting from -1 to the top most entry in array and
          // gradually decrease the z-index value for further entries.
          var behindTextRelHeights = behindTextRelHeightsArray.sort().reverse();

          var otherDrawingObjRelHeights = otherDrawingObjRelHeightsArray.sort();

          var lenBehindTextArray = behindTextRelHeights.length;
          var lenOtherDrawingObj = otherDrawingObjRelHeights.length;

          for (var j = 0; j < lenOtherDrawingObj; j++) {
            mapOtherDrawingObj[otherDrawingObjRelHeights[j]] = j + 1;
          }

          for (var zIndex = -1, b = 0; b < lenBehindTextArray; zIndex--, b++) {
            mapBehindText[behindTextRelHeights[b]] = zIndex;
          }

          // Assign z-index to drawing objects
          for (var idx = 0; idx < totalDrawingObjs; idx++) {
            if (allDrawingObjs[idx].relativeHeight) {
              if (allDrawingObjs[idx].isWrappedBehindText()) {
                allDrawingObjs[idx].style.zIndex =
                  mapBehindText[allDrawingObjs[idx].relativeHeight];
              } else {
                allDrawingObjs[idx].style.zIndex =
                  mapOtherDrawingObj[allDrawingObjs[idx].relativeHeight];
              }
            } else {
              this.assignDefaultZIndex_(allDrawingObjs[idx]);
            }
          }
        }
      }

    },


    /*
     *  Check whether page borders should be shown on this page
     *
     *  @param borders DCP object for page borders (from section)
     *  @return {boolean} returns whether page borders should be shown
     */
    shouldApplyBorders_: function(borders) {
      var firstPage = this.previousElementSibling === null;
      if (borders.pages === 'allButFirst') {
        return !firstPage;
      } else if (borders.pages === 'first') {
        return firstPage;
      } else {
        return true;
      }
    },

    /*
     *  Apply margins to page border div to ensure correct placement
     *  of the borders
     *
     *  @param borderNode HTMLNode for border div
     *  @param borders DCP object for page borders (from section)
     *  @param margins DCP object for page margins (from section)
     *  @return {boolean} returns margin for each side (in array)
     */
    setPageBorderMargins_: function(borderNode, borders, margins) {
      var borderMargins = {};
      var borderSides = ['left', 'top', 'right', 'bottom'];
      borderSides.forEach(function(side) {
        // spacing gives offset of border from text or edge of the page
        var spacing = (borders[side] && borders[side].spacing) ?
            borders[side].spacing : 0;
        // if offset from page, the spacing indicates the distance between
        // the edge of the page and the borders (ie the margin)
        // if offset from text, the spacing is subtracted from the margins
        // to add space between the text and borders
        borderMargins[side] = ((borders.offsetFrom === 'page') ?
            spacing : (margins[side] - spacing));
        var capitalizedSide = StringUtils.titleCase(side);
        borderNode.style['margin' + capitalizedSide] =
            borderMargins[side] + 'pt';
      });
      return borderMargins;
    },

    /*
     *  Set dimensions of border div to overlap with the page.  This
     *  basically takes the size of the page and subtracts the margins
     *
     *  @param borderNode HTMLNode for border div
     *  @param pageSize DCP object for page size (from section)
     *  @param borderMargins array of margins on the borderNode
     */
    setPageBorderSize_: function(borderNode, pageSize, borderMargins) {
      // borderNode must exactly overlap the page, so the width of the
      // div is the page width minus the border margins.
      borderNode.style.top = 0;
      borderNode.style.right = 0;
      if (pageSize.width !== undefined) {
        borderNode.style.width = Converter.twip2pt(pageSize.width) -
            borderMargins.left - borderMargins.right + 'pt';
      }
      if (pageSize.height !== undefined) {
        borderNode.style.height = Converter.twip2pt(pageSize.height) -
            borderMargins.top - borderMargins.bottom + 'pt';
      }
    },

    /*
     * This function updates the page borders for this page from the first
     * section of the page.  Page borders have their own div element, so
     * margins and position are adjusted according to the model, and then
     * the actual borders are applied
     */
    updatePageBorders_: function(event) {
      // only update page borders if it came from
      // the FIRST section on the page
      var section = this.querySelectorAll('qowt-section')[0];
      if (event.srcElement === section) {
        var borders = section.pageBorders;
        var margins = section.pageMargins;
        var pageSize = section.pageSize;
        var borderNode = this.$.pageBorders;
        if (borders && margins && pageSize) {
          var borderMargins = this.setPageBorderMargins_(borderNode,
              borders, margins);
          this.setPageBorderSize_(borderNode, pageSize, borderMargins);
          // TODO(ghyde): take Z Order into account
          // Apply Borders
          if (this.shouldApplyBorders_(borders)) {
            BorderUtils.setBorderSide(borderNode, 'top', borders.top);
            BorderUtils.setBorderSide(borderNode, 'bottom', borders.bottom);
            BorderUtils.setBorderSide(borderNode, 'left', borders.left);
            BorderUtils.setBorderSide(borderNode, 'right', borders.right);
          }
        }
      }
    }
  };


  var QowtPageProto = MixinUtils.mergeMixin(QowtElement, FlowChildren, api_);

  window.QowtPage = Polymer(QowtPageProto);

  return {};
});
