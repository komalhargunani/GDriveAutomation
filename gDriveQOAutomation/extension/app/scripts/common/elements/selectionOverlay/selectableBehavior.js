define([
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/domTextSelection'
], function(
    PubSub,
    DomTextSelection) {

  'use strict';

  var kEscapeKeyCode_ = 27;
  var kDeleteKeyCode_ = 46;
  var kBackspaceKeyCode_ = 8;
  var kContentType_ = 'selectionOverlay';
  var kModifiers_ = ['shift', 'alt', 'cmd', 'ctrl'];
  var docContainer_;


  window.QowtSelectableBehavior = {
    listeners: {
      tap: 'onTapHandler_'
    },


    properties: {
      selected: {
        type: Boolean,
        value: false
      },
      tokens: {
        type: Array,
        value: []
      }
    },

    attached: function() {
      docContainer_ = document.getElementById('qowt-doc-container');
    },


    /**
     * If this is selected and a delete/ backspace key is hit then, this element
     * looses selection, it'll be removed from the dom and then the caret will
     * be placed appropriately for further editing purpose.
     *
     * @private
     */
    onDeleteKey_: function() {
      this.deSelect_('onDeleteKey');
      // Once the overlay is lost; the previous selection is restored and the
      // respective tool is activated, currently it will be the text tool. There
      // is a possibility that the text tool might as well listen to the delete
      // key, and end up deleting a character or the selection. To prevent that
      // we remove the range. And set back the caret(appropriately) once this
      // element is removed from dom.
      window.getSelection().removeAllRanges();
      var positionInfo = this.getCaretPositionInfo_();
      // TODO(umesh.kadam): should we have deleteBBD for images ? will core have
      // any issues while undo redo if deleteBBD is requested?
      Polymer.dom(this.parentNode).removeChild(this);
      Polymer.dom(this.parentNode).flush();
      this.setAttribute('removedFromShady', true);
      // Allow the node to be removed then set the caret position
      window.setTimeout(function() {
        DomTextSelection.setCaret(positionInfo.node, positionInfo.offset);
      }, 0);
    },


    /**
     * If this is selected and an escape key is pressed then the selection
     * overlay is removed and the caret is placed appropriately based on the
     * wrap style of this element
     *
     * @private
     */
    onEscapeKey_: function() {
      // TODO(umesh.kadam): Discuss with Ha, the expected behavior
      // this.deSelect_('onEscapeKey');
      // var positionInfo = this.getCaretPositionInfo_();
      // DomTextSelection.setCaret(positionInfo.node, positionInfo.offset);
    },


    /**
     * @return {Boolean} True if this is selected, false otherwise.
     */
    isSelected: function() {
      return this.selected;
    },


    /**
     * Handles the key down event. Based on the keys tapped, it calls the
     * respective handlers
     *
     * @param {Object} signal - the published signal
     * @param {Object} signalData - the data associated with the signal
     * @private
     */
    onKeyDownHandler_: function(signal, signalData) {
      function isModifierKeyPressed() {
        return _.some(kModifiers_, function(modifier) {
          var modifierKey = (modifier === 'cmd') ? 'metaKey' : modifier + 'Key';
          return signalData.event[modifierKey];
        });
      }

      signal = signal || '';
      var contentType = signalData && signalData.contentType;
      var keyCode = _.get(signalData, 'event.keyCode');

      if (this.selected && contentType === kContentType_) {
        // allow only modifier keys to propagate.
        if (!isModifierKeyPressed()) {
          signalData.event.stopPropagation();
          signalData.event.preventDefault();
        }

        switch (keyCode) {
          case kDeleteKeyCode_:
          case kBackspaceKeyCode_:
            return this.onDeleteKey_();
          case kEscapeKeyCode_:
            return this.onEscapeKey_();
          default: return;
        }
      }
    },


    /**
     * Handles the tap on this element. Adds a selection overlay to this element
     * and listens for selection changes and keys (Ex: delete, escape).
     *
     * @private
     */
    onTapHandler_: function(event) {
      // TODO: We should enable selection of elements in header footer once we
      // start supporting editing.
      var isInHF = _.isFunction(this.isInHF_) && this.isInHF_();
      var isValidClick = _.isFunction(this.isValidClick_) ?
          this.isValidClick_(event) : true /*default it to be a valid click*/;
      if (isValidClick && !isInHF) {
        this.select();
      } else if (this.selected) {
        this.deSelect_('onClick');
      }
    },


    /**
     * Selects this element
     */
    select: function() {
      if (this.hasImage() && !this.selected) {
        window.getSelection().removeAllRanges();
        this.selected = true;
        this.focus();
        PubSub.publish('qowt:requestFocus', {contentType: kContentType_,
          // do not allow other elms to be stacked on this; in selectionManager
          preStackAddition: function doNotStack(signalData) {
            return signalData.contentType !== kContentType_;
          },
          nodeId: this.id});

        // 'qowt:requestFocus' disables mutation manager, only then add the
        // handlers
        this.addOverlayAndHandlers_(this.children[0]);
        this.listenForSignalsAndEvents_();
      }
    },


    /**
     * Removes the selection overlay and looses focus
     * @private
     */
    removeOverlay_: function(/*signal, signalData*/) {
      this.deSelect_('onSignal');
    },


    /**
     * Removes the selection overlay and looses focus
     * @private
     */
    deSelect_: function(why) {
      if (this.selected) {
        this.selected = false;
        this.unsubscribeTokens_();
        PubSub.publish('qowt:requestFocusLost', {contentType: kContentType_,
          nodeId: this.id, focusLostOn: why});

        var overlay = document.body.getElementById(kContentType_);
        docContainer_.removeChild(overlay);
      }
    },


    onScrollOrZoom_: function(event) {
      // if underlay element wants to act on scroll then it'll have the function
      // onWindowScroll_ defined
      if (_.isFunction(this.onWindowScrollOrZoom_)) {
        this.onWindowScrollOrZoom_(event);
      }
    },


    /**
     * If this element is selected and the action is undo/ redo then this
     * element should simply renounce its selection. It should be as dumb as
     * possible, it should neither maintain a state nor should handle anything
     * it should simply loose its selection and let the handlers deal with the
     * undo/redo request.
     *
     * @param {Object} signal - the signal published
     * @param {Object} signalData - associated data with the signal
     * @private
     */
    onUndoRedo_: function(signal, signalData) {
      signal = signal || '';
      var action = signalData && signalData.action;
      if (action === 'undo' || action === 'redo') {
        this.deSelect_('onUndoRedo');
        // When this element is selected, all other helpers are suppressed.
        // Meaning any action requested, will be listened by this element alone
        // & since this behavior is dumb, it wouldn't have handled the undo/redo
        // request. We re-fire the signal so that an appropriate handler handles
        // the request.
        if (signal === 'qowt:requestAction') {
          window.setTimeout(function() {
            PubSub.publish(signal, signalData);
          }, 0);
        }
      }
    },


    /**
     * Unsubscribes all the tokens
     * @private
     */
    unsubscribeTokens_: function() {
      this.tokens.forEach(function(token) {
        PubSub.unsubscribe(token);
      });
      docContainer_.removeEventListener('scroll',
          this.onScrollOrZoom_.bind(this));
    },


    /**
     * Listens for signals and events
     * @private
     */
    listenForSignalsAndEvents_: function() {
      var removeOverlay = this.removeOverlay_.bind(this);

      this.tokens.push(PubSub.subscribe('qowt:selectionChanged',
          removeOverlay));
      this.tokens.push(PubSub.subscribe('qowt:looseSelectionOverlay',
          removeOverlay));
      this.tokens.push(PubSub.subscribe('qowt:requestAction',
          this.onUndoRedo_.bind(this)));
      this.tokens.push(PubSub.subscribe('qowt:doAction',
          this.onUndoRedo_.bind(this)));
      this.tokens.push(PubSub.subscribe('qowt:msDocScaleChanged',
          this.onScrollOrZoom_.bind(this)));
      this.tokens.push(PubSub.subscribe('qowt:selectionResized',
          this.onResize_.bind(this)));
      // irrespective of individual keys or shortcuts being pressed,
      // viewLayoutControl publishes them as shortcutKeys. We listen to the
      // same.
      this.tokens.push(PubSub.subscribe('qowt:shortcutKeys',
          this.onKeyDownHandler_.bind(this)));
      docContainer_.addEventListener('scroll', this.onScrollOrZoom_.bind(this));
    },


    /**
     * @return {{offset: number, node: Element | undefined}} Returns the
     *                            container node | undefined at which the caret
     *                            needs to be placed.
     * @private
     */
    getCaretPositionInfo_: function() {
      function getFirstRun() {
        return _.find(this.parentNode.children, function(child) {
          return child instanceof QowtWordRun;
        });
      }

      function getPreviousRun() {
        var node = this.previousSibling;

        while (node && this.parentNode.contains(node) &&
            !(node instanceof QowtWordRun)) {
          node = node.previousSibling;
        }
        return node;
      }

      function getLastTextNode(run) {
        return run && (_.isEmpty(run.children) ? run.lastChild :
            _.findLast(run.children, function(child) {
              return child.nodeType === Node.TEXT_NODE;
            }));
      }

      var positionInfo = {offset: 0, node: undefined};
      if (this.isAbsolutelyPositioned()) {
        positionInfo.node = getFirstRun.bind(this)();
      } else {
        positionInfo.node = getLastTextNode(getPreviousRun.bind(this)());
        if (positionInfo.node) {
          positionInfo.offset = positionInfo.node.textContent.length;
        }
      }
      positionInfo.node = positionInfo.node || this.parentNode;
      return positionInfo;
    },


    /**
     * Adds selection overlay to this element
     *
     * @param {Element} child - Child element of this
     * @private
     */
    addOverlayAndHandlers_: function(child) {
      // Note attaching the div before appending the overlay and squares is imp
      // here because the absolute positioning of the overlay and square will be
      // calculated w.r.t the nearest positioned element
      var div = document.createElement('div');
      div.id = kContentType_;
      docContainer_.appendChild(div);

      child = child || this.children[0];
      var overlay = new QowtSelectionOverlay(child);
      div.appendChild(overlay);
      setTimeout(function() {
        div.appendChild(new QowtESquare(overlay));
        div.appendChild(new QowtWSquare(overlay));
        div.appendChild(new QowtNSquare(overlay));
        div.appendChild(new QowtSSquare(overlay));
        div.appendChild(new QowtNESquare(overlay));
        div.appendChild(new QowtNWSquare(overlay));
        div.appendChild(new QowtSESquare(overlay));
        div.appendChild(new QowtSWSquare(overlay));
      }, 0);

    },


    onResize_: function(signal, signalData) {
      signal = signal || '';
      if (this.selected && _.isFunction(this.resize_)) {
        this.resize_(signalData);
      }
    },


    /**
     * Note: This function should solely be used for E2E's only.
     */
    getExpectedCaretPos: function() {
      var positionInfo = this.getCaretPositionInfo_();
      return positionInfo.offset;
    }
  };

  return {};
});
