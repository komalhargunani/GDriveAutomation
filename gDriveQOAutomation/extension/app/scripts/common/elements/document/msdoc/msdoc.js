define([
  'qowtRoot/models/env',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/selection/selectionManager',
  'common/correction/selectionCorrection',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/tools/text/textTool',
  'qowtRoot/utils/domListener',
  'common/elements/document/page/page',
  'third_party/lo-dash/lo-dash.min'], function(
    EnvModel,
    PubSub,
    SelectionManager,
    SelectionCorrection,
    MixinUtils,
    QowtElement,
    TextTool,
    DomListener
    /* qowt-page */
    /* lo-dash */) {
  'use strict';

  var subscriptionTokens_ = [];

  // The polymer element representing the MS Doc itself. This element replaces
  // the old "Document layout control", and provides things like zooming as well
  // as listening for page-changed events so that it can auto-paginate the
  // document
  var api_ = {
    is: 'qowt-msdoc',

    // The DCP definiton for this element; used by QowtElement on construction
    // and set in our model so any new element will have it
    etp: 'doc',

    properties: {
      scale: {
        type: Number,
        value: 1,
        observer: 'scaleChanged'
      }
    },

    ZOOM_STEP: 0.1,
    MAX_ZOOM: 5,
    MIN_ZOOM: 0.2,
    ZOOM_PAGE_FIT_GUTTER: 0.005,

    attached: function() {
      this.listenForPageChanges_();
      var onSelectionChange = this.selectionChanged_.bind(this);
      document.addEventListener('selectionchange', onSelectionChange);
      subscriptionTokens_.push(
      PubSub.subscribe('qowt:cmddeleteTextStop', onSelectionChange));
      // TODO(tushar.bende): Remove this when browser selection issue on double
      // click (crbug/788646) get fix
      var onDoubleClick = SelectionCorrection.doubleClicked.
          bind(SelectionCorrection);
      document.addEventListener('dblclick', onDoubleClick);
      var docContainer = document.getElementById('qowt-msdoc');
      DomListener.addListener(docContainer, 'click', _blurToolbar, true);
      var onFocusChange = this.focusChanged_.bind(this);
      subscriptionTokens_.push(
          PubSub.subscribe('qowt:selectionChanged', onFocusChange));
      this.addEventListener('background-changed',
          this.updateDocumentBackground_.bind(this), false);
    },


    detached: function() {
      this.ignorePageChanges_();
      subscriptionTokens_.forEach(function(token) {
        PubSub.unsubscribe(token);
      });
    },


    /**
     * Note: not using standard polymer attribute observer
     * (eg autoPaginateChanged(old,new)) because that fires in the next micro
     * task. We want this setting to be synchronous so that unit tests can turn
     * off auto pagination
     * @param {boolean} on indicates if auto-paginate should be on or off
     */
    autoPaginate: function(on) {
      if (on) {
        this.listenForPageChanges_();
      } else {
        this.ignorePageChanges_();
      }
    },


    listenForMutations: function() {
      // Re-enable the pages listening for mutations again so that the
      // subsequent edit that will happen WILL be picked up, and it WILL cause a
      // re-paginate
      var pages = this.querySelectorAll('qowt-page');
      for (var i = 0; i < pages.length; i++) {
        pages[i].listenForMutations();
      }
      this.listenForPageChanges_();
    },


    ignoreMutations: function() {
      // Make sure all pages ignore any changes we make during unflow since we
      // do NOT want to paginate because of unflowing
      var pages = this.querySelectorAll('qowt-page');
      for (var i = 0; i < pages.length; i++) {
        pages[i].ignoreMutations();
      }
      this.ignorePageChanges_();
    },


    zoomIn: function() {
      this.scale = Math.min(this.scale + this.ZOOM_STEP, this.MAX_ZOOM);
    },


    zoomOut: function() {
      this.scale = Math.max(this.scale - this.ZOOM_STEP, this.MIN_ZOOM);
    },


    zoomToWidth: function() {
      // Zoom to page width if we have a visible page and a container else just
      // zoom to scale 1
      var parentNode = Polymer.dom(this).parentNode;
      var containerWidth = parentNode && parentNode.offsetWidth;
      var page = this.currentVisiblePage_();
      this.scale = (page && containerWidth) ?
          (containerWidth / page.offsetWidth) - this.ZOOM_PAGE_FIT_GUTTER : 1;
    },


    zoomFullPage: function() {
      // Zoom to page height if we have a visible page and a container else just
      // zoom to scale 1
      var parentNode = Polymer.dom(this).parentNode;
      var containerHeight = parentNode && parentNode.offsetHeight;
      var page = this.currentVisiblePage_();
      this.scale = (page && containerHeight) ?
          (containerHeight / page.offsetHeight) - this.ZOOM_PAGE_FIT_GUTTER : 1;
    },


    zoomActualSize: function() {
      this.scale = 1;
    },


    scaleChanged: function(newScale, oldScale) {
      if (oldScale && newScale !== oldScale) {
        // Revert scroll to original
        var inverse = 1 / oldScale;
        var parentNode = Polymer.dom(this).parentNode;
        parentNode.scrollTop = parentNode.scrollTop * inverse;
        // Do the actual zoom
        this.$.zoomable.style['-webkit-transform'] = 'scale(' + newScale + ')';
        var scaledWidth = this.$.zoomable.offsetWidth * newScale;
        if (scaledWidth > this.offsetWidth) {
          // Our zoomable is bursting out of our qowt-doc, so make sure we set
          // our transform-origin-x to zero, or else it bursts out to the left
          // where the scrollbars dont reach
          this.style['justify-content'] = 'flex-start';
          this.$.zoomable.style['-webkit-transform-origin-x'] = '0%';
        } else {
          // Reset to defaults
          this.style['justify-content'] = '';
          this.$.zoomable.style['-webkit-transform-origin-x'] = '';
        }
        // Now set scroll based on new scale
        parentNode.scrollTop = parentNode.scrollTop * newScale;
        PubSub.publish('qowt:msDocScaleChanged', {});
      }
    },


    paginate: function(page) {
      var oldPageCount =
        Polymer.dom(document).querySelectorAll('qowt-page').length;
      if (page === undefined) {
        // Get the first page
        page = Polymer.dom(this).querySelector('qowt-page');
      }
      // Make sure we dont bother paginating pages which are not in the document
      if (page instanceof QowtPage && document.body.contains(page)) {
        TextTool.debugSuppress();
        var snapshot = SelectionManager.snapshot();
        // Further more only paginate if the page is overflowing or if it has a
        // flowInto to pull content from or if it contains a break
        if (page.isOverflowing() || page.flowInto || page.containsFlowBreak()) {
          var nextPage;
          if (!page.flowInto) {
            nextPage = page.createFlowInto();
          }
          try {
            page.flow(page);
            // Add the page if we still have it (it could have been removed if
            // there was nothing to flow on to it)
            if (nextPage && !nextPage.isEmpty()) {
              Polymer.dom(this).appendChild(nextPage);
              Polymer.dom(this).flush();

            }
          } catch(e) {
            // Make sure the next page doesn't trigger further pagination; we've
            // already blown up so we dont want to get in to a potential eternal
            // loop where each nextPage creates another nextPage all with
            // mutations firing
            if (nextPage) {
              nextPage.ignoreMutations();
            }
            throw e;
          }
        } else {
          // Fake the onFlow start/end callbacks for pages that don't require
          // flow. This allows them to still clean up if needed
          if (page.onFlowStart) {page.onFlowStart();}
          if (page.onFlowEnd) {page.onFlowEnd();}
        }
        page.normalizeFlow();
        TextTool.debugUnsuppress();
        SelectionManager.restoreSnapshot(snapshot);
        var rootNode = EnvModel.rootNode;
        var pendingFlow = document.querySelector('[pending-flow]');
        // Reset the scrollTop if there is enough scrollHeight available
        if (this.cachedScrollTop_ &&
            (this.cachedScrollTop_ < rootNode.scrollHeight) && !pendingFlow) {
          rootNode.scrollTop = this.cachedScrollTop_;
          this.cachedScrollTop_ = undefined;
        }
        this.updatePageCount_(oldPageCount);
      }
    },

    cacheScrollTop: function(blockNode) {
      // cache the rootNode's scrollTop if the blockNode is flowing and it
      // is not the flow's start. Also check that the page which contains the
      // blockNode has not unflowed, otherwise wrong scrollTop will be set
      var page = blockNode.closest('qowt-page');
      var blockNodeIsFlowing = (blockNode && blockNode.isFlowing &&
          blockNode.isFlowing() && blockNode !== blockNode.flowStart());
      if (blockNodeIsFlowing && !page.hasAttribute('pending-flow')) {
        var rootNode = EnvModel.rootNode;
        this.cachedScrollTop_ = rootNode.scrollTop;
      }
    },


    /**
     * Opens a dialog showing the page, word and character counts in the doc.
     */
    showWordCountDialog: function() {
      if (!document.querySelector('dialog')) {
        var dialog = new QowtWordCountDialog();
        dialog.show();
      }
    },


    /**
     * @private
     * This element will initialise (ie place) the caret as soon as we have any
     * meaningful content
     */
    caretInitialised_: false,
    initialiseCaret_: function() {
      if (!this.caretInitialised_) {
        // Set the selection at the start of the document
        var firstContentElement =
          Polymer.dom(this).querySelector('qowt-section  p');
        if (firstContentElement) {
          // Finally give ourselves focus both from a browsers perspective as
          // well as a QOWT perspective
          this.focus();
          var range = document.createRange();
          range.setStart(firstContentElement, 0);
          range.setEnd(firstContentElement, 0);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          if (sel.rangeCount > 0) {
            this.caretInitialised_ = true;
            var context = sel.getRangeAt(0);
            context.contentType = 'text';
            context.scope = this;
            PubSub.publish('qowt:requestFocus', context);
          }
        }
      }
    },

    /**
     * @private
     */
    selectionChanged_: function() {
      // We reset the caret often for various reasons (eg during flowing or when
      // converting newly added elements to QowtElements). Most of the time the
      // logical position doesn't change. So we use the SelectionManager's
      // snapshots (which are a logical representation of the selection), and
      // only fire a qowt:updateSelection if the selection truly changed
      var newSnapshot = SelectionManager.snapshot();
      if (!SelectionManager.compareSnapshots(this.snapshot_, newSnapshot)) {
        this.snapshot_ = newSnapshot;
        var sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          var range = sel.getRangeAt(0);
          if (this.contains(range.startContainer) ||
              this.contains(range.endContainer)) {
            var context = {};
            context.isCollapsed = sel.isCollapsed;
            context.startContainer = range.startContainer;
            context.endContainer = range.endContainer;
            context.startOffset = range.startOffset;
            context.endOffset = range.endOffset;
            context.contentType = 'text';
            context.scope = this;
            var oldContext = SelectionManager.getSelection();
            var signal = _.get(oldContext, 'contentType') === 'text' ?
                'qowt:updateSelection' : 'qowt:requestFocus';
            PubSub.publish(signal, context);
          }
        }
      }
    },

    /**
     * When another element gets focus, the msdoc element will lose editability.
     * When focus is returned, it will gain it back.
     * @param {Object} eventData The data associated with the signal.
     */
    focusChanged_: function(/*event, eventData*/) {
      var eventData = arguments[1];
      if (eventData) {
        var oldScope = eventData.oldSelection && eventData.oldSelection.scope;
        var newScope = eventData.newSelection && eventData.newSelection.scope;
        if (oldScope && newScope && oldScope !== newScope) {
          if (oldScope === this) {
            this.contentEditable = 'false';
          } else if (newScope === this) {
            this.contentEditable = 'true';
          }
        }
      }
    },


    /** @private */
    listenForPageChanges_: function() {
      this.addEventListener('page-changed', this.handlePageChanged_);
    },


    /** @private */
    ignorePageChanges_: function() {
      this.removeEventListener('page-changed', this.handlePageChanged_);
    },


    /** @private */
    handlePageChanged_: function(evt) {
      this.initialiseCaret_();
      this.paginate(evt.detail.page);
    },


    /**
     * @private
     * Checks if the page count has changed and fires an event if it has it is
     * used to keep page numbers and page counts updated
     */
    updatePageCount_: function(oldPageCount) {
      var newPageCount =
        Polymer.dom(document).querySelectorAll('qowt-page').length;
      if (oldPageCount !== newPageCount) {
        // Use window.requestAnimationFrame to schedule the update after the new
        // microtask so the update is not overwritten by copying the
        // headers/footers from the page it is flowing from
        window.requestAnimationFrame(function() {
          PubSub.publish('qowt:pageCountChanged', {});
        });
      }
    },


    /** @private */
    currentVisiblePage_: function() {
      var el;
      var pointX = window.innerWidth / 2;
      var pointY = window.innerHeight / 2;
      // Get the element located in the middle of our rect, repeat in case
      // elementFromPoint hitTests in between pages
      do {
        el = window.document.elementFromPoint(pointX, pointY);
        pointY -= 10;
      } while (((el !== null) && (el === this)) && (pointY > 20));
      // Now walk up to the page
      while (el && el.nodeName !== 'QOWT-PAGE') {
        el = Polymer.dom(el).parentNode;
      }
      // Check edge case just return the first page; should always be there
      return ((el === null) || (el.nodeName !== 'QOWT-PAGE')) ?
        Polymer.dom(this).querySelector('qowt-page') : el;
    },


    /** @private */
    updateDocumentBackground_: function(event) {
      var background = event.srcElement;
      if (background) {
        var color = background.getBackgroundColor();
        var pages = Polymer.dom(this).querySelectorAll('qowt-page');
        for (var i = 0; i < pages.length; ++i) {
          pages[i].setBackgroundColor(color);
        }
      }
    },


    /**
     * @private
     * @param {KeyboardShortcutEvent} shortcut A shortcut event
     */
    handleKeyboardShortcut_: function(shortcut) {
      if (shortcut && shortcut.detail && shortcut.detail.item &&
          shortcut.detail.item.id) {
        if (shortcut.detail.item.id === 'zoomActualSize') {
          this.zoomActualSize();
        }
      }
    }
  };

  function _blurToolbar() {
    PubSub.publish('qowt:blurMaintoolbar');
  }


  window.QowtMsdoc = Polymer(MixinUtils.mergeMixin(QowtElement, api_));

  return {};
});
