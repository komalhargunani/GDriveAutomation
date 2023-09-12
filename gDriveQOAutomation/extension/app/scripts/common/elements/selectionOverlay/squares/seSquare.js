define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/squares/square'
], function(
    Constants
    /*baseSquare*/) {
  'use strict';

  window.QowtSESquare = Polymer({
    is: 'qowt-se-square',

    behaviors: [
      QowtSquareBehavior
    ],


    /**
     * The south east square will lie at the bottom right corner of the overlay
     * @param {Element} elm - overlay/ the underlay itself
     * @private
     */
    updatePosWrtElm_: function(elm) {
      this.customLeftPos = elm.offsetLeft + elm.clientWidth -
          Constants.kSide / 2 + Constants.kUnit;
      this.customTopPos = elm.offsetTop + elm.clientHeight -
          Constants.kSide / 2 + Constants.kUnit;
      this.updateStyles();
    },


    onDrag_: function(mouseEvent) {
      var rect = this.getBoundingClientRect();
      var newData = {
        xMovedBy: mouseEvent.clientX - rect.left,
        yMovedBy: mouseEvent.clientY - rect.top
      };
      this.fire('se-square-moved', newData);
    }
  });

  return {};
});
