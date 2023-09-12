/**
 * @fileoverview Mixin to trap focus in an element. To enable the feature, the
 * "trap-focus" attribute must be set on the element. Once mixed in, you can set
 * attributes "focus-start" and "focus-end" on the outermost elements of the
 * trapped focus cycle. You can also leave out the "focus-start" attribute if
 * you desire for the entire element to be the start, but make sure it's
 * focusable (tabindex='0')!
 *
 * An optional attribute static-trap is also available if you would like to only
 * search for the endpoints one time. This is good if your endpoints will never
 * change.
 *
 * The element that mixes this in must call TrapFocus.ready.call(this) if it
 * uses ready.
 *
 * @author cuiffo@google.com (Eric Cuiffo)
 */
define([], function() {

  'use strict';

  var kTabKeyCode_ = 9;

  return {


    /** The element where focus begins. @type {Element} @private */
    focusStart_: undefined,


    /** The element where focus ends. @type {Element} @private */
    focusEnd_: undefined,


    /**
     * Setup the initial focus trap as well as setup a mutation observer to
     * adjust the focus on every change in the DOM.
     * @public
     */
    ready: function() {
      this.addEventListener('keydown', this.keyHandler_.bind(this));
      this.trapFocus_();
      if (!this.hasAttribute('static-trap')) {
        this.onMutation(this, this.trapFocus_);
      }
    },


    /**
     * Find the first and last focusable element. Find the first instance for
     * focus-start and the last instance for focus-end even though there should
     * really only be one of each.
     * @private
     */
    trapFocus_: function() {
      if (this.hasAttribute('trap-focus')) {
        this.focusStart_ =
          Polymer.dom(this.root).querySelector('[focus-start]') || this;
        var focusEnd = Polymer.dom(this.root).querySelectorAll('[focus-end]');
        this.focusEnd_ = focusEnd[focusEnd.length - 1];
      }
    },


    /**
     * When tab (without shift) has been pressed on the last element or
     * shift+tab has been pressed on the first element, set focus to the
     * element at the opposite end.
     * @param {KeyboardEvent} e The keyboard event.
     * @private
     */
    keyHandler_: function(e) {
      if (e.keyCode === kTabKeyCode_ && e.path) {
        if (e.shiftKey && e.path[0] === this.focusStart_ && this.focusEnd_) {
          this.focusEnd_.focus();
          e.preventDefault();
        } else if (!e.shiftKey && e.path[0] === this.focusEnd_ &&
            this.focusStart_) {
          this.focusStart_.focus();
          e.preventDefault();
        }
      }
    }
  };
});
