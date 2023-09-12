define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/squares/square'
], function(
    Constants
    /*baseSquare*/) {
  'use strict';

  window.QowtWSquare = Polymer({
    is: 'qowt-w-square',

    behaviors: [
      QowtSquareBehavior
    ],


    /**
     * The west square lies on the middle of the left edge(along y axis) of the
     * overlay
     * @param {Element} elm - overlay/ the underlay itself
     * @private
     */
    updatePosWrtElm_: function(elm) {
      this.customLeftPos = elm.offsetLeft - Constants.kSide / 2 +
          Constants.kUnit;
      this.customTopPos = elm.offsetTop + elm.clientHeight / 2 -
          Constants.kSide / 2 + Constants.kUnit;
      this.updateStyles();
    },


    onDrag_: function(mouseEvent) {
      var left = this.getBoundingClientRect().left;
      this.fire('w-square-moved', {xMovedBy: mouseEvent.clientX - left});
    }
  });

  return {};
});
