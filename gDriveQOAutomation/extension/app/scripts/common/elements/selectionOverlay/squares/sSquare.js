define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/squares/square'
], function(
    Constants
    /*baseSquare*/) {
  'use strict';

  window.QowtSSquare = Polymer({
    is: 'qowt-s-square',

    behaviors: [
      QowtSquareBehavior
    ],


    /**
     * The south square will lie on the middle of the bottom edge(along x axis)
     * of the overlay
     * @param {Element} elm - overlay/ the underlay itself
     * @private
     */
    updatePosWrtElm_: function(elm) {
      this.customLeftPos = elm.offsetLeft + elm.clientWidth / 2 -
          Constants.kSide / 2 + Constants.kUnit;
      this.customTopPos = elm.offsetTop + elm.clientHeight -
          Constants.kSide / 2 + Constants.kUnit;
      this.updateStyles();
    },


    onDrag_: function(mouseEvent) {
      var top = this.getBoundingClientRect().top;
      this.fire('s-square-moved', {yMovedBy: mouseEvent.clientY - top});
    }
  });

  return {};
});
