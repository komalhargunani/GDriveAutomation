define([
  'common/mixins/decorators/drawing/distanceFromText',
  'common/mixins/decorators/drawing/horizontalPosition',
  'common/mixins/decorators/drawing/horizontalPositionRelativeTo',
  'common/mixins/decorators/drawing/horizontalPosOffset',
  'common/mixins/decorators/drawing/relativeHeight',
  'common/mixins/decorators/drawing/verticalPosition',
  'common/mixins/decorators/drawing/verticalPositionRelativeTo',
  'common/mixins/decorators/drawing/verticalPosOffset',
  'common/mixins/decorators/drawing/wrappingStyle',
  'common/mixins/decorators/drawing/wrapText',
  'common/mixins/mixinUtils',
  'common/mixins/qowtElement',
  'qowtRoot/pubsub/pubsub',
  'qowtRoot/utils/converters/converter',
  'common/elements/selectionOverlay/selectableBehavior'
], function(
    DistanceFromText,
    HorizontalPosition,
    HorizontalPositionRelativeTo,
    HorizontalPosOffset,
    RelativeHeight,
    VerticalPosition,
    VerticalPositionRelativeTo,
    VerticalPosOffset,
    WrappingStyle,
    WrapText,
    MixinUtils,
    QowtElement,
    PubSub,
    Converter
    /*selectableBehavior*/) {

  'use strict';

  var kUnit_ = 'pt';
  var pxUnit_ = 'px';

  var drawingProto = {
    is: 'qowt-drawing',
    etp: 'drawing',

    hostAttributes: {
      contenteditable: 'false'
    },

    behaviors: [
      QowtSelectableBehavior
    ],

    observers: [
      'updateStyle_(model.horizontalPosOffset)',
      'updateStyle_(model.verticalPosOffset)',
      'updateStyle_(model.wrappingStyle)',
      'updateStyle_(model.horizontalPosition)',
      'updateStyle_(model.verticalPosition)',
      'updateStyle_(model.horizontalPositionRel)',
      'updateStyle_(model.verticalPositionRel)',
      'updateStyle_(model.distanceFromText)'
    ],

    attached: function() {
      // TODO: Remove this code once we start supporting editing header & footer
      if (this.isInHF_()) {
        this.style.cursor = 'text';
        if (this.children[0]) {
          this.children[0].style.cursor = 'text';
        }
      }
    },

    isAbsolutelyPositioned: function() {
      return this.wrappingStyle === 'inFrontOfText' || this.wrappingStyle ===
          'behindText';
    },

    isWrappedBehindText: function() {
      return this.wrappingStyle === 'behindText';
    },

    getElementBox: function() {
      return this.firstElementChild ?
       this.firstElementChild.getBoundingClientRect() :
       this.getBoundingClientRect();
    },

    reLayout: function() {
      // set the negative left value to textbox/image if its absolutely
      // positioned and horizontal right alignment is set.
      if (this.isAbsolutelyPositioned() &&
          this.horizontalPosition === 'alignmentRight') {
            this.firstElementChild.style.left =
            - this.getElementBox().width + 'px';
      }
      this.updateStyle_();
    },

    get leftPosOffset() {
      var offsetLeft = _.get(this, 'horizontalPosOffset', 0 /*default*/);
      return Converter.twip2pt(offsetLeft) + kUnit_;
    },

    get topPosOffset() {
      var offsetTop = _.get(this, 'verticalPosOffset', 0 /*default*/);
      return Converter.twip2pt(offsetTop) + kUnit_;
    },

    get customLeftPos() {
      return _.get(this, 'customStyle.--left-pos');
    },


    set customLeftPos(val) {
      this.customStyle['--left-pos'] = val;
    },


    get customTopPos() {
      return _.get(this, 'customStyle.--top-pos');
    },


    set customTopPos(val) {
      this.customStyle['--top-pos'] = val;
    },


    get customWidth() {
      return _.get(this, 'customStyle.--width');
    },


    set customWidth(val) {
      this.customStyle['--width'] = val;
    },


    get customFloat() {
      return _.get(this, 'customStyle.--float');
    },


    set customFloat(val) {
      this.customStyle['--float'] = val;
    },

    updateStyle_: function(/* current, previous */) {
      var floatVal = this.float;
      this.customFloat = floatVal;
      this.customWidth = floatVal === 'right' ? '100%' : 'auto';
      this.customLeftPos = this.leftPosOffset;
      this.customTopPos = this.topPosOffset;
      this.updateDistanceFromText_();
      this.updateStylesPublishReposition_();
    },

    resize_: function(signalData) {
      this.horizontalPosOffset += Converter.px2twip(signalData.leftMovedBy);
      this.verticalPosOffset += Converter.px2twip(signalData.topMovedBy);
      this.children[0].resize(signalData);
      this.updateStylesPublishReposition_();
    },

    updateStylesPublishReposition_: function() {
      this.updateStyles();
      // If the drawing has repositioned then the overlay(if there is any)
      // should also be repositioned
      if (this.hasImage() && this.isSelected()) {
        window.setTimeout(function() {
          PubSub.publish('qowt:underlayRepositioned', this.children[0]);
        }.bind(this), 0);
      }
    },

    updateDistanceFromText_: function() {
      var distanceFromText = this.distanceFromText;

      if (distanceFromText && this.children[0]) {
        this.children[0].style.marginBottom =
          Converter.twip2px(distanceFromText.b) + pxUnit_;
        this.children[0].style.marginLeft =
          Converter.twip2px(distanceFromText.l) + pxUnit_;
        this.children[0].style.marginRight =
          Converter.twip2px(distanceFromText.r) + pxUnit_;

        if (this.float === 'left') {
          this.children[0].style.marginLeft = 0 + pxUnit_;

        } else if (this.float === 'right') {
          this.children[0].style.marginRight = 0 + pxUnit_;
        }

        this.children[0].style.marginTop =
          Converter.twip2px(distanceFromText.t) + pxUnit_;
      }
    },

    /**
     * @return {boolean} - true if this element is in header or footer, false
     *                     otherwise
     * @private
     */
    isInHF_: function() {
      var parentNode = this.parentNode;
      while (parentNode && !(parentNode instanceof QowtPage)) {
        if (parentNode instanceof QowtHeader ||
            parentNode instanceof QowtFooter) {
          return true;
        }
        parentNode = parentNode.parentNode;
      }
      return false;
    },

    /**
     * Determines if the click on this object is valid. Some drawing elements(
     * ex. the elements with wrapStyle) have padding applied so that the
     * positioning of its child is appropriate. Only the click on drawing's
     * child should be considered as a valid click; the click on area of padding
     * should be considered as invalid click.
     * @param {MouseEvent} event
     * @return {Boolean} True if the click is valid, false otherwise.
     * @private
     */
    isValidClick_: function(event) {
      if (this.children[0]) {
        var childRect = this.children[0].getBoundingClientRect();
        if (childRect.left <= event.detail.x &&
            childRect.right >= event.detail.x &&
            childRect.top <= event.detail.y &&
            childRect.bottom >= event.detail.y) {
          return true;
        }
      }
      return false;
    },

    /**
     * @return {boolean} True if the drawing has image, false otherwise.
     */
    hasImage: function() {
      return this.children[0] instanceof QowtWordImage;
    },


    onWindowScrollOrZoom_: function(/*event*/) {
      // publish only when the child is attached to this elm
      if (this.children[0]) {
        PubSub.publish('qowt:underlayRepositioned', this.children[0]);
      }
    }
  };

  window.QowtDrawing = Polymer(MixinUtils.mergeMixin(
      QowtElement,
      DistanceFromText,
      HorizontalPosition,
      HorizontalPositionRelativeTo,
      HorizontalPosOffset,
      RelativeHeight,
      VerticalPosition,
      VerticalPositionRelativeTo,
      VerticalPosOffset,
      WrappingStyle,
      WrapText,
      drawingProto));

  return {};
});
