define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/squares/square'
], function(
    Constants
    /*baseSquare*/) {
  'use strict';

  window.QowtNESquare = Polymer({
    is: 'qowt-ne-square',

    behaviors: [
      QowtSquareBehavior
    ],


    /**
     * The north-east will shall lie at the top right corner of the overlay
     * @param {Element} elm - overlay/ the underlay itself
     * @private
     */
    updatePosWrtElm_: function(elm) {
      // The north-east square lies at the top right corner of the drawing
      // element
      this.customLeftPos = elm.offsetLeft + elm.clientWidth -
          Constants.kSide / 2 + Constants.kUnit;
      this.customTopPos = elm.offsetTop -
          Constants.kSide / 2 + Constants.kUnit;
      this.updateStyles();
    },


    onDrag_: function(mouseEvent) {
      var rect = this.getBoundingClientRect();
      var newData = {
        xMovedBy: mouseEvent.clientX - rect.left,
        yMovedBy: mouseEvent.clientY - rect.top
      };
      this.fire('ne-square-moved', newData);
    }
  });

  return {};
});
