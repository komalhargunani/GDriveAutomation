define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/squares/square'
], function(
    Constants
    /*baseSquare*/) {
  'use strict';

  window.QowtESquare = Polymer({
    is: 'qowt-e-square',

    behaviors: [
      QowtSquareBehavior
    ],


    /**
     * The east square will lie on the middle of the right edge(along y axis)
     * of the overlay
     * @param {Element} elm - overlay/ the underlay itself
     * @private
     */
    updatePosWrtElm_: function(elm) {
      this.customLeftPos = elm.offsetLeft + elm.clientWidth -
          Constants.kSide / 2 + Constants.kUnit;
      this.customTopPos = elm.offsetTop + elm.clientHeight / 2 -
          Constants.kSide / 2 + Constants.kUnit;
      this.updateStyles();
    },


    onDrag_: function(mouseEvent) {
      var left = this.getBoundingClientRect().left;
      this.fire('e-square-moved', {xMovedBy: mouseEvent.clientX - left});
    }
  });

  return {};
});
