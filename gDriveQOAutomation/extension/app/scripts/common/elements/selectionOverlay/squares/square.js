define([
  'common/elements/selectionOverlay/constants',
  'common/elements/selectionOverlay/squares/square'
], function(
    Constants
    /*baseSquare*/) {
  'use strict';

  var kLeftMouseButton_ = 1;
  var kOverlayResized_ = 'overlay-reSized';
  var kOverlayRePositioned_ = 'overlay-rePositioned';

  // TODO(umesh.kadam): Update fakeEvent.js to use MouseEvent constructor so
  // that the following is not needed
  var kLeftMouseButtonE2E_ = 0;

  window.QowtSquareBehavior = {
    hostAttributes: {
      draggable: 'true'
    },


    listeners: {
      mousedown: 'onMouseDown_'
    },

    created: function() {
      this.onOverlayAltered = this.onOverlayAltered_.bind(this);
    },


    attached: function() {
      document.addEventListener(kOverlayResized_, this.onOverlayAltered);
      document.addEventListener(kOverlayRePositioned_, this.onOverlayAltered);
    },


    factoryImpl: function(elm) {
      // avoid updating this, if there is no reference
      if (elm) {
        this.customWidth = Constants.kSide + Constants.kUnit;
        this.customHeight = Constants.kSide + Constants.kUnit;
        this.updatePosWrtElm_(elm);
      }
    },


    detached: function() {
      document.removeEventListener(kOverlayResized_, this.onOverlayAltered);
      document.removeEventListener(kOverlayRePositioned_,
          this.onOverlayAltered);
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


    onMouseDown_: function(mouseEvent) {
      function isLeftButtonPressed() {
        return (mouseEvent.buttons === kLeftMouseButton_ ||
            mouseEvent.button === kLeftMouseButtonE2E_);
      }

      if (isLeftButtonPressed()) {
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();

        this.onDragCallback = this.onDrag_.bind(this);
        this.onMouseUpCallback = this.onMouseUp_.bind(this);
        window.addEventListener('mousemove', this.onDragCallback);
        window.addEventListener('mouseup', this.onMouseUpCallback);
      }
    },


    onMouseUp_: function() {
      window.removeEventListener('mousemove', this.onDragCallback);
      window.removeEventListener('mouseup', this.onMouseUpCallback);

      this.onDragCallback = this.onMouseUpCallback = undefined;
      this.fire('square-move-stopped');
    },


    /**
     * Call back function to reposition this square when the overlay is
     * re-sized/ repositioned
     * @param {Event} customEvent - the custom event with new details
     * @private
     */
    onOverlayAltered_: function(customEvent) {
      this.updatePosWrtElm_(customEvent.detail);
    }
  };

  return {};
});
