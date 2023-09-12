/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * @fileoverview MS Section element. Sections keep template copies
 * of the header and footer, which (when set by the dcp handlers) will
 * trigger a 'header-changed' event. Indeed, most of the setters
 * on this element merely ensure state is kept and events are fired.
 * The page element listens for these events and will adjust it's
 * headers/footers/size/margin/etc etc
 *
 * @author jelte@google.com (Jelte Liebrand)
 */
define([
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'common/mixins/decorators/differentFirstPage',
  'common/mixins/decorators/differentOddEven',
  'common/mixins/decorators/footerFromBottom',
  'common/mixins/decorators/headerFromTop',
  'common/mixins/decorators/pageHeight',
  'common/mixins/decorators/pageWidth',
  'common/mixins/decorators/sectionBorders',
  'common/mixins/decorators/sectionBreakType',
  'common/mixins/decorators/sectionBottomMargin',
  'common/mixins/decorators/sectionColumn',
  'common/mixins/decorators/sectionLeftMargin',
  'common/mixins/decorators/sectionOrientation',
  'common/mixins/decorators/sectionRightMargin',
  'common/mixins/decorators/sectionTopMargin',
  'common/mixins/flowChildren',
  'qowtRoot/utils/domUtils'], function(
    MixinUtils,
    QowtElement,
    DifferentFirstPage,
    DifferentOddEven,
    FooterFromBottom,
    HeaderFromTop,
    PageHeight,
    PageWidth,
    SectionBorders,
    SectionBreakType,
    SectionBottomMargin,
    SectionColumn,
    SectionLeftMargin,
    SectionOrientation,
    SectionRightMargin,
    SectionTopMargin,
    FlowChildren,
    DOMUtils) {

  'use strict';

  var api_ = {
    is: 'qowt-section',

    properties: {
      headerDistanceFromTop: {
        type: Number,
        value: 0,
        observer: 'headerDistanceFromTopChanged'
      },

      footerDistanceFromBottom: {
        type: Number,
        value: 0,
        observer: 'footerDistanceFromBottomChanged'
      }
    },

    // the DCP definiton for this element; used by QowtElement on
    // construction and set in our model so any new element will have it
    etp: 'sct',

    created: function() {
      QowtElement.created.call(this);

      this.headerId = undefined;
      this.footerId = undefined;
      this.pageSize = {};
      this.pageMargins = {};
      this.pageBorders = {};

      this.differentFirstPage = false;
      this.differentOddEven = false;
      this.copiedPreviousHF = false;
    },

    ready: function() {
      // listen for any updates to our header and footer templates
      this.listenForHeaderFooterUpdates_();
    },

    attached: function() {
      // inherit headers and footers from previous section.  Will be overriden
      // by getHFItem_ if this section has unique h/f
      var prevSection = this.flowStart().previousElementSibling;
      if (prevSection && prevSection instanceof QowtSection &&
          !this.copiedPreviousHF) {
        this.$.headerTemplates.content.appendChild(
            prevSection.getHeaderContent());
        this.$.footerTemplates.content.appendChild(
            prevSection.getFooterContent());
        this.copiedPreviousHF = true;
      }
      this.fire('header-changed');
      this.fire('footer-changed');
      this.fire('page-margins-changed');
      this.fire('page-size-changed');
      this.fire('page-borders-changed');
    },

    // using our own setter rather than observing
    // the attribute; observe callbacks happen on the
    // next micro task; we need them happening synchronously
    setPageMargins: function(pageMargins) {
      this.pageMargins = pageMargins;
      this.fire('page-margins-changed');
    },

    differentFirstPageChanged: function() {
      this.fire('header-changed');
      this.fire('footer-changed');
    },
    differentOddEvenChanged: function() {
      this.fire('header-changed');
      this.fire('footer-changed');
    },
    headerDistanceFromTopChanged: function() {
      this.fire('header-changed');
    },
    footerDistanceFromBottomChanged: function() {
      this.fire('footer-changed');
    },

    // using our own setter rather than observing
    // the attribute; observe callbacks happen on the
    // next micro task; we need them happening synchronously
    setPageSize: function(pageSize) {
      this.pageSize = pageSize;
      this.fire('page-size-changed');
    },

    // using our own setter rather than observing
    // the attribtue; observe callbacks happen on the
    // next micro task; we need them happening synchronously
    setPageBorders: function(pageBorders) {
      this.pageBorders = pageBorders;
      this.fire('page-borders-changed');
    },

    // Get header item for specific type (eg odd/even/both/first-page)
    // used by dcp handler to grab the right target for items
    getHeaderItem: function(type, currentElement) {
      return this.getHFItem_('header', type, currentElement);
    },

    // Get footer item for specific type (eg odd/even/both/first-page)
    // used by dcp handler to grab the right target for items
    getFooterItem: function(type, currentElement) {
      return this.getHFItem_('footer', type, currentElement);
    },

    // get all header content (used by page to update it's header)
    getHeaderContent: function() {
      return DOMUtils.cloneNode(this.$.headerTemplates.content,
          true /* opt_deep */, true /* opt_import */);
    },

    // get all footer content (used by page to update it's footer)
    getFooterContent: function() {
      return DOMUtils.cloneNode(this.$.footerTemplates.content,
          true /* opt_deep */, true /* opt_import */);
    },

    getColumnCount: function() {
      return this.model.col || 1;
    },

    cloneMe: function(opt_import) {
      var clone = QowtElement.cloneMe.call(this, opt_import);
      clone.pageSize = this.pageSize;
      clone.pageMargins = this.pageMargins;
      clone.pageBorders = this.pageBorders;
      clone.differentFirstPage = this.differentFirstPage;
      clone.differentOddEven = this.differentOddEven;
      clone.headerDistanceFromTop = this.headerDistanceFromTop;
      clone.footerDistanceFromBottom = this.footerDistanceFromBottom;
      clone.copiedPreviousHF = this.copiedPreviousHF;
      clone.$.headerTemplates.content.appendChild(this.getHeaderContent());
      this.addScopeToClonedHeaderFooter_(clone.$.headerTemplates.content);
      clone.$.footerTemplates.content.appendChild(this.getFooterContent());
      this.addScopeToClonedHeaderFooter_(clone.$.footerTemplates.content);
      return clone;
    },

    getLastElement: function() {
      var lastElement = Polymer.dom(this).lastElementChild;

      if (!lastElement && this.lastHFItem) {
        lastElement = this.lastHFItem.lastElementChild;
      }

      if(lastElement instanceof QowtTable &&
        lastElement.supports('flow')) {
        var lastTd = lastElement.querySelectorAll('td:last-child');
        if(lastTd.length === 1 && lastTd[0].isEmpty()) {
          var id = lastTd[0].getAttribute('qowt-eid');
          var elements = document.querySelectorAll('[qowt-eid='+id+']');
          //as the value 'lastTd' we get in case of flowing table is empty
          //we should find element from which this 'lastTd' was flowed  from.
          //For that we have added further code to find appropriate element
          var ele = elements[elements.length - 2];
          lastElement = !(ele.isEmpty()) ? ele : elements[0];
        }
      }

      // In word, there can be paragraphs inside the paragraph/table eg.
      // paragraph may contain drawing element which further contains paragraphs
      // in text boxes. We need to fetch the last paragraph inside the text box.
      if (lastElement) {
        var paras = lastElement.querySelectorAll('p:last-child');
        lastElement = paras.length > 0 ? paras[paras.length - 1] : lastElement;
      }

      return lastElement;
    },


    // ------------------------- PRIVATE ------------------------

    // During the cloning process of the header and footer, the class scope
    // gets missed from the child element of the header and footer. Due to
    // this issue, the page content height gets incorrectly calculate. To
    // resolve the page height issue, we need to explicitly add class scope
    // to the child element of the header and footer.
    addScopeToClonedHeaderFooter_: function(content) {
      if (Polymer.dom(this).parentNode._scopeElementClass) {
        var scopify = Polymer.dom(this).parentNode._scopeElementClass(this);
        content.querySelectorAll(':scope > div').forEach(function(node){
          node.setAttribute('class', scopify);
        });
      }
    },

    listenForHeaderFooterUpdates_: function() {
      var headers = this.$.headerTemplates.content;
      var footers = this.$.footerTemplates.content;
      this.onMutation(headers, this.headerTemplatesUpdated_);
      this.onMutation(footers, this.footerTemplatesUpdated_);
    },

    // By default, we copy the header and footers from the previous section
    // This method is called by the header/footerItemHandler, meaning that
    // we should override the item we inherited from the prev section
    // for the type specified (linking to prev is on a per-type basis)
    getHFItem_: function(hf, type, currentElement) {
      var source = (hf === 'header') ?
          this.$.headerTemplates :
          this.$.footerTemplates;

      var item = source.content.querySelector('[type=' + type + ']');
      if (item && currentElement && item.id === currentElement.eid) {
        // Header/Footer is already processed partially in prev dcp response
        // from core, need to just update the respective templates.
        this.lastHFItem = item;
        return item;
      }
      var newItem = document.createElement('div');
      newItem.setAttribute('type', type);
      if (item) {
        source.content.replaceChild(newItem, item);
      } else {
        source.content.appendChild(newItem);
      }
      this.lastHFItem = newItem;
      return newItem;
    },

    headerTemplatesUpdated_: function() {
      this.listenForHeaderFooterUpdates_();
      this.fire('header-changed');
    },

    footerTemplatesUpdated_: function() {
      this.listenForHeaderFooterUpdates_();
      this.fire('footer-changed');
    },

    getSection_: function() {
      return this;
    }
  };


  /* jshint newcap: false */
  window.QowtSection = Polymer(
      MixinUtils.mergeMixin(QowtElement,
          DifferentFirstPage,
          DifferentOddEven,
          FooterFromBottom,
          HeaderFromTop,
          PageHeight,
          PageWidth,
          SectionBorders,
          SectionBreakType,
          SectionBottomMargin,
          SectionColumn,
          SectionLeftMargin,
          SectionOrientation,
          SectionRightMargin,
          SectionTopMargin,
          FlowChildren,
          api_));
  /* jshint newcap: true */

  return {};
});
