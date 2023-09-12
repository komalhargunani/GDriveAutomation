define([
  'common/elements/selectionOverlay/constants',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/pubsub/pubsub'
], function(
    Constants,
    MixinUtils,
    QowtElement,
    PubSub) {

  'use strict';

  var kESquareMoved_ = 'e-square-moved';
  var kWSquareMoved_ = 'w-square-moved';
  var kNSquareMoved_ = 'n-square-moved';
  var kSSquareMoved_ = 's-square-moved';
  var kNESquareMoved_ = 'ne-square-moved';
  var kNWSquareMoved_ = 'nw-square-moved';
  var kSESquareMoved_ = 'se-square-moved';
  var kSWSquareMoved_ = 'sw-square-moved';
  var kSquareMoveStopped_ = 'square-move-stopped';
  var kUnderlayRepositioned_ = 'qowt:underlayRepositioned';
  var kUnderlaySizeChanged_ = 'qowt:underlaySizeChanged';
  var kUnit_ = Constants.kUnit;

  var selectionOverlayImpl_ = {
    is: 'qowt-selection-overlay',
    properties: {
      tokens: {
        type: Array,
        value: []
      },
      originalPos: {
        type: Object
      },
      minLenOfSide: {
        type: Number,
        value: Constants.kSide * 3 + 2,
        description: 'minimum length to which an image can be shrinked/ ' +
            'resized. Calculated as "lenOfSquare * noOfSquareOnEdge + ' +
            'sumOfGapBetweenSquares"'
      }
    },


    created: function() {
      this.tokens = [];
      this.onUnderlayAltered = this.onUnderlayAltered_.bind(this);
      this.onESquareMoved = this.onESquareMoved_.bind(this);
      this.onWSquareMoved = this.onWSquareMoved_.bind(this);
      this.onNSquareMoved = this.onNSquareMoved_.bind(this);
      this.onSSquareMoved = this.onSSquareMoved_.bind(this);
      this.onNESquareMoved = this.onNESquareMoved_.bind(this);
      this.onNWSquareMoved = this.onNWSquareMoved_.bind(this);
      this.onSESquareMoved = this.onSESquareMoved_.bind(this);
      this.onSWSquareMoved = this.onSWSquareMoved_.bind(this);
      this.onResize = this.onResize_.bind(this);
      this.onSelectionRepositon = this.onSelectionRepositioned_.bind(this);
    },


    attached: function() {
      document.addEventListener(kESquareMoved_, this.onESquareMoved);
      document.addEventListener(kWSquareMoved_, this.onWSquareMoved);
      document.addEventListener(kNSquareMoved_, this.onNSquareMoved);
      document.addEventListener(kSSquareMoved_, this.onSSquareMoved);
      document.addEventListener(kNESquareMoved_, this.onNESquareMoved);
      document.addEventListener(kNWSquareMoved_, this.onNWSquareMoved);
      document.addEventListener(kSESquareMoved_, this.onSESquareMoved);
      document.addEventListener(kSWSquareMoved_, this.onSWSquareMoved);
      document.addEventListener(kSquareMoveStopped_, this.onResize);
      this.tokens.push(PubSub.subscribe(kUnderlayRepositioned_,
          this.onSelectionRepositon));
      this.tokens.push(PubSub.subscribe(kUnderlaySizeChanged_,
          this.onUnderlayAltered));
    },


    detached: function() {
      document.removeEventListener(kESquareMoved_, this.onESquareMoved);
      document.removeEventListener(kWSquareMoved_, this.onWSquareMoved);
      document.removeEventListener(kNSquareMoved_, this.onNSquareMoved);
      document.removeEventListener(kSSquareMoved_, this.onSSquareMoved);
      document.removeEventListener(kNESquareMoved_, this.onNESquareMoved);
      document.removeEventListener(kNWSquareMoved_, this.onNWSquareMoved);
      document.removeEventListener(kSESquareMoved_, this.onSESquareMoved);
      document.removeEventListener(kSWSquareMoved_, this.onSWSquareMoved);
      document.removeEventListener(kSquareMoveStopped_, this.onResize);
      this.tokens.forEach(function(token) {PubSub.unsubscribe(token);});
    },


    factoryImpl: function(elm) {
      this.updatePosWrtElm_(elm);
    },


    get customLeftPos() {
      return _.get(this, 'customStyle.--leftPos');
    },


    set customLeftPos(val) {
      this.customStyle['--leftPos'] = val;
    },


    get customTopPos() {
      return _.get(this, 'customStyle.--topPos');
    },


    set customTopPos(val) {
      this.customStyle['--topPos'] = val;
    },


    get customWidth() {
      return _.get(this, 'customStyle.--width');
    },


    set customWidth(val) {
      this.customStyle['--width'] = val;
    },


    get customHeight() {
      return _.get(this, 'customStyle.--height');
    },


    set customHeight(val) {
      this.customStyle['--height'] = val;
    },


    get width() {
      return parseFloat(this.customWidth);
    },


    get height() {
      return parseFloat(this.customHeight);
    },


    get left() {
      return parseFloat(this.customLeftPos);
    },


    get top() {
      return parseFloat(this.customTopPos);
    },


    /**
     * Updates the position and dimension of the overlay w.r.t the given element
     * @param {Object} elm - reference element w.r.t which the overlay should be
     *                       adjusted/ updated
     * @private
     */
    updatePosWrtElm_: function(elm) {
      // avoid updating this, if there is no reference
      if (elm) {
        var rect = this.originalPos = this.getElmPosWrtMsDoc_(elm);
        this.customLeftPos = rect.left + kUnit_;
        this.customTopPos = rect.top + kUnit_;
        this.customWidth = rect.width + kUnit_;
        this.customHeight = rect.height + kUnit_;
        this.updateStyles();
      }
    },


    /**
     * Alters width if the change is > than the minimum len of side.
     * @param {Event} customEvent
     * @return {boolean} - True if the width is altered, false otherwise
     * @private
     */
    alterWidthIfValid_: function(customEvent) {
      var newWidth = this.width + customEvent.detail.xMovedBy;
      if (newWidth > this.minLenOfSide) {
        this.customWidth = newWidth + kUnit_;
        return true;
      }
      return false;
    },


    /**
     * Alters height if the change is > than the minimum len of side.
     * @param {Event} customEvent
     * @return {boolean} - True if the height is altered, false otherwise
     * @private
     */
    alterHeightIfValid_: function(customEvent) {
      var newHeight = this.height + customEvent.detail.yMovedBy;
      if (newHeight > this.minLenOfSide) {
        this.customHeight = newHeight + kUnit_;
        return true;
      }
      return false;
    },


    /**
     * Repositions left pos, alters width if the change is > than the minimum
     * len of side.
     * @param {Event} customEvent
     * @return {boolean} - True if the width is altered, false otherwise
     * @private
     */
    changeLeftAndAlterWidthIfValid_: function(customEvent) {
      var newWidth = this.width - customEvent.detail.xMovedBy;
      if (newWidth > this.minLenOfSide) {
        this.customLeftPos = this.left + customEvent.detail.xMovedBy + kUnit_;
        this.customWidth = newWidth + kUnit_;
        return true;
      }
      return false;
    },


    /**
     * Repositions top pos, alters height if the change is > than the minimum
     * len of side.
     * @param {Event} customEvent
     * @return {boolean} - True if the height is altered, false otherwise
     * @private
     */
    changeTopAndAlterHeightIfValid_: function(customEvent) {
      var newHeight = this.height - customEvent.detail.yMovedBy;
      if (newHeight > this.minLenOfSide) {
        this.customTopPos = this.top + customEvent.detail.yMovedBy + kUnit_;
        this.customHeight = newHeight + kUnit_;
        return true;
      }
      return false;
    },


    /**
     * Adjusts the width of overlay when the east square is moved
     * @param {Event} customEvent
     * @private
     */
    onESquareMoved_: function(customEvent) {
      this.alterWidthIfValid_(customEvent) && this.updateStyleAndFireResize_();
    },


    /**
     * Adjusts the width of overlay when the west square is moved
     * @param {Event} customEvent
     * @private
     */
    onWSquareMoved_: function(customEvent) {
      this.changeLeftAndAlterWidthIfValid_(customEvent) &&
          this.updateStyleAndFireResize_();
    },


    /**
     * Adjusts the height of overlay when the north square is moved
     * @param {Event} customEvent
     * @private
     */
    onNSquareMoved_: function(customEvent) {
      this.changeTopAndAlterHeightIfValid_(customEvent) &&
          this.updateStyleAndFireResize_();
    },


    /**
     * Adjusts the height of overlay when the south square is moved
     * @param {Event} customEvent
     * @private
     */
    onSSquareMoved_: function(customEvent) {
      this.alterHeightIfValid_(customEvent) && this.updateStyleAndFireResize_();
    },


    /**
     * Adjusts the dimensions of overlay when the north east square is moved
     * @param {Event} customEvent
     * @private
     */
    onNESquareMoved_: function(customEvent) {
      var heightAltered = this.changeTopAndAlterHeightIfValid_(customEvent);
      var widthAltered = this.alterWidthIfValid_(customEvent);
      if (heightAltered || widthAltered) {
        this.updateStyleAndFireResize_();
      }
    },


    /**
     * Adjusts the dimensions of overlay when the north west square is moved
     * @param {Event} customEvent
     * @private
     */
    onNWSquareMoved_: function(customEvent) {
      var heightAltered = this.changeTopAndAlterHeightIfValid_(customEvent);
      var widthAltered = this.changeLeftAndAlterWidthIfValid_(customEvent);
      if (heightAltered || widthAltered) {
        this.updateStyleAndFireResize_();
      }
    },


    /**
     * Adjusts the dimensions of overlay when the south east square is moved
     * @param {Event} customEvent
     * @private
     */
    onSESquareMoved_: function(customEvent) {
      var heightAltered = this.alterHeightIfValid_(customEvent);
      var widthAltered = this.alterWidthIfValid_(customEvent);
      if (heightAltered || widthAltered) {
        this.updateStyleAndFireResize_();
      }
    },


    /**
     * Adjusts the dimensions of overlay when the south west square is moved
     * @param {Event} customEvent
     * @private
     */
    onSWSquareMoved_: function(customEvent) {
      var heightAltered = this.alterHeightIfValid_(customEvent);
      var widthAltered = this.changeLeftAndAlterWidthIfValid_(customEvent);
      if (heightAltered || widthAltered) {
        this.updateStyleAndFireResize_();
      }
    },


    /**
     * update styles and fire overlay-reSized so that the squares lying on the
     * overlay re-position themselves
     * itself
     * @private
     */
    updateStyleAndFireResize_: function() {
      this.updateStyles();
      this.fire('overlay-reSized', this);
    },


    /**
     * Callback, called when the movement of the square is stopped, this means
     * that user has resized the selection. This function publishes a signal
     * 'qowt:selectionResized' so that the underlying element resizes itself
     * @private
     */
    onResize_: function(/*customEvent*/) {
      var rect = this.getElmPosWrtMsDoc_(this);
      var context = {
        leftMovedBy: rect.left - this.originalPos.left,
        topMovedBy: rect.top - this.originalPos.top,
        widthAlteredBy: rect.width - this.originalPos.width,
        heightAlteredBy: rect.height - this.originalPos.height
      };
      this.originalPos = rect;
      PubSub.publish('qowt:selectionResized', context);
    },


    /**
     *
     * @param {Object} signal
     * @param {Object} signalData
     * @private
     */
    onSelectionRepositioned_: function(signal, signalData) {
      signal = signal || '';
      this.updatePosWrtElm_(signalData);
      this.fire('overlay-rePositioned', this);
    },

    /**
     * Callback function that gets called when the underlay is repositioned or
     * re-sized. This function shall be called multiple times since the underlay
     * can be adjusted/ altered multiple times while rendering in the dom
     *
     * @param {String } signal - the published signal
     * @param {Object} signalData - data associated with the signal
     * @private
     */
    onUnderlayAltered_: function(signal, signalData) {
      signal = signal || '';
      this.updatePosWrtElm_(signalData);
      this.fire('overlay-rePositioned', this);
    },


    /**
     * Returns the postion of an element w.r.t ms doc
     * @param {Element} elm
     * @return {Object} rect{left, top, width, height}
     * @private
     */
    getElmPosWrtMsDoc_: function(elm) {
      var rect = {};
      var msdoc = document.getElementsByTagName('qowt-msdoc')[0];
      var msdocRect = msdoc.getBoundingClientRect();
      var elmRect = elm.getBoundingClientRect();
      rect.width = elmRect.width;
      rect.height = elmRect.height;
      rect.left = elmRect.left - msdocRect.left;
      rect.top = elmRect.top - msdocRect.top;
      return rect;
    }
  };

  window.QowtSelectionOverlay =
      Polymer(MixinUtils.mergeMixin(QowtElement, selectionOverlayImpl_));

  return {};
});
