define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/squares/square'
], function(
    Constants
    /*baseSquare*/) {
  'use strict';

  window.QowtNWSquare = Polymer({
    is: 'qowt-nw-square',

    behaviors: [
      QowtSquareBehavior
    ],


    /**
     * The north-west square will lie at the top left corner of the overlay
     * @param {Element} elm - overlay/ the underlay itself
     * @private
     */
    updatePosWrtElm_: function(elm) {
      this.customLeftPos = elm.offsetLeft - Constants.kSide / 2 +
          Constants.kUnit;
      this.customTopPos = elm.offsetTop - Constants.kSide / 2 + Constants.kUnit;
      this.updateStyles();
    },


    onDrag_: function(mouseEvent) {
      var rect = this.getBoundingClientRect();
      var newData = {
        xMovedBy: mouseEvent.clientX - rect.left,
        yMovedBy: mouseEvent.clientY - rect.top
      };
      this.fire('nw-square-moved', newData);
    }
  });

  return {};
});
